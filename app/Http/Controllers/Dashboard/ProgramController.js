'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Stage = use('App/Model/Stage'),
      Event = use('Event')

class ProgramController {

  * category (request, response) {
    const data = request.only('category_id', 'stage_id')

    if (!data.category_id || data.category_id == 'none') {
      data.category_id = null
    }

    if (!data.stage_id || data.stage_id == 'none') {
      data.stage_id = null
    }

    yield Category.setActive(data.category_id)
    yield Stage.setActive(data.stage_id)

    Event.fire('send_categories')

    response.status(204).send()
  }

  * update (request, response) {
    const type = request.input('type')

    switch (type) {
      case 'categories':
        Event.fire('send_categories')

        break

      case 'candidates':
        Event.fire('send_candidates')

        break
    }

    response.status(204).send()
  }

}

module.exports = ProgramController
