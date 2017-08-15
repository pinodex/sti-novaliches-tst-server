'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Criteria = use('App/Model/Criteria'),
      Helpers = use('App/Components/Helpers')

class CriteriaController {
  /**
   * Criteria index page
   */
  * index (request, response) {
    const criterias = yield Criteria.all()

    yield response.sendView('dashboard/criteria/index', {
      result: criterias
    })
  }

  /**
   * Criteria edit page
   */
  * edit (request, response) {
    const paramId = request.param('id')
    let model = new Criteria()

    if (paramId) {
      model = yield Criteria.find(paramId)
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested criteria' }).flash()

      response.route('dashboard.criterias')
      return
    }

    if (request.method() == 'POST') {
      const data = request.only(['name', 'description', 'percentage', 'minimum_value', 'order']),
            validation = yield Helpers.validateModel(Criteria, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.criterias.edit', { id: model.id })
        }

        return response.route('dashboard.criterias.add')
      }

      model.fill(data)

      yield model.save()
      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.criterias')
    }

    yield response.sendView('dashboard/criteria/edit', { model })
  }

  /**
   * Criteria delete page
   */
  * delete (request, response) {
    const model = yield Criteria.find(request.param('id'))

    if (model == null) {
      yield request.with({ error: 'Cannot find requested criteria' }).flash()

      response.route('dashboard.criterias')
      return
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} criteria has been deleted` }).flash()

      return response.route('dashboard.criterias')
    }

    yield response.sendView('dashboard/criteria/delete', { model })
  }
}

module.exports = CriteriaController
