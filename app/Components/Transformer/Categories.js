'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category')

class Categories {

  static * get () {
    const categories = yield Category.all()
    let output = []

    categories.each(category => {
      let item = category.toJSON()

      item.is_active = false

      output.push(item)
    })

    return output
  }

}

module.exports = Categories
