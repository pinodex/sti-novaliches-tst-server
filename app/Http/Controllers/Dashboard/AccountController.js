'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Account = use('App/Model/Account')
const Helpers = use('App/Components/Helpers')

class AccountController {
  /**
   * Account index page
   */
  * index (request, response) {
    const accounts = yield Account.all()

    yield response.sendView('dashboard/account/index', {
      result: accounts
    })
  }

  /**
   * Account edit page
   */
  * edit (request, response) {
    const paramId = request.param('id')
    let model = new Account()

    if (paramId) {
      model = yield Account.find(paramId)
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested account' }).flash()

      return response.route('dashboard.accounts')
    }

    if (request.method() == 'POST') {
      const data = request.only(['name', 'username', 'password', 'password_confirm']),
            validation = yield Helpers.validateModel(Account, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.accounts.edit', { id: model.id })
        }

        return response.route('dashboard.accounts.add')
      }

      delete data['password_confirm']

      if (data['password'] == '') {
        delete data['password']
      }

      model.fill(data)

      yield model.save()
      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.accounts')
    }

    yield response.sendView('dashboard/account/edit', { model })
  }

  /**
   * Account delete page
   */
  * delete (request, response) {
    const model = yield Account.find(request.param('id'))

    if (model == null) {
      yield request.with({ error: 'Cannot find requested account' }).flash()

      return response.route('dashboard.accounts')
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} account has been deleted` }).flash()

      return response.route('dashboard.accounts')
    }

    yield response.sendView('dashboard/account/delete', { model })
  }
}

module.exports = AccountController
