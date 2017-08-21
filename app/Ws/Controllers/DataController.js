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

  static get mappings () {
    return {
      categories: 'send_categories',
      candidates: 'send_candidates'
    }
  }

  constructor (socket) {
    this.socket = socket

    if (Event.hasListeners('send_categories')) {
      Event.when('send_categories', () => {
        co(function * () {
          const categories = yield Aggregator.getCategories()

          return categories
        }).then(categories => {
          this.socket.toEveryone().emit('categories', categories)
        })
      })
    }

    if (Event.hasListeners('send_candidates')) {
      Event.when('send_candidates', () => {
        co(function * () {
          const candidates = yield Aggregator.getCandidates()

          return candidates
        }).then(candidates => {
          this.socket.toEveryone().emit('candidates', candidates)
        })
      })
    }
  }

  onRequest (name) {
    switch (name) {
      case 'categories':
        co(function * () {
          const categories = yield Aggregator.getCategories()

          return categories
        }).then(categories => {
          this.socket.toMe().emit('categories', categories)
        })

        break;

      case 'candidates':
        co(function * () {
          const candidates = yield Aggregator.getCandidates()

          return candidates
        }).then(candidates => {
          this.socket.toMe().emit('candidates', candidates)
        })

        break;
    }
  }

}

module.exports = DataController
