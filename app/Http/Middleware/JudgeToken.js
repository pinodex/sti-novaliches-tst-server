'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Judge = use('App/Model/Judge'),
      authorization = require('auth-header')

class JudgeToken {

  * handle (request, response, next) {
    const authorizationHeader = request.header('authorization')

    if (authorizationHeader == null) {
      return response.status(401).send({
        error: { message: 'Cannot authorize client' }
      })
    }

    const auth = authorization.parse(authorizationHeader)

    if (auth.scheme != 'Bearer') {
      return response.status(400).send({
        error: { message: 'Unknown authorization scheme' }
      })
    }

    const user = yield Judge.checkToken(auth.token)

    if (!user) {
      return response.status(400).send({
        error: { message: 'Invalid authorization token' }
      })
    }

    request.judge_user = user

    yield next
  }

}

module.exports = JudgeToken
