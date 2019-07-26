import Databus from '../databus'

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

const MUSICLIST = [
  { name: 'chinax', keynum: 4, level: 'hd' },
  { name: 'shadowgraph', keynum: 4, level: 'hd' },
  { name: 'identity4', keynum: 4, level: 'hd' },
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

  scoreUI(score, combo) {
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
      } else if ( (h < 2) && (w < 2)) {
        this.choosemusic(e.changedTouches[0])
      }
    }
  }

  menuslideUI() {
    ++frame
    this.ctx.globalAlpha = 1
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
  }

  choosemusic() {

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
