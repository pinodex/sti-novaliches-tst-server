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

class Scorer {

  static * get (judgeId) {
    let output = {},
        scores = yield Score.query()
          .where('judge_id', judgeId)
          .fetch()

    scores.each(score => {
      let key = `${score.candidate_id}:${score.category_id}:${score.criteria_id}`

      output[key] = score.value
    })

    return output
  }

  static * score (judge, id, value) {
    let entity = Scorer.parseId(id),
        category = yield Category.query()
          .with('candidates', 'criterias', 'judges')
          .where('id', entity.category)
          .first()

    if (!category) {
      throw new Error('Cannot find selected category')
    }

    if (!category.is_active) {
      throw new Error('Selected category is not active')
    }

    if (!category.relations.judges.find(c => c.id == judge.id)) {
      throw new Error('You are not listed as a judge for this program')
    }

    let candidate = yield Candidate.findOrFail(entity.candidate),
        criteria = yield Criteria.findOrFail(entity.criteria)

    if (!category.relations.candidates.find(c => c.id == candidate.id)) {
      throw new Error('Selected candidate is not part of the category')
    }

    if (!category.relations.criterias.find(c => c.id == criteria.id)) {
      throw new Error('Selected criteria is not part of the category')
    }

    if (!criteria.is_enabled) {
      throw new Error(`Criteria ${criteria.name} is not enabled`)
    }

    if (value < criteria.minimum_value) {
      throw new Error(`The minimum value for ${criteria.name} criteria is ${criteria.minimum_value}`)
    }

    if (value > 100) {
      throw new Error(`The minimum value for ${criteria.name} criteria is 100`)
    }

    let score = yield Score.query().where({
      category_id: category.id,
      candidate_id: candidate.id,
      criteria_id: criteria.id,
      judge_id: judge.id
    }).first()

    if (!score) {
      score = new Score()
    }

    score.category_id = category.id
    score.candidate_id = candidate.id
    score.criteria_id = criteria.id
    score.judge_id = judge.id
    score.value = value

    yield score.save()

    return true
  }

  static parseId (id) {
    let candidate, category, criteria, idParts

    idParts = id.split(':')

    if (idParts < 3) {
      throw new Error('Incomplete arguments for score identifier')
    }

    candidate = idParts[0]
    category = idParts[1]
    criteria = idParts[2]

    return { candidate, category, criteria }
  }

}

module.exports = Scorer
