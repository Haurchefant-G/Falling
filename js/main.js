import Player     from './player/index'
import Enemy      from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'
import THREE      from './libs/three_modified'

require('./libs/weapp-adapter.js')

let ctx = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })
//let ctx   = canvas.getContext('2d')
let databus = new DataBus()
let renderer
let camera
let preLoadDone = false;
let scene

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    scene = new THREE.Scene()
    var mtlloader = new THREE.MTLLoader()
    mtlloader.load('https://haurchefant-g.github.io/objs/loop1.mtl', function(material) {
      var objloader = new THREE.OBJLoader()
      objloader.setMaterials(material)
      objloader.load('https://haurchefant-g.github.io/objs/loop1.obj', function(object) {
		object.scale.set(1, 1, 1)
		object.position.y = 20
        scene.add(object)
        preLoadDone = true

      })
    })
    //this.restart()
    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas })

    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    const cameraAspect = winWidth / winHeight

    renderer.setSize(winWidth, winHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    console.log("屏幕尺寸: " + winWidth + " x " + winHeight)

	camera = new THREE.OrthographicCamera(-120, 120, -120 / cameraAspect, 120/cameraAspect,1,1000)
	//camera = new THREE.PerspectiveCamera(75, cameraAspect, 1, 100000)
	console.log(camera.position)
	camera.position.set(0, 30, 120)
	camera.lookAt(0,0,0)


    // 添加环境光
    let ambientLight = new THREE.AmbientLight(0x999999)
    scene.add(ambientLight)

    // 添加投射光
    var directionalLight = new THREE.DirectionalLight(0xcccccc);
    directionalLight.position.set(0, 1200, 1000).normalize();
    scene.add(directionalLight);

    this.loop()
  }

  update() {
    // 更新代码
    if (preLoadDone) {
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
    console.log('update')
    window.requestAnimationFrame(
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
