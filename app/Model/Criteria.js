'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Server
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Lucid = use('Lucid')

class Criteria extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  static get table () {
    return 'criterias'
  }

  static rules (id) {
    return {
      name: 'required',
      description: 'required',
      percentage: 'required|range:0,101',
      minimum_value: 'required|range:0,100',
      order: 'required|range:0,1000',
      is_enabled: 'required|in:0,1'
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

  categories () {
    return this.belongsToMany('App/Model/Category', 'category_criterias', 'criteria_id', 'category_id')
  }

  getPercentage (value) {
    return value * 100
  }

  setPercentage (value) {
    return value / 100
  }
}

module.exports = Criteria
