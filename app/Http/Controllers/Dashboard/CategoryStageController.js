'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Stage = use('App/Model/Stage'),
      Helpers = use('App/Components/Helpers')

class CategoryStageController {
  /**
   * Category stage index page
   */
  * index (request, response) {
    const category = yield Category.findOrFail(request.param('category_id')),
          stages = yield Stage.query()
            .where('category_id', category.id)
            .orderBy('level', 'ASC')
            .fetch()

    yield response.sendView('dashboard/category/stage/index', {
      result: stages,
      category
    })
  }

  /**
   * Category edit page
   */
  * edit (request, response) {
    const id = request.param('id'),
          category = yield Category.findOrFail(request.param('category_id'))

    let model = new Stage()

    if (id) {
      model = yield Stage.query()
        .where('id', id)
        .where('category_id', category.id)
        .first()
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested stage' }).flash()

      response.route('dashboard.categories.stages', { category_id: category.id })
      return
    }

    if (request.method() == 'POST') {
      const data = request.only(['name', 'level']),
            validation = yield Helpers.validateModel(Stage, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.categories.stages.edit', { id: model.id, category_id: category.id })
        }

        return response.route('dashboard.categories.stages.add', { category_id: category.id })
      }

      if (!model.id) {
        model.is_active = false
      }

      model.category_id = category.id

      model.fill(data)

      yield model.save()
      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.categories.stages', { category_id: category.id })
    }

    yield response.sendView('dashboard/category/stage/edit', { model, category })
  }

  /**
   * Category delete page
   */
  * delete (request, response) {
    const id = request.param('id'),
          category = yield Category.findOrFail(request.param('category_id'))

    let model = new Stage()

    if (id) {
      model = yield Stage.query()
        .where('id', id)
        .where('category_id', category.id)
        .first()
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested category' }).flash()

      response.route('dashboard.categories.stages', { category_id: category.id })
      return
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} category has been deleted` }).flash()

      response.route('dashboard.categories.stages', { category_id: category.id })
    }

    yield response.sendView('dashboard/category/stage/delete', { model, category })
  }
}

module.exports = CategoryStageController
