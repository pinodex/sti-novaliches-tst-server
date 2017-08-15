'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Subcategory = use('App/Model/Subcategory'),
      Candidate = use('App/Model/Candidate')

class SubcategoriesController {
  /**
   * Categories connection index page
   */
  * index (request, response) {
    const categories = yield Subcategory.query()
      .with('category')
      .fetch()

    yield response.sendView('dashboard/connection/subcategories/index', {
      categories
    })
  }

  /**
   * Categories connection edit page
   */
  * edit (request, response) {
    const categories = yield Subcategory.query()
      .with('category')
      .fetch()

    const candidates = yield Candidate.query()
      .with('subcategories')
      .fetch()

    const model = yield Subcategory.query()
      .with('candidates')
      .where('id', request.param('id'))
      .first()

    if (!model) {
      return response.route('dashboard.connections.subcategories')
    }

    let mappedCandidates = []

    candidates.each(candidate => {
      let mappedCandidate = candidate.toJSON()

      mappedCandidate['is_selected'] = false

      if (model.relations.candidates.findIndex(c => c.id == candidate.id) > -1) {
        mappedCandidate['is_selected'] = true
      }

      mappedCandidates.push(mappedCandidate)
    })

    if (request.method() == 'POST') {
      let selectedCandidates = request.input('candidates')

      if (!(selectedCandidates instanceof Array)) {
        selectedCandidates = [selectedCandidates]
      }

      yield model.candidates().sync(selectedCandidates)

      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.connections.subcategories.edit', {
        id: model.id
      })
    }

    yield response.sendView('dashboard/connection/subcategories/edit', {
      categories, candidates, model, mappedCandidates
    })
  }
}

module.exports = SubcategoriesController
