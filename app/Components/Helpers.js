'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Validator = use('Validator')

class Helpers {

  /**
   * Validate model input data
   * @param  {Lucid}      model Model
   * @param  {object}     data  Input data
   * @return {Validator}        Validator instance
   */
  static * validateModel (model, data, id = null) {
    return Validator.validate(data, model.rules(id), model.validationMessages)
  }

}

module.exports = Helpers
