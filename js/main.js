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
let endRadius     //打击音符结束下落相对y轴的距离

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
let obj_canvas


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
    this.gameinfo = new GameInfo()
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

   // this.load()
	  camera = new THREE.OrthographicCamera(120, -120, 120 / cameraAspect, -120 / cameraAspect,1,100000)
	  //camera = new THREE.PerspectiveCamera(75, cameraAspect, 1, 100000)
	  console.log(camera.position)
    camera.position.set(0, 120 / cameraAspect * 0.3, 300)
    controls = new THREE.OrbitControls(camera)
    //controls.enableRotate = false
    camera.lookAt(0, 0, 0)

    //
    this.scene = new THREE.Scene()
    this.camera =new THREE.OrthographicCamera(window.innerWidth/-2,window.innerHeight/2, window.innerHeight / -2, 0, 10000)
    this.open = wx.getOpenDataContext()
    console.log(this.open)
    this.sharedCanvas = this.open.canvas
    console.log(this.sharedCanvas)
    var rankctx = this.sharedCanvas.getContext('2d')
    console.log(rankctx)
    rankctx.fillStyle = "#0000ff";
    rankctx.fillRect(200, 200, 850, 800);
    const {pixelRatio, windowHeight, windowWidth} = wx.getSystemInfoSync()
    //一定要在主域中设定宽高
    this.sharedCanvas.width = 1000 ; 
    this.sharedCanvas.height = 1000;
    //把开放域中的canvas弄到材质里，以后可以用mesh渲染出来
    this.rankingTexture = new THREE.CanvasTexture(this.sharedCanvas)
    this.rankingTexture.minFilter = this.rankingTexture.magFilter = THREE.LinearFilter
    this.rankingTexture.needsUpdate = true
    console.log(window.innerWidth)
    let geometry = new THREE.PlaneGeometry(1000, 1000)
    let material = new THREE.MeshBasicMaterial({ map: this.rankingTexture, transparent: false })
    this.ranking = new THREE.Mesh(geometry, material)
    console.log(this.ranking)

    this.ranking.position.set(0, 0, 0)
    scene.add(this.ranking)
    console.log(this.ranking)


     this.rankingTexture = new THREE.CanvasTexture(this.sharedCanvas)
    this.rankingTexture.minFilter = this.rankingTexture.magFilter = THREE.LinearFilter
    this.rankingTexture.needsUpdate = true
    console.log(window.innerWidth)
    let geometry = new THREE.PlaneGeometry(1000, 1000)
    let material = new THREE.MeshBasicMaterial({ map: this.rankingTexture, transparent: false })
    this.ranking = new THREE.Mesh(geometry, material)
    console.log(this.ranking)

    this.ranking.position.set(0, 0, 0)
    scene.add(this.ranking)
    console.log(this.ranking)

    var img = new Image(100, 100)
    img.src = 'images/bg.png'
    img.onload = this.drawImageActualSize(ranking);
    ctx.drawImage(this.img, 10, 10);






    //字体加载
    let loader = new THREE.FontLoader();
    loader.load('https://haurchefant-g.github.io/fonts/helvetiker_regular.typeface.json', function (font) {
      let fontCfg = {
        font: font,
        size: 20,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 3,
        bevelSegments: 12
      };
      //按钮
      //添加开始按钮
      var fontGeometry = new THREE.TextBufferGeometry('Start', fontCfg);
      fontGeometry.computeBoundingBox();//绑定盒子模型
      fontGeometry.center();
      console.log(fontGeometry)

      // 添加开始按钮文字的素材
      var color= new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color:color,
        side:THREE.DoubleSide
      });
      databus.starttext = new THREE.Mesh(fontGeometry, fontMaterial);
      //databus.starttext.up.set(0,0,0)
      console.log(databus.starttext)

      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      databus.starttext.rotation.y += Math.PI
      //font.lookAt(camera.position)
      scene.add(databus.starttext);
      preLoadDone = true
    })
    //help
    //字体加载
    let loader_help = new THREE.FontLoader();
    loader_help.load('https://haurchefant-g.github.io/fonts/helvetiker_regular.typeface.json', function (font1) {
      let fontCfg = {
        font: font1,
        size: 20,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 9,
        bevelSize: 0,
        bevelSegments: 12
      };
      var color = new THREE.Color(0x006699);
      var matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      var matDark = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
      });
      //按钮
      //添加帮助按钮
      //var shapes = font.generateShapes(message, 100);
      var fontGeometry_help = new THREE.ShapeBufferGeometry(font1.generateShapes('Help', 100));
      //var help = new font1.generateshape('Help', 100)
      //var fontGeometry_help = new THREE.ShapeBufferGeometry(geometry)//fontCfg);
      fontGeometry_help.computeBoundingBox();//绑定盒子模型
      fontGeometry_help.center();
      console.log(fontGeometry_help)

      // 添加帮助按钮文字的素材
      var color= new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color:color,
        side:THREE.DoubleSide
      });
      databus.helptext = new THREE.Mesh(fontGeometry_help, matDark);
      databus.helptext.position.set(0,-30,0)
      //databus.starttext.up.set(0,0,0)
      console.log(databus.helptext)

      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      databus.helptext.rotation.y += Math.PI
      //font.lookAt(camera.position)
      scene.add(databus.helptext);
      preLoadDone = true
    })


    //stop
    //字体加载
    let loader_stop = new THREE.FontLoader();
    loader_stop.load('https://haurchefant-g.github.io/fonts/helvetiker_regular.typeface.json', function (font) {
      let fontCfg = {
        font: font,
        size: 40,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 3,
        bevelSegments: 12
      };
      //按钮
      //添加帮助按钮
      var fontGeometry_stop = new THREE.TextBufferGeometry('stop', fontCfg);
      fontGeometry_stop.computeBoundingBox();//绑定盒子模型
      fontGeometry_stop.center();
      console.log(fontGeometry_stop)

      // 添加帮助按钮文字的素材
      var color= new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color:color,
        side:THREE.DoubleSide
      });
      databus.stoptext = new THREE.Mesh(fontGeometry_stop, fontMaterial);
      databus.stoptext.position.set(0,-30,0)
      //databus.starttext.up.set(0,0,0)
      console.log(databus.stoptext)

      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      databus.stoptext.rotation.y += Math.PI
      //font.lookAt(camera.position)
      preLoadDone = true
    })


     //back
    //字体加载
    let loader_back = new THREE.FontLoader();
    loader_back.load('https://haurchefant-g.github.io/fonts/helvetiker_regular.typeface.json', function (font) {
      let fontCfg = {
        font: font,
        size: 20,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 3,
        bevelSegments: 12
      };
      //按钮
      //添加帮助按钮
      var fontGeometry_back = new THREE.TextBufferGeometry('Back', fontCfg);
      fontGeometry_back.computeBoundingBox();//绑定盒子模型
      fontGeometry_back.center();
      console.log(fontGeometry_back)

      // 添加帮助按钮文字的素材
      var color= new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color:color,
        side:THREE.DoubleSide
      });
      databus.backtext = new THREE.Mesh(fontGeometry_back, fontMaterial);
      databus.backtext.position.set(0,-30,0)
      //databus.starttext.up.set(0,0,0)
      console.log(databus.backtext)

      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      databus.backtext.rotation.y += Math.PI
      //font.lookAt(camera.position)
      preLoadDone = true
    })

   //let message = "Three.js\nStroke text.";
    //let shapes = font.generateShapes(message, 100);
    //let geometry = new THREE.ShapeBufferGeometry(shapes);




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

  //点击命中物体事件添加
  initRaycaster() {
    canvas.addEventListener('touchstart', (event) => {
      var pos = new THREE.Vector2();
      var intersects = []
      //寻找命中的note
      event.touches.forEach((touch) => {
        pos.x = (touch.clientX / winWidth) * 2 - 1;
        pos.y = - (touch.clientY / winHeight) * 2 + 1;
        raycaster.setFromCamera(pos, camera)
        console.log(databus.notes)
        //传入的databus.notes是要检测的是否点击到的物体的数组（必须为Mesh类的数组，不能为Group类的数组），要检测其他的物体，修改databus.notes即可
        intersects = intersects.concat(raycaster.intersectObjects([databus.starttext]).map(e => e.object));
        intersects = intersects.concat(raycaster.intersectObjects([databus.helptext]).map(e => e.object));
        intersects = intersects.concat(raycaster.intersectObjects([databus.stoptext]).map(e => e.object));
        intersects = intersects.concat(raycaster.intersectObjects([databus.backtext]).map(e => e.object));
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
      console.log(result)
      //start点击检测
      result.forEach(child => {
        if(child === databus.starttext) {
          scene.remove(databus.starttext)
          scene.remove(databus.helptext)
          this.load()
        }
      })
      //help点击检测
      result.forEach(child => {
        if(child === databus.helptext) {
          scene.remove(child)
          scene.remove(databus.starttext)
          scene.add(databus.backtext);
          //this.load()
        }
      })
      //stop点击检测
      result.forEach(child => {
        if(child === databus.stoptext) {
          scene.remove(child)
          preLoadDone=false;
          //this.load()
        }
      })
      //back点击检测
      result.forEach(child => {
        if(child === databus.backtext) {
          scene.add(camera)
          scene.remove(databus.backtext)
          scene.remove(child)
          scene.add(databus.starttext)
          scene.add(databus.helptext)
          //this.load()
        }
      })
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
        scene.add(databus.stoptext);
        //preLoadDone +=1
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
      console.log(this.rankinge)
      const delta = clock.getDelta()
      //databus.starttext.lookAt(camera.position)
      //console.log(databus.starttext.up)
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
    
   //render() {
     //this.gameinfo.renderGameScore(ctxmenu, databus.score)

     // 游戏结束停止帧循环
    // if ( databus.gameOver ) {
    //   this.gameinfo.renderGameOver(ctxmenu, databus.score)

    //   if ( !this.hasEventBind ) {
      //   this.hasEventBind = true
      //   this.touchHandler = this.touchEventHandler.bind(this)
      //   canvas.addEventListener('touchstart', this.touchHandler)
     //  }
   //  }
 //  }

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
