/*!
 * (c) 2017, Raphael Marco
 */

'use strict'

import Vue from 'vue'
import Buefy from 'buefy'
import axios from 'axios'

import ws from 'adonis-websocket-client'

import methods from './methods.js'

const csrfMetaElement = document.querySelector('meta[name="csrf-token"]')

if (csrfMetaElement) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfMetaElement.getAttribute('value')
}

Vue.directive('focus', {
  inserted: (el) => {
    el.focus()
  }
})

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

Vue.io = Vue.prototype.$io = ws(location.origin, {
  transports: ['websocket'],
  upgrade: false
})

Vue.http = Vue.prototype.$http = axios.create({
  baseURL: location.origin
})

let app = new Vue({
  el: '#app',

  mounted () {
    if ('program' in window) {
      for (let key in window.program) {
        this.program[key] = window.program[key]
      }

      let activeCategory = this.program.categories.find(category => category.is_active)

      if (activeCategory) {
        this.program.active_category = activeCategory.id
      }
    }
  },

  data () {
    return {
      ui: {
        nav: {
          sideBarActive: false
        },

        modal: {
          showLoginPrompt: true
        },

        button: {
          fbLoginDisabled: false,
          quickPostLoading: false
        },

        program: {
          control_disabled: false
        }
      },

      form: {
        disabled: false,
        errors: false,
        image: null
      },

      program: {
        active_category: null,
        categories: []
      }
    }
  },

  methods
})

let pageSelector = document.getElementById('page-selector')

if (pageSelector) {
  let query = location.search.substr(1),
      params = qs.parse(query)

  pageSelector.addEventListener('change', e => {
    params.page = e.target.value

    query = qs.stringify(params)

    window.location = `${location.pathname}?${query}`
  }, false)
}

if (location.pathname.indexOf('/program') == 0) {

}
