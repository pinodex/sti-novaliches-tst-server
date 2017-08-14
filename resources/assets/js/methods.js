/*!
 * (c) 2017, Raphael Marco
 */

'use strict'

import axios from 'axios'

export default {

  toggleSideBar () {
    this.ui.nav.sideBarActive = !this.ui.nav.sideBarActive
  },

  closeOverlays () {
    this.ui.nav.sideBarActive = false
  },

  previewImage (e) {
    const input = e.target

    if (input.files && input.files[0]) {
      let reader = new FileReader()

      reader.onload = e => {
        this.form.image = e.target.result
      }

      reader.readAsDataURL(input.files[0])
    }
  },

  updateCurrentProgram () {
    this.ui.program.control_disabled = true

    this.$http
      .post('/dashboard/program/category', {
        category_id: this.program.active_category,
        stage_id: this.program.active_stage
      })
      .then(response => {
        this.ui.program.control_disabled = false

        this.$toast.open({
          message: 'Current program updated',
          type: 'is-success'
        })
      })
      .catch(error => {
        let message = error.response.data.error.message || error.message

        this.$dialog.alert({ message,
          title: 'Error',
          type: 'is-danger'
        })

        this.ui.program.control_disabled = false
      })
  }

}
