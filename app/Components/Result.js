'use strict'

/*!
 * STI College Novaliches
 * Talent Search Tabulation System
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Category = use('App/Model/Category'),
      Candidate = use('App/Model/Candidate'),
      Criteria = use('App/Model/Criteria'),
      Score = use('App/Model/Score')

class Result {

  constructor (category) {
    this._category = category
    this._judgesAverage = {}

  }

  static * get (categoryId) {
    const category = yield Category.findOrFail(categoryId),
          result = new Result(category)

    yield result.load()

    return result
  }

  * load () {
    this._scores = yield Score.query()
      .where('category_id', this._category.id)
      .fetch()

    this._subcategories = yield this._category.subcategories()
      .with('candidates')
      .orderBy('order', 'ASC')
      .fetch()

    this._candidates = yield this._category.candidates()
      .orderBy('order', 'ASC')
      .fetch()

    this._criterias = yield this._category.criterias()
      .orderBy('order', 'ASC')
      .fetch()

    this._judges = yield this._category.judges().fetch()

    return this
  }

  sortCandidates (cb) {
    const result = this._candidates.sort(cb)

    if (this.subcategories.length) {
      const sortedSubs = this._subcategories.map(sub => {
        sub.relations.candidates = sub.relations.candidates.sort(cb)

        return sub
      })

      this._subcategories = sortedSubs
    }

    this._candidates = result
  }

  sliceTop (n) {
    const result = this._candidates.slice(0, n)

    if (this.subcategories.length) {
      const slicedSubs = this._subcategories.map(sub => {
        sub.relations.candidates = sub.relations.candidates.slice(0, n)

        return sub
      })

      this._subcategories = slicedSubs
    }

    this._candidates = result
  }

  getTop5Ids (candidates) {
    return candidates.slice(0, 5).map(c => c.id)
  }

  getCriteriaScore (candidateId, judgeId, criteriaId) {
    let search = this.scores.find(score => {
          return score.candidate_id == candidateId &&
            score.judge_id == judgeId &&
            score.criteria_id == criteriaId
        })

    if (search) {
      return search.value
    }

    return 0
  }

  getCriteriaAverage (candidateId, criteriaId) {
    let total = 0

    this.judges.forEach(judge => {
      total += this.getCriteriaScore(candidateId, judge.id, criteriaId)
    })

    total /= this.judges.length

    return total
  }

  getAverage (candidateId, judgeId) {
    let total = 0

    this.criterias.forEach(criteria => {
      let value = this.getCriteriaScore(candidateId, judgeId, criteria.id)

      if (this._category.is_weighted) {
        let weight = 0

        if (criteria) {
          weight = criteria.percentage / 100
        }

        value *= weight
      }

      total += value
    })

    if (!this._category.is_weighted) {
      total /= this.criterias.length
    }

    return total
  }

  getJudgesAverage (candidateId) {
    if (candidateId in this._judgesAverage) {
      return this._judgesAverage[candidateId]
    }

    let total = 0

    this.judges.forEach(judge => {
      total += this.getAverage(candidateId, judge.id)
    })

    total /= this.judges.length

    this._judgesAverage[candidateId] = total

    return total
  }

  get category () {
    return this._category
  }

  get scores () {
    return this._scores.toJSON()
  }

  get subcategories () {
    return this._subcategories.toJSON()
  }

  get candidates () {
    return this._candidates.toJSON()
  }

  get criterias () {
    return this._criterias.toJSON()
  }

  get judges () {
    return this._judges.toJSON()
  }

}

module.exports = Result
