import { Controller } from 'stimulus'
import LargePlayAnimation from '../animation/large_play_animation'
import Waveform from '../animation/waveform'

export default class extends Controller {
  static targets = ['play', 'playButton', 'time', 'progressContainerInner', 'waveform', 'seekBar']

  initialize() {
    this.animation = new LargePlayAnimation()
    this.waveform = this.setupWaveform()
    this.percentPlayed = 0.0
    this.setDelegate()
    this.animation.init()
    this.setAnimationState()
  }

  setAnimationState() {
    // if we were initialized *while* an mp3 is still loading
    if (this.delegate && this.delegate.isPlaying && !this.delegate.loaded) {
      this.animation.showLoading()
    } else if (this.delegate && this.delegate.isPlaying) {
      this.animation.showPause()
    } else {
      this.animation.setPlay()
    }
  }

  // this is the controller that the big play button / waveform is linked to
  setDelegate() {
    const itemInPlaylist = document.querySelector('.tracklist li.active')
    if (itemInPlaylist) this.delegate = this.application.getControllerForElementAndIdentifier(itemInPlaylist, 'playlist-playback')
    else {
      this.delegate = this.application.getControllerForElementAndIdentifier(this.element, 'single-playback')
    }
  }

  play() {
    this.animation.showPause()
    this.progressContainerInnerTarget.classList.add('visible')
  }

  togglePlay(e) {
    this.setDelegate()
    this.delegate.togglePlay(e)
  }

  skim(e) {
    const offx = e.clientX - this.waveformTarget.getBoundingClientRect().left
    this.seekBarTarget.style.left = `${offx}px`
  }

  seek(e) {
    const offset = e.clientX - this.waveformTarget.getBoundingClientRect().left
    const newPosition = offset / this.waveformTarget.offsetWidth
    this.delegate.seek(newPosition)
  }

  update(percentPlayed) {
    this.percentPlayed = percentPlayed
    this.waveform.update()
    this.timeTarget.innerHTML = this.delegate.time
    this.progressContainerInnerTarget.style.left = 100 * this.percentPlayed + "%"
  }

  reset() {
    this.animation.reset()
    this.progressContainerInnerTarget.style.left = '0%'
  }

  disconnect() {
    this.waveformTarget.querySelector('canvas').remove()
  }

  setupWaveform() {
    const controller = this
    const data = this.data.get('waveform')
    return new Waveform({
      container: this.waveformTarget,
      height: 54,
      percentPlayed: function () {
        return controller.percentPlayed
      },
      data,
    })
  }
}