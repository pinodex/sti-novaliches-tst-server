'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Event = use('Event')

class RequestController {

  static get mappings () {
    return {
      categories: 'send_categories'
    }
  }

  /**
   * API Request route
   */
  * invoke (request, response) {
    const event = request.param('event')

    if (event in RequestController.mappings) {
      Event.fire(RequestController.mappings[event])

      response.send({
        success: 'Event emitted'
      })

      return
    }

    response.status(401).send({
      error: 'Invalid request event'
    })
  }
}

module.exports = RequestController
