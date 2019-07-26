let instance
/**
 * 全局状态管理器
 */
class DataBus {
  constructor() {
    if ( instance )
      return instance
    instance = this
    this.touchpos = {x:0, y:0, z:0}
    this.gameover = false
    this.musicload = false
    this.musicready = false
  }

  reset() {
    this.frame      = 0
    this.score      = 0
    this.combo      = 0
    this.maxcombo      = 0

    this.gameover = false
    this.musicload = false
    this.musicready = false

    this.musictime = 0
    this.BMP        = 0
    this.flickernum = 0
    this.BPMlist = []

    this.notenum = 0
    this.notelist   = []

    this.clear()

  }

  clear() {
    this.scene.remove(this.loopmesh)
    if(this.notes){
      this.notes.forEach((note) => this.scene.remove(note))
    }
    this.notes      = []
    this.intersectnotes = []
    if(this.notemessage) {
      this.notemessage.forEach((message) => this.scene.remove(message))
    }
    this.notemessage = []
  }

  resetcombo() {
    if (this.combo > this.maxcombo) {
      this.maxcombo = this.combo
    }
    this.combo = 0
  }

}

var databus = new DataBus()
export default databus
