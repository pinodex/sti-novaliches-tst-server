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
  const Helpers = use('Helpers'),
        Config = use('Config'),
        Route = use('Route'),
        View = use('View')

  const qs = require('query-string'),
        moment = require('moment')


  View.global('url', (route, data) => {
    data = data || {}

    return Route.url(route, data)
  })

  View.global('route', (route, data) => {
    data = data || {}

    return Route.url(route, data)
  })

  View.global('queryString', params => {
    return qs.stringify(params)
  })

  View.global('queryStringMulti', (key, data) => {
    let params = {}

    params[key] = data

    return qs.stringify(params, { arrayFormat: 'bracket' })
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

  View.filter('fixed', (num, length) => {
    return num.toFixed(length || 2);
  })

  View.filter('date', (date, format) => {
    return moment(date).format(format)
  })
}
