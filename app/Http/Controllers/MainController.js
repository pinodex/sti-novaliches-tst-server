'use strict'

class MainController {
  * index (request, response) {
    yield response.sendView('index')
  }
}

module.exports = MainController
