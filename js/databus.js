import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0

    this.musicname = ''
    this.keynum = 0
    this.shiftdegree = 0
    this.level = ''

    this.musictime = 0
    this.BMP        = 0
    this.flickernum = 0
    this.BPMlist = []

    this.notenum = 0
    this.notelist   = []

    this.notes      = []
    this.intersectnotes = []
    //this.camera     = undefined
    this.bullets    = []
    this.enemys     = []
    this.animations = []

    this.gameOver   = false
    this.goodmesh = undefined
    this.badmesh = undefined
    this.wonderfulmesh = undefined
    this.missmesh = undefined
    this.note1mesh = undefined
    this.note2mesh = undefined
    this.loopmesh = undefined
    this.notemessage = []
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}

var databus = new DataBus()
export default databus
