'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Client = use('App/Model/Client'),
      Judge = use('App/Model/Judge')

class ClientController {
  /**
   * Client index page
   */
  * index (request, response) {
    const clients = yield Client.all()

    yield response.sendView('dashboard/client/index', {
      result: clients
    })
  }

  /**
   * Client deauthorize page
   */
  * deauthorize (request, response) {
    const model = yield Client.findOrFail(request.param('id'))

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.ip_address} has been deauthorized` }).flash()

      return response.route('dashboard.clients')
    }

    yield response.sendView('dashboard/client/deauthorize', {
      model
    })
  }
}

module.exports = ClientController
