'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Candidate = use('App/Model/Candidate'),
      Category = use('App/Model/Category'),
      Helpers = use('App/Components/Helpers')

class CandidateController {
  /**
   * Candidate index page
   */
  * index (request, response) {
    const candidates = yield Candidate.all()

    yield response.sendView('dashboard/candidate/index', {
      result: candidates
    })
  }

  /**
   * Candidate edit page
   */
  * edit (request, response) {
    const id = request.param('id')
    let model = new Candidate()

    if (id) {
      model = yield Candidate.find(id)
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested candidate' }).flash()

      response.route('dashboard.candidates')
      return
    }

    if (request.method() == 'POST') {
      const data = request.only(['name', 'order', 'number']),
            validation = yield Helpers.validateModel(Candidate, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.candidates.edit', { id: model.id })
        }

        return response.route('dashboard.candidates.add')
      }

      const picture = request.file('picture', {
        maxSize: '2mb',
        allowedExtensions: ['jpg', 'png', 'jpeg']
      })

      model.fill(data)
      model.setImage(picture)

      yield model.save()

      yield request.with({ success: `Candidate ${model.name} has been added` }).flash()

      return response.route('dashboard.candidates')
    }

    yield response.sendView('dashboard/candidate/edit', { model })
  }

  /**
   * Candidate delete page
   */
  * delete (request, response) {
    const model = yield Candidate.find(request.param('id'))

    if (model == null) {
      yield request.with({ error: 'Cannot find requested candidate' }).flash()

      response.route('dashboard.candidates')
      return
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} candidate has been deleted` }).flash()

      return response.route('dashboard.candidates')
    }

    yield response.sendView('dashboard/candidate/delete', { model })
  }
}

module.exports = CandidateController
