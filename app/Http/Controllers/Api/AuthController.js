'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Judge = use('App/Model/Judge')

class AuthController {
  /**
   * API Login route
   */
  * login (request, response) {
    const credentials = {
      username: request.input('username'),
      password: request.input('password')
    }

    const user = yield Judge.getByCredentials(credentials.username, credentials.password)

    if (user == null) {
      return response.status(403).send({
        error: {
          message: 'Invalid username and/or password'
        }
      })
    }

    yield user.generateToken()
    yield user.save()

    response.send({ user })
  }

  /**
   * API Logout route
   */
  * logout (request, response) {
    const credentials = {
      username: request.input('username'),
      token: request.input('token')
    }

    const user = yield Judge.getByToken(credentials.username, credentials.token)

    if (user == null) {
      return response.status(403).send({
        error: {
          message: 'Invalid access token'
        }
      })
    }

    user.invalidateToken()

    yield user.save()

    response.status(204).send()
  }
}

module.exports = AuthController
