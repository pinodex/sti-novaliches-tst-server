'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Criteria = use('App/Model/Criteria'),
      Category = use('App/Model/Category')

class CriteriasController {
  /**
   * Criterias connection index page
   */
  * index (request, response) {
    const categories = yield Category.all(),
          criterias = yield Criteria.all()

    yield response.sendView('dashboard/connection/criterias/index', {
      categories, criterias
    })
  }

  /**
   * Criterias connection edit page
   */
  * edit (request, response) {
    const categories = yield Category.all(),
          criterias = yield Criteria.query().with('categories').fetch()

    const model = yield Category.query()
      .with('criterias')
      .where('id', request.param('id'))
      .first()

    if (!model) {
      return response.route('dashboard.criterias.categories')
    }

    let mappedCriterias = []

    criterias.each(criteria => {
      let mappedCriteria = criteria.toJSON()

      mappedCriteria['is_selected'] = false

      if (model.relations.criterias.findIndex(c => c.id == criteria.id) > -1) {
        mappedCriteria['is_selected'] = true
      }

      mappedCriterias.push(mappedCriteria)
    })

    if (request.method() == 'POST') {
      let selectedCriterias = request.input('criterias')

      if (!(selectedCriterias instanceof Array)) {
        selectedCriterias = [selectedCriterias]
      }

      yield model.criterias().sync(selectedCriterias)

      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.connections.criterias.edit', {
        id: model.id
      })
    }

    yield response.sendView('dashboard/connection/criterias/edit', {
      categories, criterias, model, mappedCriterias
    })
  }
}

module.exports = CriteriasController
