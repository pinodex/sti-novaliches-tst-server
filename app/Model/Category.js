'use strict'

const Lucid = use('Lucid')

class Category extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  static rules (id) {
    return {
      name: 'required'
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
    return this.hasMany('App/Model/Candidate')
  }

  getIsActive(value) {
    return value == 1
  }
}

module.exports = Category
