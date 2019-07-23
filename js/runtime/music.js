let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    //this.bgmAudio.loop = true
    this.bgmAudio.src = 'audio/standalonebeatmasta.mp3'
  }

  playBgm() {
    this.bgmAudio.play()
  }
}
