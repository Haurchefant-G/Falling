//import Player     from './player/index'
//import Enemy      from './npc/enemy'
//import BackGround from './runtime/background'
//import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import Databus    from './databus'
import THREE      from './libs/three_modified'
import UI         from './runtime/ui'
import ObjsURL    from '../objs/url'
import NOTE       from './note/note'
import Clock       from './base/clock'


//import { EffectComposer } from './libs/EffectComposer'
//import { RenderPass } from './libs/RenderPass'
//import { UnrealBloomPass } from './libs/UnrealBloomPass'


require('./libs/weapp-adapter.js')


let ctx = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })
Databus.canvas = canvas





console.log(canvas)

let fs = wx.getFileSystemManager()

let renderer
console.log(wx.env.USER_DATA_PATH)
let preLoadDone = false
let gaming = false
let scene
let camera

let ui = new UI()
let uiscene
let uicamera


let fallstartY     //打击音符开始下落的高度y
let loopY       //判定环的y坐标
let startRadius //打击音符开始下落相对y轴的距离
let endRadius     //打击音符结束下落相对y轴的距离


  
let composer
let bloomPass
let clock
let controls;
let raycaster

let winWidth
let winHeight
let cameraAspect

var params = {
  exposure: 0.8,
  bloomStrength:  1.5,
  bloomThreshold: 0.28,
  bloomRadius: 1
}


/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    //this.gameinfo = new GameInfo()
    scene = new THREE.Scene()
    uiscene = new THREE.Scene()
    this.music = new Music()
    Databus.scene = scene

    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas, alpha:true })
    //renderer.autoClear = false;

    winWidth = canvas.width
    console.log(canvas)
    console.log(winWidth)
    console.log(canvas.width)
    winHeight = canvas.height
    cameraAspect = winWidth / winHeight
    //console.log(renderer)

    loopY = Math.round(-120 / cameraAspect * 0.6)
    fallstartY = Math.round(120 / cameraAspect * 3)
    startRadius = 180
    endRadius = 100

    Databus.loopY = loopY
    

    //renderer.setSize(winWidth, winHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.ReinhardToneMapping
    //THREE.NoToneMapping
    //THREE.LinearToneMapping
    //THREE.ReinhardToneMapping
    //THREE.Uncharted2ToneMapping
    //THREE.CineonToneMapping

    console.log("屏幕尺寸: " + winWidth + " x " + winHeight)


    uicamera = new THREE.OrthographicCamera(-winWidth/2, winWidth/2, winHeight/2, -winHeight / 2, 1, 100000)
    uicamera.position.set(0, 0, 50)
	  camera = new THREE.OrthographicCamera(-120, 120, 120 / cameraAspect, -120 / cameraAspect,1,100000)
    camera.position.set(0, 120 / cameraAspect * 0.5, 160)
    Databus.camera = camera

    //camera.position.set(0, 0, -160)
	  //camera = new THREE.PerspectiveCamera(75, cameraAspect, 1, 100000)
    //console.log(camera)

    controls = new THREE.OrbitControls(camera)
    controls.enableRotate = false
    camera.lookAt(0, 0, 0)
    
    this.load()
    this.loadUI()

    // 添加环境光
    let ambientLight = new THREE.AmbientLight(0x999999)
    scene.add(ambientLight)

    // 添加投射光
    var directionalLight = new THREE.DirectionalLight(0xffffff)//0xcccccc);
    directionalLight.position.set(0, 1200, 1000).normalize();
    scene.add(directionalLight);

    var renderScene = new THREE.RenderPass(scene, camera);
    //renderScene.clear = false
    var renderUIScene = new THREE.RenderPass(uiscene, uicamera);
    renderUIScene.clear = false

    //辉光特效
    bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(winWidth, winHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    Databus.bloomPass = bloomPass

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(renderUIScene);
    composer.addPass(bloomPass);
    console.log(composer)
    console.log(renderer)
    console.log(scene)

    //计时器
    clock = new Clock()
    wx.setPreferredFramesPerSecond(60)

    //点击获取物体
    raycaster = new THREE.Raycaster()
    Databus.raycaster = raycaster
    //console.log(raycaster)
    //this.initRaycaster()
    this.entry()
  }

  entry() {
    Databus.updateUI = ui.entryUI.bind(ui)
    Databus.touchstart = ui.entrytomenu.bind(ui)
    wx.onTouchStart(Databus.touchstart)
    this.loop()

  }

  loadUI() {
    this.texture = new THREE.CanvasTexture(ui.canvas)
    this.texture.needsUpdate = true
    this.texture.minFilter = THREE.LinearFilter
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true })
    this.geometry = new THREE.PlaneGeometry(winWidth, winHeight)
    this.uiplane = new THREE.Mesh(this.geometry, this.material)
    this.uiplane.position.set(0, 0, 0)
    uiscene.add(this.uiplane)
  }

  restart() {
    Databus.reset()
    // 清除上一局的动画
    this.waitforloop()
  }

  waitformusic() {
    if (preLoadDone && Databus.musicready) {
      window.cancelAnimationFrame(this.aniId)
      this.loadimd()
      Databus.musicload = false
      scene.add(Databus.loopmesh)
      //wx.onShow()
      wx.onHide(this.pause.bind(this))
      bloomPass.threshold = 0;
      bloomPass.strength = 2 //params.bloomStrength;
      bloomPass.radius = params.bloomRadius;
      window.setTimeout(this.music.playBgm.bind(this.music), 2000)
      clock.start()
      this.loop()
    } else {
      //this.render()
      this.texture.needsUpdate = true
      Databus.updateUI()
      composer.render()
      this.aniId = window.requestAnimationFrame(
        this.waitformusic.bind(this),
        canvas
      )
    }
  }

  load() {
    var temp = this.render.bind(this)
    let mtl = fs.readFileSync('/objs/scene.mtl', 'utf-8')
    let obj = fs.readFileSync('/objs/scene.obj', 'utf-8')
    THREE.packagefileloader(mtl, obj, function (object) {
      //console.log(object)
      Databus.goodmesh = object.children[3].clone()
      Databus.badmesh = object.children[4].clone()
      Databus.wonderfulmesh = object.children[6].clone()
      Databus.missmesh = object.children[5].clone()
      Databus.note1mesh = object.children[1].clone()
      Databus.note2mesh = object.children[2].clone()
      Databus.loopmesh = object.children[0].clone()
      Databus.loopmesh.scale.set(1.25, 1.25, 1.25)
      Databus.loopmesh.position.y = loopY
      //scene.add(databus.loopmesh)
      //temp()
      preLoadDone = true
    })
  }

  downloadmusic() {
    let that = this
    fs.access({
      path: `${wx.env.USER_DATA_PATH}/` + Databus.musicname + '.mp3',
      success () {
        that.music.setBgm(`${wx.env.USER_DATA_PATH}/` + Databus.musicname + '.mp3')
        Databus.musicready = true
      },
      fail(res) {
        wx.downloadFile({
          url: 'https://haurchefant-g.github.io/mp3/' + Databus.musicname + '.mp3', //音乐文件
          filePath: `${wx.env.USER_DATA_PATH}/` + Databus.musicname + '.mp3',
          success (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              that.music.setBgm(res.filePath)
              Databus.musicready = true
            } else {
              that.aniId = window.requestAnimationFrame(
                that.waitformusic.bind(that),
                canvas
                )
            }
          },
          fail () {
            that.aniId = window.requestAnimationFrame(
              that.waitformusic.bind(that),
              canvas
              )
          }
        })

      }
    })
  }

  //加载谱面文件
  loadimd() {
    var imd = fs.readFileSync('/bin/' + Databus.musicname + '_' + Databus.keynum + 'k_' + Databus.level + '.bin') //,'binary')
    Databus.shiftdegree = 180 / Databus.keynum

    imd = new DataView(imd)
    var index = 0
    Databus.musictime = imd.getInt32(index, true)
    index += 4
    var flickernum = imd.getInt32(index, true)
    Databus.flickernum = flickernum
    index += 4
    for (let i = 0; i < flickernum; ++i, index += 12) {
      Databus.BPMlist.push({
        'time': imd.getInt32(index, true), 
        'BPM': imd.getFloat64(index + 4, true)
      })
    }
    index += 2
    let notenum = imd.getInt32(index, true)
    Databus.notenum = notenum
    index += 4
    for (let i = 0; i < notenum; ++i, index += 11) {
      Databus.notelist.push({
        'type': imd.getInt16(index, true),
        'time': imd.getInt32(index + 2, true), 
        'key': imd.getInt8(index + 6, true),
        'parameter': imd.getInt32(index + 7, true)
      })
    }
    //console.log(imd)
    //console.log(databus.BPMlist)
    //console.log(databus.notelist)
  }


  flicker() {
    
  }

  playnotelist() {
    let nowtime = clock.getElapsedTime()
    //console.log(nowtime)
    let createtime
    while (Databus.notelist[0]) {
      createtime = Databus.notelist[0].time
      if (createtime <= nowtime) {
        //console.log(nowtime)
        this.noteadd(Databus.notelist.shift(), createtime - nowtime)
      } else {
        break
      }
    }
  }

  /*{
  'type': imd.getInt16(index, true),
    'time': imd.getInt32(index + 2, true),
      'key': imd.getInt8(index + 6, true),
        'parameter': imd.getInt32(index + 7, true)
}*/

  noteadd(data, delta = 0) {
    if (data.type == 0) {
      var noteobj
      var arc = Math.PI / 180 * ((data.key + 0.5) * Databus.shiftdegree + 180)
      var fallstartX = Math.cos(arc) * startRadius
      var fallstartZ = Math.sin(arc) * startRadius

      switch (data.type) {
        case 0: noteobj = Databus.note2mesh.clone()
          noteobj.position.set(fallstartX, fallstartY, fallstartZ)
          noteobj.update = NOTE.clicknotetUpdater(arc, fallstartY, fallstartY - loopY, startRadius, endRadius).bind(noteobj)
          break
      }
      noteobj.fade = NOTE.notetFadeUpdater().bind(noteobj)
      noteobj.status = 1
      noteobj.type = data.type
      noteobj.parameter = data.parameter
      Databus.notes.push(noteobj)
      if (delta) {
        noteobj.update(delta)
      }
      scene.add(noteobj)
    }
  }

  update(delta) {
    // 更新代码
    this.texture.needsUpdate = true
    Databus.updateUI()
    if (Databus.musicready && !Databus.gameover) {
      //console.log(this.rankinge)
      Databus.notemessage.forEach((message) => {
        message.update(camera.position)
      })
      Databus.notemessage = Databus.notemessage.filter((message) => {return !message.dead})
      Databus.notes.forEach((note) => {
        //console.log(note)
        switch(note.status) {
          case 1: note.update(delta)
          break
          case 2:
          break
          case 3: note.fade()
          break
        }
        //console.log(note.position)
      })
      //console.log(databus.notelist)
      Databus.notes = Databus.notes.filter((note) => { return (note.status !== 4) })
      this.playnotelist()
      //console.log(databus.notes)
    } else {
      //console.log('FFF')
    }
  }


  /**
   * canvas 重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    //renderer.clear();
    //if (preLoadDone) {
    composer.render()
      //renderer.render(scene, camera)
    //}
  }

  // 实现帧循环
  loop() {
    const delta = clock.getDelta()
    this.update(delta)
    this.render()
    if (Databus.musicload) {
      this.downloadmusic()
      this.aniId = window.requestAnimationFrame(
        this.waitformusic.bind(this),
        canvas
      )
    } else {
      this.aniId = window.requestAnimationFrame(
        this.loop.bind(this),
        canvas
        )
    }
  }

  pause() {
    window.cancelAnimationFrame(this.aniId)
    this.music.pauseBgm()
    let delta = clock.pause()
    Databus.updateUI = ui.pauseUI.bind(ui)
    this.update(delta)
    console.log('pause')
    //this.texture.needsUpdate = true
    //this.update(delta)
    //this.texture.needsUpdate = true
    this.render()

  }


  renderscoreUI() {

    //ui.scoreUI(100, databus.combo)
    //ui.entryUI()
    //sprite.needsUpdate = true
    this.uiplane.position.set(0,0,0)
    //this.uiplane.scale.set(0.5, 0.5, 1)
    console.log(this.uiplane)
    
    //composer.render()
    uiscene.add(this.uiplane)
    //composer.render()
    //renderer.render(scene, camera)
    //scene.remove(sprite)
    this.i = 1
    
    this.i = 1
  }

  loadsharedcanvas() {
    this.open = wx.getOpenDataContext()
    console.log(this.open)
    this.sharedCanvas = this.open.canvas
    console.log(this.sharedCanvas)
    var rankctx = this.sharedCanvas.getContext('2d')
    console.log(rankctx)
    rankctx.fillStyle = "#0000ff";
    rankctx.fillRect(200, 200, 850, 800);
    const { pixelRatio, windowHeight, windowWidth } = wx.getSystemInfoSync()
    //一定要在主域中设定宽高
    this.sharedCanvas.width = 1000;
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
    //scene.add(this.ranking)
    console.log(this.ranking)

    var img = new Image(100, 100)
    img.src = 'images/bg.png'
    //img.onload = this.drawImageActualSize(this.ranking);
    //ctx.drawImage(this.img, 10, 10);
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

  loadButton() {
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

      // 添加开始按钮文字的素材
      var color = new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color: color,
        side: THREE.DoubleSide
      });

      //按钮
      //添加开始按钮
      var fontGeometry = new THREE.TextBufferGeometry('Start', fontCfg);
      fontGeometry.computeBoundingBox();//绑定盒子模型
      fontGeometry.center();
      console.log(fontGeometry)
      Databus.starttext = new THREE.Mesh(fontGeometry, fontMaterial);
      //databus.starttext.up.set(0,0,0)
      //console.log(databus.starttext)
      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      //databus.starttext.rotation.y += Math.PI
      scene.add(Databus.starttext);


      var fontGeometry_help = new THREE.TextBufferGeometry('Help', fontCfg);
      fontGeometry_help.computeBoundingBox();//绑定盒子模型
      fontGeometry_help.center();
      console.log(fontGeometry_help)
      Databus.helptext = new THREE.Mesh(fontGeometry_help, fontMaterial);
      Databus.helptext.position.set(0, -30, 0)
      //databus.helptext.rotation.y += Math.PI
      //font.lookAt(camera.position)
      scene.add(Databus.helptext);


      var fontGeometry_back = new THREE.TextBufferGeometry('Back', fontCfg);
      fontGeometry_back.computeBoundingBox();//绑定盒子模型
      fontGeometry_back.center();
      console.log(fontGeometry_back)
      Databus.backtext = new THREE.Mesh(fontGeometry_back, fontMaterial);
      Databus.backtext.position.set(0, -30, 0)
      //databus.starttext.up.set(0,0,0)
      console.log(Databus.backtext)
      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      //databus.backtext.rotation.y += Math.PI
      //scene.add(databus.back);

      let fontCfg2 = {
        font: font,
        size: 40,
        height: 5,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 3,
        bevelSegments: 12
      };

      var fontGeometry_stop = new THREE.TextBufferGeometry('stop', fontCfg2);
      fontGeometry_stop.computeBoundingBox();//绑定盒子模型
      fontGeometry_stop.center();
      console.log(fontGeometry_stop)

      // 添加帮助按钮文字的素材
      var color = new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color: color,
        side: THREE.DoubleSide
      });
      Databus.stoptext = new THREE.Mesh(fontGeometry_stop, fontMaterial);
      Databus.stoptext.position.set(0, -30, 0)
      //databus.starttext.up.set(0,0,0)
      console.log(Databus.stoptext)

      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      //databus.stoptext.rotation.y += Math.PI
      //scene.add(databus.stoptext);

      //preLoadDone = true
    })
  }

    // //点击命中物体事件添加
    // initRaycaster() {
    //   //canvas.addEventListener('touchstart', (event) => {
    //   wx.onTouchStart((event) => {
    //     var pos = new THREE.Vector2();
    //     var intersects = []
    //     //寻找命中的note
    //     event.touches.forEach((touch) => {
    //       pos.x = (touch.clientX / winWidth) * 2 - 1;
    //       pos.y = - (touch.clientY / winHeight) * 2 + 1;
    //       raycaster.setFromCamera(pos, camera)
    //       intersects = intersects.concat(raycaster.intersectObjects(scene.children).map(e => e.object))
    //       /* //传入的databus.notes是要检测的是否点击到的物体的数组（必须为Mesh类的数组，不能为Group类的数组），要检测其他的物体，修改databus.notes即可
    //       intersects = intersects.concat(raycaster.intersectObjects([databus.starttext]).map(e => e.object));
    //       intersects = intersects.concat(raycaster.intersectObjects([databus.helptext]).map(e => e.object));
    //       intersects = intersects.concat(raycaster.intersectObjects([databus.stoptext]).map(e => e.object));
    //       intersects = intersects.concat(raycaster.intersectObjects([databus.backtext]).map(e => e.object)); */
    //     })
    //     //命中note去重
    //     let result = []
    //     let obj = {}
    //     for (let i of intersects) {
    //         if (!obj[i]) {
    //             result.push(i)
    //             obj[i] = 1
    //         }
    //       }
    //     console.log(result)
    //     result.forEach(note => {
    //       switch(note.status){
    //         case 1:
    //         NOTE.notejudge(note)
    //         if (note.type === 0) {
    //           note.status = 3
    //         } else {
    //           note.status = 2
    //         }
    //         break
    //         case 2:
    //         break
    //         default:
    //         break
    //       }})
    //     console.log(result)
    //     /* //start点击检测
    //     result.forEach(child => {
    //       if(child === databus.starttext) {
    //         scene.remove(databus.starttext)
    //         scene.remove(databus.helptext)
    //         this.load()
    //       }
    //     })
    //     //help点击检测
    //     result.forEach(child => {
    //       if(child === databus.helptext) {
    //         scene.remove(child)
    //         scene.remove(databus.starttext)
    //         scene.add(databus.backtext);
    //         //this.load()
    //       }
    //     })
    //     //stop点击检测
    //     result.forEach(child => {
    //       if(child === databus.stoptext) {
    //         scene.remove(child)
    //         preLoadDone=false;
    //         //this.load()
    //       }
    //     })
    //     //back点击检测
    //     result.forEach(child => {
    //       if(child === databus.backtext) {
    //         scene.add(camera)
    //         scene.remove(databus.backtext)
    //         scene.remove(child)
    //         scene.add(databus.starttext)
    //         scene.add(databus.helptext)
    //         //this.load()
    //       }
    //     }) */
    //   })
  
    // }
}


