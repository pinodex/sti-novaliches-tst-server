'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

class MainController {
  * index (request, response) {
    yield response.sendView('index')
  }
}

module.exports = MainController
