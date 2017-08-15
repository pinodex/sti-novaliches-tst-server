'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category')

class ScoreController {
  /**
   * Score index page
   */
  * index (request, response) {
    const categories = yield Category.all()

    if (request.input('category_id')) {
      yield this.category(request, response)

      return
    }

    yield response.sendView('dashboard/score/index', {
      categories
    })
  }

  /**
   * Score category page
   */
  * category (request, response) {
    const categories = yield Category.all()

    const category = yield Category.query()
            .where('id', request.input('category_id'))
            .with('candidates', 'judges', 'criterias', 'candidates.scores')
            .first()

    yield response.sendView('dashboard/score/category', {
      categories, category: category.toJSON()
    })
  }
}

module.exports = ScoreController
