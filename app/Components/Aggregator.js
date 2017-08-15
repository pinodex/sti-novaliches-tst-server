'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Helpers = use('Helpers'),
      Category = use('App/Model/Category'),
      Candidate = use('App/Model/Candidate'),
      fs = require('fs')

class Aggregator {

  static * getCategories () {
    const categories = yield Category.query()
      .with('criterias', 'judges')
      .orderBy('order', 'ASC')
      .fetch()

    let output = []

    categories.each(category => {
      let item = category.toJSON()

      item.criterias = item.criterias.sort((a, b) => a.order - b.order)
      item.judges = item.judges.map(judge => judge.id)

      output.push(item)
    })

    return output
  }

  static * getCandidates () {
    const candidates = yield Candidate.query()
      .with('categories')
      .orderBy('order', 'ASC')
      .fetch()

    let output = []

    candidates.each(candidate => {
      let item = candidate.toJSON()

      item.categories = item.categories.map(c => c.id)

      item.picture = null
      item.thumb = null

      if (candidate.picture_path != null) {
        const picturePath = Helpers.storagePath(`public/${candidate.picture_path}`)

        if (fs.existsSync(picturePath)) {
          item.picture = fs.readFileSync(picturePath)
        }
      }

      if (candidate.thumb_path != null) {
        const thumbPath = Helpers.storagePath(`public/${candidate.thumb_path}`)

        if (fs.existsSync(thumbPath)) {
          item.thumb = fs.readFileSync(thumbPath)
        }
      }

      output.push(item)
    })

    return output
  }

}

module.exports = Aggregator
