import Player     from './player/index'
import Enemy      from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'
import THREE      from './libs/three_modified'
import ObjsURL    from '../objs/url'
import NOTE       from './note/note'

require('./libs/weapp-adapter.js')

let ctx = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })
//let ctx   = canvas.getContext('2d')
console.log(canvas)
let databus = new DataBus()
let renderer
let camera
let preLoadDone = false
let scene
let obj

let fallstartY     //打击音符开始下落的高度y
let loopY       //判定环的y坐标
let startRadius //打击音符开始下落相对y轴的距离
let endRadius   //打击音符结束下落相对y轴的距离

let note1 = {
  "time": 100,
  "data": {
    "type": 1,
    "track": [{ "degree": 240, "delay": 0 }]
  }
}


  

let clock
let container;
let mesh;
let controls;
let controls1;
let raycaster

let musicalnote1


let winWidth
let winHeight
let cameraAspect

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    scene = new THREE.Scene()

    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas, alpha:true })

    winWidth = canvas.width
    console.log(canvas)
    console.log(winWidth)
    console.log(canvas.width)
    winHeight = canvas.height
    cameraAspect = winWidth / winHeight
    console.log(renderer)

    loopY = Math.round(-120 / cameraAspect * 0.6)
    fallstartY = Math.round(120 / cameraAspect * 1)
    startRadius = 200
    endRadius = 100
    
    //renderer.setSize(winWidth, winHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    console.log("屏幕尺寸: " + winWidth + " x " + winHeight)

    this.load()
	  camera = new THREE.OrthographicCamera(120, -120, 120 / cameraAspect, -120 / cameraAspect,1,100000)
	  //camera = new THREE.PerspectiveCamera(75, cameraAspect, 1, 100000)
	  console.log(camera.position)
    camera.position.set(0, 120 / cameraAspect * 0.3, 300)
    controls = new THREE.OrbitControls(camera)
    controls.enableRotate = false
    camera.lookAt(0, 0, 0)


    // 添加环境光
    let ambientLight = new THREE.AmbientLight(0x999999)
    scene.add(ambientLight)

    // 添加投射光
    var directionalLight = new THREE.DirectionalLight(0xcccccc);
    directionalLight.position.set(0, 1200, 1000).normalize();
    scene.add(directionalLight);
    console.log(scene)

    //计时器
    clock = new THREE.Clock()
    wx.setPreferredFramesPerSecond(60)

    //点击获取物体
    raycaster = new THREE.Raycaster()
    console.log(raycaster)
    this.initRaycaster()
    this.restart()
  }

  restart() {
    databus.reset()
    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)
    this.loop()
  }

  initRaycaster() {
    canvas.addEventListener('touchstart', (event) => {
      var pos = new THREE.Vector2();
      var intersects = []
      event.touches.forEach((touch) => {
        pos.x = (touch.clientX / winWidth) * 2 - 1;
        pos.y = - (touch.clientY / winHeight) * 2 + 1;
        raycaster.setFromCamera(pos, camera)
        intersects = intersects.concat(raycaster.intersectObjects(databus.notes).map(e => e.object));
      })
      //命中物体去重
      let result = []
      let obj = {}
      for (let i of intersects) {
          if (!obj[i]) {
              result.push(i)
              obj[i] = 1
          }
        }
      databus.intersectnotes = result
    })
  }

  load() {
    var noteAdd = this.noteadd.bind(this)
    THREE.loader('https://haurchefant-g.github.io/objs/loop1.mtl', 'https://haurchefant-g.github.io/objs/loop1.obj', function (object) {
      object.scale.set(1.25, 1.25, 1.25)
      object.position.y = loopY
      console.log(object)
      scene.add(object)
      THREE.loader('https://haurchefant-g.github.io/objs/musicalnote2.mtl', 'https://haurchefant-g.github.io/objs/musicalnote2.obj', function (object2) {
        musicalnote1 = object2.children[0]
        console.log(musicalnote1)
        //noteAdd(note1.data)
        //window.setInterval(noteAdd, 5000, note1.data)
        noteAdd(note1.data)
        preLoadDone = true
      })
    })
    // this.loader('https://haurchefant-g.github.io/objs/musicalnote2.mtl', 'https://haurchefant-g.github.io/objs/musicalnote2.obj', function (object) {
    //   musicalnote1 = object
    //   console.log(musicalnote1)
    // })
  }
  //加载模型
  // loader(mtlurl, objurl, f) {
  //   var mtlloader = new THREE.MTLLoader()
  //   mtlloader.load(mtlurl, function (material) {
  //     var objloader = new THREE.OBJLoader()
  //     objloader.setMaterials(material)
  //     objloader.load(objurl, f)
  //   })
  // }


  noteadd(data) {
    var noteobj
    var arc = Math.PI / 180 * data.track[0].degree
    //console.log(arc)
    var fallstartX = Math.cos(arc) * startRadius
    var fallstartZ = Math.sin(arc) * startRadius
    //console.log(fallstartX, fallstartY, fallstartZ)
    switch(data.type) {
      case 1: noteobj = musicalnote1.clone()
      noteobj.position.set(fallstartX, fallstartY, fallstartZ)
      //console.log(noteobj)
      noteobj.update = NOTE.clicknotetUpdater(arc, fallstartY, fallstartY - loopY, startRadius, endRadius).bind(noteobj)
      //console.log(noteobj.position)
      databus.notes.push(noteobj)
      break
    }
    scene.add(noteobj)
  }

  update() {
    // 更新代码
    if (preLoadDone) {
      const delta = clock.getDelta()
      //console.log(delta)
      //camera.rotation.x += 0.01
      //camera.rotation.y += 0.01
      //camera.rotation.z += 0.01
      //console.log(camera)
      //console.log(camera.position)
      databus.notes.forEach((note) => {
        //console.log(note)
        note.update(delta)
        //console.log(note.position)
      })
    } else {
      //console.log('FFF')
    }
  }


  /**
   * canvas 重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    if (preLoadDone) {
      
      renderer.render(scene, camera)
    }
  }

  // 实现帧循环
  loop() {
    this.update()
    this.render()
    //console.log('update')
    this.aniId = window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }

  // restart() {
  //   databus.reset()

  //   canvas.removeEventListener(
  //     'touchstart',
  //     this.touchHandler
  //   )

  //   this.bg       = new BackGround(ctx)
  //   this.player   = new Player(ctx)
  //   this.gameinfo = new GameInfo()
  //   this.music    = new Music()

  //   this.bindLoop     = this.loop.bind(this)
  //   this.hasEventBind = false

  //   // 清除上一局的动画
  //   window.cancelAnimationFrame(this.aniId);

  //   this.aniId = window.requestAnimationFrame(
  //     this.bindLoop,
  //     canvas
  //   )
  // }

  // /**
  //  * 随着帧数变化的敌机生成逻辑
  //  * 帧数取模定义成生成的频率
  //  */
  // enemyGenerate() {
  //   if ( databus.frame % 30 === 0 ) {
  //     let enemy = databus.pool.getItemByClass('enemy', Enemy)
  //     enemy.init(6)
  //     databus.enemys.push(enemy)
  //   }
  // }

  // // 全局碰撞检测
  // collisionDetection() {
  //   let that = this

  //   databus.bullets.forEach((bullet) => {
  //     for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
  //       let enemy = databus.enemys[i]

  //       if ( !enemy.isPlaying && enemy.isCollideWith(bullet) ) {
  //         enemy.playAnimation()
  //         that.music.playExplosion()

  //         bullet.visible = false
  //         databus.score  += 1

  //         break
  //       }
  //     }
  //   })

  //   for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
  //     let enemy = databus.enemys[i]

  //     if ( this.player.isCollideWith(enemy) ) {
  //       databus.gameOver = true

  //       break
  //     }
  //   }
  // }

  // // 游戏结束后的触摸事件处理逻辑
  // touchEventHandler(e) {
  //    e.preventDefault()

  //   let x = e.touches[0].clientX
  //   let y = e.touches[0].clientY

  //   let area = this.gameinfo.btnArea

  //   if (   x >= area.startX
  //       && x <= area.endX
  //       && y >= area.startY
  //       && y <= area.endY  )
  //     this.restart()
  // }

  // /**
  //  * canvas重绘函数
  //  * 每一帧重新绘制所有的需要展示的元素
  //  */
  // render() {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height)

  //   this.bg.render(ctx)

  //   databus.bullets
  //         .concat(databus.enemys)
  //         .forEach((item) => {
  //             item.drawToCanvas(ctx)
  //           })

  //   this.player.drawToCanvas(ctx)

  //   databus.animations.forEach((ani) => {
  //     if ( ani.isPlaying ) {
  //       ani.aniRender(ctx)
  //     }
  //   })

  //   this.gameinfo.renderGameScore(ctx, databus.score)

  //   // 游戏结束停止帧循环
  //   if ( databus.gameOver ) {
  //     this.gameinfo.renderGameOver(ctx, databus.score)

  //     if ( !this.hasEventBind ) {
  //       this.hasEventBind = true
  //       this.touchHandler = this.touchEventHandler.bind(this)
  //       canvas.addEventListener('touchstart', this.touchHandler)
  //     }
  //   }
  // }

  // // 游戏逻辑更新主函数
  // update() {
  //   if ( databus.gameOver )
  //     return;

  //   this.bg.update()

  //   databus.bullets
  //          .concat(databus.enemys)
  //          .forEach((item) => {
  //             item.update()
  //           })

  //   this.enemyGenerate()

  //   this.collisionDetection()

  //   if ( databus.frame % 20 === 0 ) {
  //     this.player.shoot()
  //     this.music.playShoot()
  //   }
  // }

  // // 实现游戏帧循环
  // loop() {
  //   databus.frame++

  //   this.update()
  //   this.render()

  //   this.aniId = window.requestAnimationFrame(
  //     this.bindLoop,
  //     canvas
  //   )
  // }
}
