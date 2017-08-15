'use strict'

const Env = use('Env')
const Youch = use('youch')
const Http = exports = module.exports = {}

const path = require('path')

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  const status = error.status || 500

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const youch = new Youch(error, request.request)
    const type = request.accepts('json', 'html')
    const formatMethod = type === 'json' ? 'toJSON' : 'toHTML'
    const formattedErrors = yield youch[formatMethod]()
    response.status(status).send(formattedErrors)
    return
  }

  if (error.name === 'InvalidLoginException') {
    response.route('dashboard.login')

    return
  }

  /**
   * PRODUCTION REPORTER
   */
  console.error(error.stack)
  yield response.status(status).sendView('errors/index', {error})
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  const Helpers = use('Helpers')
  const Config = use('Config')
  const Route = use('Route')
  const View = use('View')

  View.global('url', (route, data) => {
    data = data || {}

    return Route.url(route, data)
  })

  View.global('route', (route, data) => {
    data = data || {}

    return Route.url(route, data)
  })

  View.global('config', key => {
    return Config.get(key)
  })

  View.global('storage', file => {
    return Helpers.storagePath(file)
  })

  View.global('mix', text => {
    if (!text) {
      return
    }

    const manifest = require(path.join(Helpers.publicPath(), 'mix-manifest.json'))

    return manifest[text]
  })

  View.global('findScore', (scores, judge, criteria) => {
    const result = scores.find(score => {
      return score.judge_id == judge.id && score.criteria_id == criteria.id
    })

    return result
  })

  View.global('getAverageScore', (scores, criterias, category, judge) => {
    let average = 0

    const results = scores.filter(score => {
      return score.category_id == category.id && score.judge_id == judge.id
    })

    results.forEach(score => {
      const criteria = criterias.find(c => c.id == score.criteria_id)

      if (!criteria) {
        return true
      }

      if (!category.is_weighted) {
        criteria.percentage = (1 / criterias.length) * 100
      }

      average += score.value * (criteria.percentage / 100)
    })

    return average.toFixed(2)
  })

  View.global('getTotalAverage', (scores, criterias, category) => {
    let average = 0

    let judgesAverages = {}

    const results = scores.filter(score => {
      return score.category_id == category.id
    })

    results.forEach(score => {
      const criteria = criterias.find(c => c.id == score.criteria_id)

      if (!criteria) {
        return true
      }

      if (!(score.judge_id in judgesAverages)) {
        judgesAverages[score.judge_id] = 0
      }

      if (!category.is_weighted) {
        criteria.percentage = (1 / criterias.length) * 100
      }

      judgesAverages[score.judge_id] += score.value * (criteria.percentage / 100)
    })

    let averages = Object.keys(judgesAverages).map(key => {
      return judgesAverages[key]
    })

    averages.forEach(subAverage => {
      average += subAverage
    })

    average /= averages.length

    return average.toFixed(2)
  })
}
