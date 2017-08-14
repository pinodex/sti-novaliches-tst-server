'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Server
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Lucid = use('Lucid'),
      Hash = use('Hash'),
      crypto = require('crypto')

class Judge extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Account.encryptPassword')
    this.addHook('beforeUpdate', 'Account.encryptPassword')

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  static get hidden () {
    return ['password', 'created_at', 'updated_at']
  }

  static rules (id) {
    return {
      name: 'required',
      username: `required|unique:accounts,username,id,${id}`,
      password: 'min:8',
      password_confirm: 'required_if:password|same:password'
    }
  }

  static get validationMessages () {
    return {
      'name.required': 'Name field cannot be empty',
      'username.required': 'Username field cannot be empty',
      'username.unique': 'Username already in use',
      'password.min': 'Password should be at least 8 characters long',
      'password_confirm.required_if': 'Password confirmation field cannot be empty',
      'password_confirm.same': 'Password confirmation does not match'
    }
  }

  static * getByCredentials (username, password) {
    const judge = yield this.query().where('username', username).first()

    if (!judge) {
      return null
    }

    const isPasswordCorrect = yield Hash.verify(password, judge.password)

    if (!isPasswordCorrect) {
      return null
    }

    return judge
  }

  static * getByToken (username, token) {
    const judge = yield this.query()
      .where('username', username)
      .where('token', token)
      .first()

    return judge
  }

  static * checkToken (token) {
    const judge = yield this.query()
      .where('token', token)
      .first()

    return judge
  }

  * generateToken() {
    const buffer = crypto.randomBytes(64),
          token = buffer.toString('hex')

    this.token = token

    return token
  }

  * invalidateToken () {
    this.token = null

    return this
  }
}

module.exports = Judge
