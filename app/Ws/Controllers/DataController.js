'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const co = require('co'),
      Event = use('Event'),
      Aggregator = use('App/Components/Aggregator')

class DataController {

  constructor (socket) {
    this.socket = socket

    if (Event.hasListeners('send_categories')) {
      return
    }

    Event.when('send_categories', () => {
      co(function * () {
        const categories = yield Aggregator.getCategories()

        return categories
      }.bind(this)).then(categories => {
        this.socket.toEveryone().emit('categories', categories)
      })
    })
  }

}

module.exports = DataController
