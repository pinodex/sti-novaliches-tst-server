'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category')

class Aggregator {

  static * getCategories () {
    const categories = yield Category.query()
      .with('stages', 'criterias')
      .orderBy('order', 'ASC')
      .fetch()

    let output = []

    categories.each(category => {
      let item = category.toJSON()

      item.stages = item.stages.sort((a, b) => a.level - b.level)

      output.push(item)
    })

    return output
  }

}

module.exports = Aggregator
