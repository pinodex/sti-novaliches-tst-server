'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Candidate = use('App/Model/Candidate')

class CandidatesController {
  /**
   * Categories connection index page
   */
  * index (request, response) {
    const categories = yield Category.all()

    yield response.sendView('dashboard/connection/candidates/index', {
      categories
    })
  }

  /**
   * Categories connection edit page
   */
  * edit (request, response) {
    const categories = yield Category.all(),
          candidates = yield Candidate.query()
            .with('categories')
            .fetch()

    const model = yield Category.query()
      .with('candidates')
      .where('id', request.param('id'))
      .first()

    if (!model) {
      return response.route('dashboard.connections.candidates')
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

      return response.route('dashboard.connections.candidates.edit', {
        id: model.id
      })
    }

    yield response.sendView('dashboard/connection/candidates/edit', {
      categories, candidates, model, mappedCandidates
    })
  }

  /**
   * Categories connection edit page
   */
  * editFiltered (request, response) {
    let filteredIds = request.input('ids')

    if (!(filteredIds instanceof Array)) {
      filteredIds = [filteredIds]
    }

    const categories = yield Category.all(),
          candidates = yield Candidate.query()
            .whereIn('id', filteredIds)
            .with('categories')
            .fetch()

    const model = yield Category.query()
      .with('candidates')
      .where('id', request.param('id'))
      .first()

    if (!model) {
      return response.route('dashboard.connections.candidates')
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

      return response.route('dashboard.connections.candidates.edit', {
        id: model.id
      })
    }

    yield response.sendView('dashboard/connection/candidates/edit', {
      categories, candidates, model, mappedCandidates
    })
  }
}

module.exports = CandidatesController
