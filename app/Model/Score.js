'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Server
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Lucid = use('Lucid')

class Score extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  candidate () {
    return this.belongsTo('App/Model/Candidate')
  }

  criteria () {
    return this.belongsTo('App/Model/Criteria', 'id', 'criteria_id')
  }

  judge () {
    return this.belongsTo('App/Model/Judge')
  }
}

module.exports = Score
