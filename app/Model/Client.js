'use strict'

/*!
 * STI College Novaliches
 * SEC Voting System Server
 *
 * Copyright 2017, Raphael Marco <raphaelmarco@outlook.com>
 */

const Lucid = use('Lucid'),
      ip = require('ip'),
      crypto = require('crypto')

class Client extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Account.encryptPassword')
    this.addHook('beforeUpdate', 'Account.encryptPassword')

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  getIpAddress (value) {
    return ip.fromLong(value)
  }

  setIpAddress (value) {
    return ip.toLong(value)
  }

  static * register (ipAddress) {
    const ip_address = ip.toLong(ipAddress)

    yield Client.findOrCreate({ ip_address }, {
      ip_address: ipAddress
    })

    const client = yield Client.query()
      .where({ ip_address })
      .first()

    return client
  }

  static * authenticate (ipAddress, token) {
    const ip_address = ip.toLong(ipAddress)

    const client = yield Client.query()
      .where({ ip_address, token })
      .first()

    return client
  }

  * generateToken (save = false) {
    const buffer = crypto.randomBytes(64),
          token = buffer.toString('hex')

    this.token = token

    if (save) {
      yield this.save()
    }

    return token
  }

  * touch () {
    this.last_activity = new Date()

    yield this.save()
  }
}

module.exports = Client
