'use strict'

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
      percentage: 'required|range:0,100',
      minimum_value: 'required|range:0,100'
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
}

module.exports = Criteria
