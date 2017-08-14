'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Event = use('Event'),
      Scorer = use('App/Components/Scorer')

class RequestController {
  /**
   * API score get route
   */
  * get (request, response) {
    const scores = yield Scorer.get(request.judge_user.id)

    response.send({ scores })
  }

  /**
   * API score post route
   */
  * post (request, response) {
    const data = request.only(['id', 'value'])

    try {
      yield Scorer.score(request.judge_user, data.id, data.value)
    } catch (e) {
      return response.status(422).send({
        error: { message: e.message }
      })
    }

    return response.status(204).send()
  }
}

module.exports = RequestController
