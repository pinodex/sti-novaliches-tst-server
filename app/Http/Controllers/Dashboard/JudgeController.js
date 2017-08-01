'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Judge = use('App/Model/Judge')
const Helpers = use('App/Components/Helpers')

class JudgeController {
  /**
   * Judge index page
   */
  * index (request, response) {
    const judges = yield Judge.all()

    yield response.sendView('dashboard/judge/index', {
      result: judges
    })
  }

  /**
   * Judge edit page
   */
  * edit (request, response) {
    const paramId = request.param('id')
    let model = new Judge()

    if (paramId) {
      model = yield Judge.find(paramId)
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested judge' }).flash()

      return response.route('dashboard.judges')
    }

    if (request.method() == 'POST') {
      const data = request.only(['name', 'username', 'password', 'password_confirm']),
            validation = yield Helpers.validateModel(Judge, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.judges.edit', { id: model.id })
        }

        return response.route('dashboard.judges.add')
      }

      delete data['password_confirm']

      if (data['password'] == '') {
        delete data['password']
      }

      model.fill(data)

      yield model.save()
      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.judges')
    }

    yield response.sendView('dashboard/judge/edit', { model })
  }

  /**
   * Judge delete page
   */
  * delete (request, response) {
    const model = yield Judge.find(request.param('id'))

    if (model == null) {
      yield request.with({ error: 'Cannot find requested judge' }).flash()

      return response.route('dashboard.judges')
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} judge has been deleted` }).flash()

      return response.route('dashboard.judges')
    }

    yield response.sendView('dashboard/judge/delete', { model })
  }

  /**
   * Judge reset page
   */
  * reset (request, response) {
    const model = yield Judge.find(request.param('id'))

    if (model == null) {
      yield request.with({ error: 'Cannot find requested judge' }).flash()

      return response.route('dashboard.judges')
    }

    if (request.method() == 'POST') {
      model.token = null

      yield model.save()

      yield request.with({ success: `${model.name} judge token has been reset` }).flash()

      return response.route('dashboard.judges')
    }

    yield response.sendView('dashboard/judge/reset', { model })
  }
}

module.exports = JudgeController
