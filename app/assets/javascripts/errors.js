// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

onLoad = function() {
  audio = document.querySelector('#not_found_audio')
  audio.addEventListener('ended', function() {
    audio.currentTime = 0
    window.location.href = "/"
  })
  audio.play()
}

page.addEventListener('load', onLoad)