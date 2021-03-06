// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require_tree .
//= require jquery
//= require bootstrap-sprockets
//= require_tree ./channels

// xmlGET
var httpGet = function(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText)
  }
  xmlHttp.open("GET", theUrl, true)
  xmlHttp.send(null)
}

// ===========

window.addEventListener('load', function() {
  // =========================
  // Logout audio
  // =========================
  logoutAudio = document.querySelector('.logoutAudio')
  clickHandler = function(event) {
    event.preventDefault()
    self = this
    logoutAudio.addEventListener('ended', function() {
      self.removeEventListener('click', clickHandler)
      self.click()
    })
    logoutAudio.currentTime = 0
    logoutAudio.play()
  }
  document.querySelector('#logoutBtn').addEventListener('click', clickHandler)
})