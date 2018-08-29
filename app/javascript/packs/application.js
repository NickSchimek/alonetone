/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// src/application.js

import LocalTime from 'local-time'
import Rails from 'rails-ujs'
import Turbolinks from 'turbolinks'
import { Application } from 'stimulus'
import { definitionsFromContext } from 'stimulus/webpack-helpers'
import { makeSVGFromTitle } from '../animation/default_playlist_images'

Rails.start()
Turbolinks.start()

LocalTime.config.i18n.en.datetime.at = '{date}' // drop the time from the date
LocalTime.config.i18n.en.date.on = '{date}' // no "on Sunday", just "Sunday"
LocalTime.start()

const application = Application.start()
const context = require.context('../controllers', true, /\.js$/)
application.load(definitionsFromContext(context))


function handlers() {
  document.querySelectorAll('.large-cover .no_pic, .small-cover .no_pic').forEach((pic) => {
    const title = document.querySelector('h1').textContent.trim()
    if (!pic.hasChildNodes()) { 
      pic.append(makeSVGFromTitle(800, title))
    }
  })

  document.querySelectorAll('a.track_link').forEach((title) => {
    title.style.width = `${document.querySelector('.asset').clientWidth - 90}px`
  })

  document.querySelectorAll('.tracks_reveal').forEach((reveal) => {
    reveal.style.marginTop = "-" + reveal.offsetHeight.toString() + "px"
  })
  
  document.querySelectorAll('a .no_pic').forEach((pic) => {
    const title = pic.parentNode.getAttribute('title')  
    if (!pic.hasChildNodes()) {
      pic.append(makeSVGFromTitle(800, title))
    }
  })
}
document.addEventListener('turbolinks:load', handlers)
