'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Criteria = use('App/Model/Criteria'),
      Result = use('App/Components/Result')

class ScoreController {
  /**
   * Score index page
   */
  * index (request, response) {
    const categories = yield Category.all()

    if (request.method() == 'POST') {
      const id = request.input('category_id')

      return response.route('dashboard.scores.overview', { id })
    }

    yield response.sendView('dashboard/score/index', {
      categories
    })
  }

  /**
   * Score overview page
   */
  * overview (request, response) {
    const categories = yield Category.all(),
          result = yield Result.get(request.param('id'))

    result.sortCandidates((a, b) => {
      return result.getJudgesAverage(b.id) - result.getJudgesAverage(a.id)
    })

    yield response.sendView('dashboard/score/overview', {
      categories, result
    })
  }

  /**
   * Score overview print page
   */
  * overviewPrint (request, response) {
    const categories = yield Category.all(),
          result = yield Result.get(request.param('id')),
          user = yield request.auth.getUser()

    result.sortCandidates((a, b) => {
      return result.getJudgesAverage(b.id) - result.getJudgesAverage(a.id)
    })

    if (request.input('winner') == '1') {
      yield response.sendView('dashboard/score/overview_winner_print', {
        categories, result, user
      })

      return
    }

    yield response.sendView('dashboard/score/overview_print', {
      categories, result, user
    })
  }

  /**
   * Score details page
   */
  * details (request, response) {
    const categories = yield Category.all(),
          result = yield Result.get(request.param('id'))

    result.sortCandidates((a, b) => {
      return result.getJudgesAverage(b.id) - result.getJudgesAverage(a.id)
    })

    yield response.sendView('dashboard/score/details', {
      categories, result
    })
  }

  /**
   * Score details print page
   */
  * detailsPrint (request, response) {
    const categories = yield Category.all(),
          result = yield Result.get(request.param('id')),
          user = yield request.auth.getUser()

    result.sortCandidates((a, b) => {
      return result.getJudgesAverage(b.id) - result.getJudgesAverage(a.id)
    })

    if (request.input('winner') == '1') {
      yield response.sendView('dashboard/score/details_winner_print', {
        categories, result, user
      })

      return
    }

    yield response.sendView('dashboard/score/details_print', {
      categories, result, user
    })
  }

  /**
   * Score criteria page
   */
  * criteria (request, response) {
    const categories = yield Category.all(),
          criteria = yield Criteria.findOrFail(request.param('cid')),
          result = yield Result.get(request.param('id'))

    result.sortCandidates((a, b) => {
      return result.getCriteriaAverage(b.id, criteria.id) - result.getCriteriaAverage(a.id, criteria.id)
    })

    yield response.sendView('dashboard/score/details', {
      categories, criteria, result
    })
  }

  /**
   * Score criteria page
   */
  * criteriaPrint (request, response) {
    const categories = yield Category.all(),
          criteria = yield Criteria.findOrFail(request.param('cid')),
          result = yield Result.get(request.param('id')),
          user = yield request.auth.getUser()

    result.sortCandidates((a, b) => {
      return result.getCriteriaAverage(b.id, criteria.id) - result.getCriteriaAverage(a.id, criteria.id)
    })

    if (request.input('winner') == '1') {
      yield response.sendView('dashboard/score/details_winner_print', {
        categories, criteria, result, user
      })

      return
    }

    yield response.sendView('dashboard/score/details_print', {
      categories, criteria, result, user
    })
  }
}

module.exports = ScoreController
