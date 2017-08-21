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
    const client = yield Client.register(request.ip())

    const token = yield client.generateToken()

    yield client.touch()

    return response.send({ token })
  }
}

module.exports = MainController
