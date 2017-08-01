'use strict'

const Lucid = use('Lucid'),
      Helpers = use('Helpers'),
      Jimp = require('jimp'),
      slug = require('limax')

class Candidate extends Lucid {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', 'Uuid.setId')
  }

  static rules (id) {
    return {
      name: 'required'
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

  setImage (file) {
    if (file.clientSize() == 0) {
      return this
    }

    const baseName = `${slug(this.name)}-${Math.round(Math.random() * Number.MAX_SAFE_INTEGER)}`,
          pictureName = `${baseName}-picture.jpg`,
          thumbName = `${baseName}-thumb.jpg`

    Jimp.read(file.tmpPath())
      .then(image => {
        image.resize(512, 512).quality(90).write(`${Helpers.storagePath()}/public/${pictureName}`)
        image.resize(128, 128).quality(75).write(`${Helpers.storagePath()}/public/${thumbName}`)
      })

    this.picture_path = pictureName
    this.thumb_path = thumbName

    return this
  }

  categories () {
    return this.belongsToMany('App/Model/Category', 'candidate_categories')
  }

  votes () {
    return this.hasMany('App/Model/Vote')
  }
}

module.exports = Candidate
