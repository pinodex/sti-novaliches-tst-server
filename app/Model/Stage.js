'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Server
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Lucid = use('Lucid')

class Stage extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  static rules (id) {
    return {
      name: 'required',
      level: 'required|range:0,1000'
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

  category () {
    return this.belongsTo('App/Model/Candidate')
  }

  getIsActive(value) {
    return value == 1
  }

  static * setActive(id) {
    if (id == null) {
      yield Stage.query().update({ is_active: 0 })

      return true
    }

    const model = yield Stage.findOrFail(id)

    model.is_active = true

    yield Stage.query()
      .where('category_id', model.category_id)
      .update({ is_active: false })

    yield model.save()

    return true
  }
}

module.exports = Stage
