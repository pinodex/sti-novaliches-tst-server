'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Server
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Lucid = use('Lucid')

class Category extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  static rules (id) {
    return {
      name: 'required',
      order: 'required|range:0,1000',
      is_weighted: 'required|in:0,1'
    }
  }

  static get validationMessages () {
    return {
      'name.required': 'Name field cannot be empty'
    }
  }

  static get createTimestamp () {
    return null
  }

  static get updateTimestamp () {
    return null
  }

  candidates () {
    return this.belongsToMany('App/Model/Candidate', 'candidate_categories')
  }

  criterias () {
    return this.belongsToMany('App/Model/Criteria', 'category_criterias', 'category_id', 'criteria_id')
  }

  judges () {
    return this.belongsToMany('App/Model/Judge', 'category_judges')
  }

  subcategories () {
    return this.hasMany('App/Model/Subcategory')
  }

  getIsActive (value) {
    return value == 1
  }

  getIsWeighted (value) {
    return value == 1
  }

  static * setActive(id) {
    if (id == null) {
      yield Category.query().update({ is_active: 0 })

      return true
    }

    const model = yield Category.findOrFail(id)

    model.is_active = true

    yield Category.query().update({ is_active: false })
    yield model.save()

    return true
  }
}

module.exports = Category
