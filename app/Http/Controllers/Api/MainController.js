'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Client = use('App/Model/Client')

class MainController {
  /**
   * API handshake route
   */
  * handshake (request, response) {
    const ip = request.header('x-forwarded-for') || request.ip()

    const client = yield Client.register(ip)

    const token = yield client.generateToken()

    yield client.touch()

    return response.send({ token })
  }
}

module.exports = MainController
