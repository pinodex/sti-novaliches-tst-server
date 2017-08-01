'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Helpers = use('App/Components/Helpers')

class CategoryController {
  /**
   * Category index page
   */
  * index (request, response) {
    const categories = yield Category.all()

    yield response.sendView('dashboard/category/index', {
      result: categories
    })
  }

  /**
   * Category edit page
   */
  * edit (request, response) {
    const paramId = request.param('id')
    let model = new Category()

    if (paramId) {
      model = yield Category.find(paramId)
    }

    if (model == null) {
      yield request.with({ error: 'Cannot find requested category' }).flash()

      response.route('dashboard.categories')
      return
    }

    if (request.method() == 'POST') {
      const data = request.only(['name']),
            validation = yield Helpers.validateModel(Category, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.categories.edit', { id: model.id })
        }

        return response.route('dashboard.categories.add')
      }

      if (!model.id) {
        model.is_active = false
      }

      model.fill(data)

      yield model.save()
      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.categories')
    }

    yield response.sendView('dashboard/category/edit', { model })
  }

  /**
   * Category delete page
   */
  * delete (request, response) {
    const model = yield Category.find(request.param('id'))

    if (model == null) {
      yield request.with({ error: 'Cannot find requested category' }).flash()

      response.route('dashboard.categories')
      return
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} category has been deleted` }).flash()

      response.route('dashboard.categories')
    }

    yield response.sendView('dashboard/category/delete', { model })
  }
}

module.exports = CategoryController
