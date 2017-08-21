'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Client = use('App/Model/Client')

class ClientToken {

  * handle (request, response, next) {
    const token = request.header('x-client-token')

    const client = yield Client.authenticate(request.ip(), token)

    if (!client) {
      return response.status(401).send({
        error: { message: 'Cannot authorize client' }
      })
    }

    yield client.touch()

    yield next
  }

  * handleWs (socket, request, next) {
    const client = yield Client.authenticate(request.ip(), request.input('token'))

    if (!client) {
      socket.disconnect()

      return
    }

    yield client.touch()

    yield next
  }

}

module.exports = ClientToken
