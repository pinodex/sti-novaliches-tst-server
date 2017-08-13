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

let app = new Vue({
  el: '#app',

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
        }
      },

      form: {
        disabled: false,
        errors: false,
        image: null
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
