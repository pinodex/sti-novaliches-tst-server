'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Judge = use('App/Model/Judge')

class CandidatesController {
  /**
   * Categories connection index page
   */
  * index (request, response) {
    const categories = yield Category.all()

    yield response.sendView('dashboard/connection/judges/index', {
      categories
    })
  }

  /**
   * Categories connection edit page
   */
  * edit (request, response) {
    const categories = yield Category.all(),
          judges = yield Judge.query()
            .with('categories')
            .fetch()

    const model = yield Category.query()
      .with('judges')
      .where('id', request.param('id'))
      .first()

    if (!model) {
      return response.route('dashboard.connections.judges')
    }

    let mappedJudges = []

    judges.each(judge => {
      let mappedCandidate = judge.toJSON()

      mappedCandidate['is_selected'] = false

      if (model.relations.judges.findIndex(c => c.id == judge.id) > -1) {
        mappedCandidate['is_selected'] = true
      }

      mappedJudges.push(mappedCandidate)
    })

    if (request.method() == 'POST') {
      let selectedJudges = request.input('judges')

      if (!(selectedJudges instanceof Array)) {
        selectedJudges = [selectedJudges]
      }

      yield model.judges().sync(selectedJudges)

      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.connections.judges.edit', {
        id: model.id
      })
    }

    yield response.sendView('dashboard/connection/judges/edit', {
      categories, judges, model, mappedJudges
    })
  }
}

module.exports = CandidatesController
