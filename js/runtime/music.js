let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor () {
    if (instance) { return instance }

    instance = this

    this.bgmAudio = new Audio()
    this.titlebgmAudio = new Audio()
    // this.bgmAudio.loop = true
    this.bgmAudio.src = null
    this.titlebgmAudio.src = null
    this.bgmAudio.loop = false
  }

  playBgm () {
    this.bgmAudio.play()
  }

  playTitleBgm () {
    this.titlebgmAudio.loop = true
    this.titlebgmAudio.play()
  }

  setBgm (url) {
    this.bgmAudio.src = url
  }

  setTitleBgm (url) {
    this.titlebgmAudio.src = url
  }

  pauseBgm () {
    this.bgmAudio.pause()
  }

  pauseTitleBgm () {
    this.titlebgmAudio.pause()
  }

  resetBgm () {
    this.bgmAudio.currentTime = 0
  }
}
