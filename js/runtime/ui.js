import Databus from '../databus'
import NOTE       from '../note/note'
import THREE      from '../libs/three_modified'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight  
const aspect = screenWidth / screenHeight


const ENTRY_IMG_SRC = 'image/entry.jpg'
const ENTRY_WIDTH = 1344
const ENTRY_HEIGHT = 560

const HALO_IMG_SRC = 'image/halo.png'
const HALO_WIDTH = 450
const HALO_HEIGHT = 450

const TOUCH_IMG_SRC = 'image/touch.png'
const TOUCH_WIDTH = 720
const TOUCH_HEIGHT = 45

const FALLING_IMG_SRC = 'image/falling.png'
const FALLING_WIDTH = 292
const FALLING_HEIGHT = 45


const LINE_IMG_SRC = 'image/line.png'
const LINE_WIDTH = 1251
const LINE_HEIGHT = 32

const CIRCLE_IMG_SRC = 'image/circle.png'
const CIRCLE_WIDTH = 1341
const CIRCLE_HEIGHT = 1315

const PATTERN_IMG_SRC = 'image/pattern.png'
const PATTERN_WIDTH = 673
const PATTERN_HEIGHT = 121

const SCORE_IMG_SRC = 'image/score.png'
const SCORE_WIDTH = 185
const SCORE_HEIGHT = 29

const COMBO_IMG_SRC = 'image/combo.png'
const COMBO_WIDTH = 299
const COMBO_HEIGHT = 44

const CONTAINER_IMG_SRC = 'image/container.png'
const CONTAINER_WIDTH = 750
const CONTAINER_HEIGHT = 250

const PAUSE_IMG_SRC = 'image/pause.png'
const PAUSE_WIDTH = 94
const PAUSE_HEIGHT = 87

const CONTINUE_IMG_SRC = 'image/continue.png'
const CONTINUE_WIDTH = 654
const CONTINUE_HEIGHT = 119

const RESTART_IMG_SRC = 'image/restart.png'
const RESTART_WIDTH = 655
const RESTART_HEIGHT = 103

const MENU_IMG_SRC = 'image/menu.png'
const MENU_WIDTH = 549
const MENU_HEIGHT = 105

const RESTART2_IMG_SRC = 'image/restart2.png'
const RESTART2_WIDTH = 529
const RESTART2_HEIGHT = 76

const MENU2_IMG_SRC = 'image/menu2.png'
const MENU2_WIDTH = 369
const MENU2_HEIGHT = 99

const LINE2_IMG_SRC = 'image/line2.png'
const LINE2_WIDTH = 1185
const LINE2_HEIGHT = 14

const LOADING_IMG_SRC = 'image/loading.png'
const LOADING_WIDTH = 297
const LOADING_HEIGHT = 45


var entry = new Image()
entry.src = ENTRY_IMG_SRC
var halo = new Image()
halo.src = HALO_IMG_SRC
var touch = new Image()
touch.src = TOUCH_IMG_SRC
var falling = new Image()
falling.src = FALLING_IMG_SRC
var line = new Image()
line.src = LINE_IMG_SRC
let circle = new Image()
circle.src = CIRCLE_IMG_SRC
let pattern = new Image()
pattern.src = PATTERN_IMG_SRC
let SCORE = new Image()
SCORE.src = SCORE_IMG_SRC
let COMBO = new Image()
COMBO.src = COMBO_IMG_SRC
let container = new Image()
container.src = CONTAINER_IMG_SRC
let PAUSE = new Image()
PAUSE.src = PAUSE_IMG_SRC
let CONTINUE = new Image()
CONTINUE.src = CONTINUE_IMG_SRC
let RESTART = new Image()
RESTART.src = RESTART_IMG_SRC
let MENU = new Image()
MENU.src = MENU_IMG_SRC
let RESTART2 = new Image()
RESTART2.src = RESTART2_IMG_SRC
let MENU2 = new Image()
MENU2.src = MENU2_IMG_SRC
var line2 = new Image()
line2.src = LINE2_IMG_SRC
var loading = new Image()
loading.src = LOADING_IMG_SRC

const MUSICLIST = [
  { name: 'chinax', keynum: 4, level: 'hd' },
  { name: 'shadowgraph', keynum: 4, level: 'hd' },
  { name: 'Identity4', keynum: 4, level: 'hd' },
  { name: 'standalonebeatmasta', keynum: 4, level: 'hd' }]

let target = 1

let degree = 180
let bgscale  = 1
let haloscale = 1
let textscale = 1
let frame = 1
let direction = 1



export default class UI {
  constructor() {
    this.canvas = wx.createCanvas()
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = "#ffffff"
    this.ctx.textAlign = "center"
    this.ctx.font = "30px Arial"
    //this.reset()
    this.line = new Image()
    this.line.src = LINE_IMG_SRC
  }

  toscoreUI() {
    Databus.bloomPass.threshold = 0
    Databus.bloomPass.strength = 2
    Databus.bloomPass.radius = 1
    wx.offTouchStart(Databus.touchstart)
    Databus.touchstart = this.scoretouch.bind(this)
    wx.onTouchStart(Databus.touchstart)
    Databus.updateUI = this.scoreUI.bind(this)
  }

  scoreUI() {
    this.clear()
    let width
    let height
    width = screenWidth * 0.65
    height = width / CIRCLE_WIDTH * CIRCLE_HEIGHT  
    this.ctx.drawImage(circle, (screenWidth - width) * 0.5, (screenHeight - height) * 0.5, width, height )

    height = (screenHeight - height) * 0.5 + height * 0.20
    this.ctx.drawImage(line, 0, height, screenWidth, LINE_HEIGHT)
    this.ctx.drawImage(line, 0, screenHeight - height - LINE_HEIGHT, screenWidth, LINE_HEIGHT)

    height = (height + screenHeight * 0.5) / 2   // height + 2 * LINE_HEIGHT
    this.ctx.drawImage(SCORE, screenWidth * 0.05, height, screenWidth * 0.2, screenWidth * 0.2 / SCORE_WIDTH * SCORE_HEIGHT)
    this.ctx.drawImage(COMBO, screenWidth * 0.75, height, screenWidth * 0.2, screenWidth * 0.2 / COMBO_WIDTH * COMBO_HEIGHT)
    this.ctx.fillText(score, screenWidth * 0.15, screenHeight * 0.5)
    this.ctx.fillText(combo, screenWidth * 0.85, screenHeight * 0.5)

    width = screenWidth * 0.5
    height = width / PATTERN_WIDTH * PATTERN_HEIGHT
    this.ctx.drawImage(pattern, 0, 0, width, height)
  }

  originUI() {
    this.clear()
    let height = screenHeight * (Math.cos(Math.PI / 180 * degree) * 0.2 + 1.2)
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)

    height = screenHeight * HALO_HEIGHT / ENTRY_HEIGHT
    width = height
    this.ctx.translate(screenWidth / 2, screenHeight / 2)
    this.ctx.rotate(Math.PI / 180 * degree)
    this.ctx.translate(- screenWidth / 2, - screenHeight / 2)
    this.ctx.globalAlpha = Math.cos(1.5 * Math.PI / 180 * degree) * 0.2 + 0.7
    this.ctx.drawImage(halo, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)
    this.ctx.translate(screenWidth / 2, screenHeight / 2)
    this.ctx.rotate(-Math.PI / 180 * degree)
    this.ctx.translate(- screenWidth / 2, - screenHeight / 2)

    height = height * 0.08
    width = height / LOADING_HEIGHT * LOADING_WIDTH
    this.ctx.globalAlpha = 1
    this.ctx.drawImage(loading, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height) 

    ++degree
    if (Databus.bgm) {
      Databus.touchstart = this.entrytomenu.bind(this)
      wx.onTouchStart(Databus.touchstart)
      Databus.updateUI = this.entryUI.bind(this)
    }

  }


  entryUI() {
    this.clear()
    let height = screenHeight * (Math.cos(Math.PI / 180 * degree) * 0.2 + 1.2)
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)

    height = screenHeight * HALO_HEIGHT / ENTRY_HEIGHT
    width = height
    this.ctx.translate(screenWidth / 2, screenHeight / 2)
    this.ctx.rotate(Math.PI / 180 * degree)
    this.ctx.translate(- screenWidth / 2, - screenHeight / 2)
    this.ctx.globalAlpha = Math.cos(1.5 * Math.PI / 180 * degree) * 0.2 + 0.7
    this.ctx.drawImage(halo, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)
    this.ctx.translate(screenWidth / 2, screenHeight / 2)
    this.ctx.rotate(-Math.PI / 180 * degree)
    this.ctx.translate(- screenWidth / 2, - screenHeight / 2)

    height = height * 0.08
    width = height / TOUCH_HEIGHT * TOUCH_WIDTH
    this.ctx.globalAlpha = Math.cos(2 * Math.PI / 180 * degree) * 0.4 + 0.6
    this.ctx.drawImage(touch, (screenWidth - width) / 2, screenHeight - 2 * height, width, height)

    width = height / FALLING_HEIGHT * FALLING_WIDTH
    this.ctx.globalAlpha = 1
    this.ctx.drawImage(falling, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height) 

    ++degree
  }

  entrytomenu() {
    Databus.updateUI = this.entrytoUI.bind(this)
    bgscale = Math.cos(Math.PI / 180 * degree) * 0.2 + 1.2
    haloscale = 1
    textscale = 1
    wx.offTouchStart(Databus.touchstart)
  }

  entrytoUI() {
    this.clear()
    if (bgscale < 4) {
      bgscale *= Math.pow(1.001, frame)
    }
    Databus.bloomPass.radius *= 1.03
    let height = screenHeight * bgscale
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)

    if( Databus.bloomPass.radius < 5) {
      haloscale *= Math.pow(0.999, frame)
      height = screenHeight * HALO_HEIGHT / ENTRY_HEIGHT * haloscale
      width = height
      this.ctx.translate(screenWidth / 2, screenHeight / 2)
      this.ctx.rotate(Math.PI / 180 * degree)
      this.ctx.translate(- screenWidth / 2, - screenHeight / 2)
      this.ctx.globalAlpha = Math.cos(1.5 * Math.PI / 180 * degree) * 0.2 + 0.7
      this.ctx.drawImage(halo, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)
      this.ctx.translate(screenWidth / 2, screenHeight / 2)
      this.ctx.rotate(-Math.PI / 180 * degree)
      this.ctx.translate(- screenWidth / 2, - screenHeight / 2)
  
      textscale *= 0.98
      height = height * 0.08
      width = height / TOUCH_HEIGHT * TOUCH_WIDTH
      this.ctx.globalAlpha = Math.cos(2 * Math.PI / 180 * degree) * 0.4 + 0.6
      this.ctx.drawImage(touch, (screenWidth - width) / 2, screenHeight - 2 * height * textscale, width, height * textscale)
  
      width = height / FALLING_HEIGHT * FALLING_WIDTH
      this.ctx.globalAlpha = 1
      this.ctx.drawImage(falling, (screenWidth - width) / 2, (screenHeight - height * textscale) / 2, width, height * textscale)
      ++degree
      ++frame
    } else {
      this.tomenuUI()
      //wx.onTouchStart(Databus.touchstart)

    }
  }

  tomenuUI() {
    haloscale = 1
    textscale = 1
    bgscale = 1
    target = 1
    frame = 0
    this.ctx.globalAlpha = 0
    Databus.bloomPass.radius = 1
    Databus.touchstart = this.touchstart.bind(this)
    Databus.touchend = this.touchend.bind(this)
    wx.onTouchStart(Databus.touchstart)
    wx.onTouchEnd(Databus.touchend)
    Databus.updateUI = this.menuUI.bind(this)
  }

  menuUI() {
    frame++
    this.ctx.globalAlpha = frame / 120

    let height = screenHeight * bgscale
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)

    width = screenWidth * 0.6
    height = screenHeight * 0.3
    this.ctx.drawImage(container, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)
    this.ctx.fillText(MUSICLIST[target].name, screenWidth / 2, (screenHeight - height) / 2 + height / 2)

    width = screenWidth * 0.5
    height = screenHeight * 0.25
    if (target > 0) {
      this.ctx.drawImage(container, (screenWidth - width) / 2, screenHeight * 0.05, width, height)
      this.ctx.fillText(MUSICLIST[target - 1].name, screenWidth / 2, screenHeight * 0.05  + height / 2)
    }
    if (target < MUSICLIST.length - 1) {
      this.ctx.drawImage(container, (screenWidth - width) / 2, screenHeight * 0.7, width, height)
      this.ctx.fillText(MUSICLIST[target + 1].name, screenWidth / 2, screenHeight * 0.7  + height / 2)
    }
    
  }

  touchstart(e) {
    Databus.touchpos.x = e.changedTouches[0].clientX
    Databus.touchpos.y = e.changedTouches[0].clientY
    Databus.touchpos.Id = e.changedTouches[0].identifier
  }
  /*获取结束坐标和id*/
  touchend(e) {
    if(e.changedTouches[0].identifier === Databus.touchpos.Id){
      let h = e.changedTouches[0].clientY - Databus.touchpos.y
      let w = e.changedTouches[0].clientX - Databus.touchpos.x
      if (Math.abs(h) > 20 ) {
        direction = (h > 0) ? -1 : 1
        if(((target + direction) >= 0) && ((target + direction) <= MUSICLIST.length - 1)) {
          frame = 0
          Databus.updateUI = this.menuslideUI.bind(this)
          wx.offTouchStart(Databus.touchstart)
          wx.offTouchEnd(Databus.touchend)
        }
      } else if ( Math.abs(h < 2) && Math.abs(w < 2)) {
        this.choosemusic(e.changedTouches[0])
      }
    }
  }

  menuslideUI() {
    ++frame
    let height = screenHeight
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)

    let m = frame / 30
    let n = 1 - m

    if (direction === -1) {
      width = screenWidth * 0.6 * n + screenWidth * 0.5 * m
      height = screenHeight * 0.3 * n + screenHeight * 0.25 * m
      this.ctx.drawImage(container, (screenWidth - width) / 2, (screenHeight - height) / 2 * n + screenHeight * 0.7 * m, width, height)
      this.ctx.fillText(MUSICLIST[target].name, screenWidth / 2, (screenHeight - height) / 2 * n + screenHeight * 0.7 * m  + height / 2)

      width = screenWidth * 0.6 * m + screenWidth * 0.5 * n
      height = screenHeight * 0.3 * m + screenHeight * 0.25 * n
      this.ctx.drawImage(container, (screenWidth - width) / 2, (screenHeight - height) / 2 * m + screenHeight * 0.05 * n, width, height)
      this.ctx.fillText(MUSICLIST[target - 1].name, screenWidth / 2,  (screenHeight - height) / 2 * m + screenHeight * 0.05 * n  + height / 2)

      if(target > 1) {
        this.ctx.globalAlpha = m
        width = screenWidth * 0.5
        height = screenHeight * 0.25
        this.ctx.drawImage(container, (screenWidth - width) / 2, screenHeight * 0.05, width, height)
        this.ctx.fillText(MUSICLIST[target - 2].name, screenWidth / 2, screenHeight * 0.05  + height / 2)
      }
      if(target < MUSICLIST.length - 1) {
        this.ctx.globalAlpha = n
        width = screenWidth * 0.5
        height = screenHeight * 0.25
        this.ctx.drawImage(container, (screenWidth - width) / 2, screenHeight * 0.7, width, height)
        this.ctx.fillText(MUSICLIST[target + 1].name, screenWidth / 2, screenHeight * 0.7  + height / 2)
      }
    } else {
      width = screenWidth * 0.6 * n + screenWidth * 0.5 * m
      height = screenHeight * 0.3 * n + screenHeight * 0.25 * m
      this.ctx.drawImage(container, (screenWidth - width) / 2, (screenHeight - height) / 2 * n + screenHeight * 0.05 * m, width, height)
      this.ctx.fillText(MUSICLIST[target].name, screenWidth/ 2, (screenHeight - height) / 2 * n + screenHeight * 0.05 * m  + height / 2)

      width = screenWidth * 0.6 * m + screenWidth * 0.5 * n
      height = screenHeight * 0.3 * m + screenHeight * 0.25 * n
      this.ctx.drawImage(container, (screenWidth - width) / 2, (screenHeight - height) / 2 * m + screenHeight * 0.7 * n, width, height)
      this.ctx.fillText(MUSICLIST[target + 1].name, screenWidth / 2,  (screenHeight - height) / 2 * m + screenHeight * 0.7 * n  + height / 2)

      if(target > 0) {
        this.ctx.globalAlpha = n
        width = screenWidth * 0.5
        height = screenHeight * 0.25
        this.ctx.drawImage(container, (screenWidth - width) / 2, screenHeight * 0.05, width, height)
        this.ctx.fillText(MUSICLIST[target - 1].name, screenWidth/ 2, screenHeight * 0.05  + height / 2)
      }
      if(target < MUSICLIST.length - 2) {
        this.ctx.globalAlpha = m
        width = screenWidth * 0.5
        height = screenHeight * 0.25
        this.ctx.drawImage(container, (screenWidth - width) / 2, screenHeight * 0.7, width, height)
        this.ctx.fillText(MUSICLIST[target + 2].name, screenWidth / 2, screenHeight * 0.7  + height / 2)
      }
    }
    if( frame === 30) {
      target = target + direction
      wx.onTouchStart(Databus.touchstart)
      wx.onTouchEnd(Databus.touchend)
      Databus.updateUI = this.menuUI.bind(this)
      frame = 120
    }
    this.ctx.globalAlpha = 1
  }

  choosemusic(e) {
    let width = screenWidth * 0.6
    let height = screenHeight * 0.3
    if((e.clientX > (screenWidth - width) / 2) &&
    (e.clientX < (screenWidth - width) / 2 + width) &&
    (e.clientY > (screenHeight - height) / 2) &&
    (e.clientY < (screenHeight - height) / 2 + height)) {
      Databus.reset()
      Databus.musicname = MUSICLIST[target].name
      Databus.keynum = MUSICLIST[target].keynum
      Databus.level= MUSICLIST[target].level
      Databus.updateUI = this.tomusicUI.bind(this)
      wx.offTouchStart(Databus.touchstart)
      wx.offTouchEnd(Databus.touchend)
    } else {
      width = screenWidth * 0.5
      height = screenHeight * 0.25
      if((target > 0) &&
      (e.clientX > (screenWidth - width) / 2) &&
      (e.clientX < (screenWidth - width) / 2 + width) &&
      (e.clientY > screenHeight * 0.05) &&
      (e.clientY < screenHeight * 0.05 + height)) {
        Databus.reset()
        Databus.musicname = MUSICLIST[target - 1].name
        Databus.keynum = MUSICLIST[target - 1].keynum
        Databus.level= MUSICLIST[target - 1].level
        Databus.updateUI = this.tomusicUI.bind(this)
        wx.offTouchStart(Databus.touchstart)
        wx.offTouchEnd(Databus.touchend)
      } else if ((target < MUSICLIST.length - 1) &&
      (e.clientX > (screenWidth - width) / 2) &&
      (e.clientX < (screenWidth - width) / 2 + width) &&
      (e.clientY > screenHeight * 0.7) &&
      (e.clientY < screenHeight * 0.7 + height)) {
        Databus.reset()
        Databus.musicname = MUSICLIST[target + 1].name
        Databus.keynum = MUSICLIST[target + 1].keynum
        Databus.level= MUSICLIST[target + 1].level
        Databus.updateUI = this.tomusicUI.bind(this)
        wx.offTouchStart(Databus.touchstart)
        wx.offTouchEnd(Databus.touchend)
      }
    }
  }

  tomusicUI() {
    this.clear()
    this.ctx.globalAlpha = 1
    let height = screenHeight
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)

    height = screenHeight * HALO_HEIGHT / ENTRY_HEIGHT
    width = height
    this.ctx.translate(screenWidth / 2, screenHeight / 2)
    this.ctx.rotate(Math.PI / 180 * degree)
    this.ctx.translate(- screenWidth / 2, - screenHeight / 2)
    //this.ctx.globalAlpha = Math.cos(1.5 * Math.PI / 180 * degree) * 0.2 + 0.7
    this.ctx.drawImage(halo, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)
    this.ctx.translate(screenWidth / 2, screenHeight / 2)
    this.ctx.rotate(-Math.PI / 180 * degree)
    this.ctx.translate(- screenWidth / 2, - screenHeight / 2)

    height = height * 0.08
    width = height / LOADING_HEIGHT * LOADING_WIDTH
    this.ctx.globalAlpha = 1
    this.ctx.drawImage(loading, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height) 
    ++degree
    if(Databus.musicready) {
      Databus.updateUI = this.musicUI.bind(this)
      console.log(Databus.updateUI)
      Databus.touchstart = this.musictouch.bind(this)
      wx.onTouchStart(Databus.touchstart)
    }
  }

  musicUI() {
    this.clear()
    this.ctx.drawImage(PAUSE, 35 - width / 2, 35 - width / 2, width, width)
    this.ctx.fillText(Databus.score, screenWidth * 0.5, 40)
    this.ctx.globalAlpha = (100 - frame) / 100
    this.ctx.fillText("Beat the falling object on the loop", screenWidth / 2, screenHeight * 0.3)
    Databus.loopmesh.rotation.y += 0.01
    this.ctx.globalAlpha = 1
  }

  musictouch(event) {
    var pos = new THREE.Vector2();
    var intersects = []
    //寻找命中的note
    event.touches.forEach((touch) => {
      pos.x = (touch.clientX / screenWidth) * 2 - 1;
      pos.y = - (touch.clientY / screenHeight) * 2 + 1;
      Databus.raycaster.setFromCamera(pos, Databus.camera)
      intersects = intersects.concat(Databus.raycaster.intersectObjects(Databus.notes).map(e => e.object))
    })
    //命中note去重
    let result = []
    let obj = {}
    for (let i of intersects) {
        if (!obj[i]) {
            result.push(i)
            obj[i] = 1
        }
      }
    result.forEach(note => {
      switch(note.status){
        case 1:
        NOTE.notejudge(note)
        if (note.type === 0) {
          note.status = 3
        } else {
          note.status = 2
        }
        break
        case 2:
        break
        default:
        break
      }})
    console.log(result)
  }

  pauseUI() {
    this.clear()
    this.ctx.globalAlpha = 1
    Databus.bloomPass.threshold = 0.28;
    Databus.bloomPass.strength = 1.5 //params.bloomStrength;
    Databus.bloomPass.radius = 1;
    let height = screenHeight
    //height = screenHeight * (Math.cos(Math.PI / 180 * degree) * 0.2 + 1.2)
    let width = height / ENTRY_HEIGHT * ENTRY_WIDTH
    this.ctx.drawImage(entry, (screenWidth - width) / 2, (screenHeight - height) / 2, width, height)
    console.log(1)
    ++degree
  }



  clear() {
    this.ctx.clearRect(0, 0, screenWidth, screenHeight)
  }

  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font = "40px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 - 100 + 255
    }
  }
}

