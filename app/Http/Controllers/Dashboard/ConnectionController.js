'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

class ConnectionController {
  /**
   * Connection index page
   */
  * index (request, response) {
    return response.route('dashboard.connections.candidates')
  }
}

module.exports = ConnectionController
