'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category')

class MainController {
  /**
   * Dashboard index page
   */
  * index (request, response) {
    let program = {}

    program.categories = yield Category.all()

    yield response.sendView('dashboard/index', {
      program
    })
  }

  /**
   * Dashboard login page
   */
  * login (request, response) {
    if (request.method() == 'POST') {
      try {
        const auth = yield request.auth.attempt(
          request.input('username'),
          request.input('password')
        )
      } catch (e) {
        yield request.withOut('password').andWith({ error: 'Invalid username and/or password' }).flash()

        response.route('dashboard.login')
        return
      }

      response.route('dashboard.index')
      return
    }

    yield response.sendView('dashboard/login')
  }

  /**
   * Dashboard logout action
   */
  * logout (request, response) {
    yield request.auth.logout()

    response.route('dashboard.login')
  }
}

module.exports = MainController
