'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Subcategory = use('App/Model/Subcategory'),
      Category = use('App/Model/Category'),
      Helpers = use('App/Components/Helpers')

class SubcategoryController {
  /**
   * Category index page
   */
  * index (request, response) {
    const category = yield Category.findOrFail(request.param('id')),
          subcategories = yield category.subcategories().fetch()

    yield response.sendView('dashboard/category/subcategory/index', {
      result: subcategories, category
    })
  }

  /**
   * Category edit page
   */
  * edit (request, response) {
    const id = request.param('id'),
          sid = request.param('sid')

    const category = yield Category.findOrFail(id)

    let model = new Subcategory()

    if (sid) {
      model = yield Subcategory.findOrFail(sid)
    }

    if (request.method() == 'POST') {
      const data = request.only(['name', 'order']),
            validation = yield Helpers.validateModel(Subcategory, data, data.id)

      if (validation.fails()) {
        yield request.withAll().andWith({ errors: validation.messages() }).flash()

        if (model.id) {
          return response.route('dashboard.categories.sub.edit', { id: category.id, sid: model.id })
        }

        return response.route('dashboard.categories.sub.add', { id: category.id })
      }

      model.fill(data)

      yield category.subcategories().save(model)

      yield request.with({ success: `Changes to ${model.name} has been saved` }).flash()

      return response.route('dashboard.categories.sub', { id: category.id })
    }

    yield response.sendView('dashboard/category/subcategory/edit', { model, category })
  }

  /**
   * Category delete page
   */
  * delete (request, response) {
    const category = yield Category.findOrFail(request.param('id'))

    const model = yield category.subcategories()
      .where('id', request.param('sid'))
      .first()

    if (model == null) {
      yield request.with({ error: 'Cannot find requested category' }).flash()

      response.route('dashboard.categories')
      return
    }

    if (request.method() == 'POST') {
      yield model.delete()
      yield request.with({ success: `${model.name} category has been deleted` }).flash()

      return response.route('dashboard.categories.sub', { id: request.param('id')})
    }

    yield response.sendView('dashboard/category/subcategory/delete', { model, category })
  }
}

module.exports = SubcategoryController
