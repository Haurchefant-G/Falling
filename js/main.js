//import Player     from './player/index'
//import Enemy      from './npc/enemy'
//import BackGround from './runtime/background'
//import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import databus    from './databus'
import THREE      from './libs/three_modified'

import ObjsURL    from '../objs/url'
import NOTE       from './note/note'
import Clock       from './base/clock'

//import { EffectComposer } from './libs/EffectComposer'
//import { RenderPass } from './libs/RenderPass'
//import { UnrealBloomPass } from './libs/UnrealBloomPass'


require('./libs/weapp-adapter.js')

let ctx = canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true })
//let ctx   = canvas.getContext('2d')
console.log(canvas)

let FileSystemManager = wx.getFileSystemManager()

let renderer
console.log(wx.env.USER_DATA_PATH)
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
    "track": [{ "degree": 220, "delay": 0 }]
  }
}


  
let composer
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

var params = {
  exposure: 0.8,
  bloomStrength: 2,
  bloomThreshold: 0,
  bloomRadius: 1
};

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0
    scene = new THREE.Scene()
    databus.scene = scene

    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas, alpha:true })

    winWidth = canvas.width
    console.log(canvas)
    console.log(winWidth)
    console.log(canvas.width)
    winHeight = canvas.height
    cameraAspect = winWidth / winHeight
    console.log(renderer)

    loopY = Math.round(-120 / cameraAspect * 0.6)
    fallstartY = Math.round(120 / cameraAspect * 3)
    startRadius = 180
    endRadius = 100

    databus.loopY = loopY
    
    
    //renderer.setSize(winWidth, winHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.ReinhardToneMapping
    //THREE.NoToneMapping
    //THREE.LinearToneMapping
    //THREE.ReinhardToneMapping
    //THREE.Uncharted2ToneMapping
    //THREE.CineonToneMapping

    console.log("屏幕尺寸: " + winWidth + " x " + winHeight)

    //this.load()
	  databus.camera = new THREE.OrthographicCamera(-120, 120, 120 / cameraAspect, -120 / cameraAspect,1,100000)
    databus.camera.position.set(0, 120 / cameraAspect * 0.5, 160)
    //camera.position.set(0, 0, -160)
	  //databus.camera = new THREE.PerspectiveCamera(75, cameraAspect, 1, 100000)
    //console.log(databus.camera)
    //databus.camera.position.set(0, 0,170)// 120 / cameraAspect * 1, 170)
    console.log(databus.camera.position)
    controls = new THREE.OrbitControls(databus.camera)
    controls.enableRotate = false
    databus.camera.lookAt(0, 0, 0)
    scene.add(databus.camera)
    //console.log(databus.camera)
    this.load()
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
      var color= new THREE.Color(0x006699);
      var fontMaterial = new THREE.MeshBasicMaterial({
        flatShading: THREE.FlatShading,
        transparent: true,
        opacity: 0.6,
        color:color,
        side:THREE.DoubleSide
      });

      //按钮
      //添加开始按钮
      var fontGeometry = new THREE.TextBufferGeometry('Start', fontCfg);
      fontGeometry.computeBoundingBox();//绑定盒子模型
      fontGeometry.center();
      console.log(fontGeometry)
      databus.starttext = new THREE.Mesh(fontGeometry, fontMaterial);
      //databus.starttext.up.set(0,0,0)
      //console.log(databus.starttext)
      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      databus.starttext.rotation.y += Math.PI
      scene.add(databus.starttext);


      var fontGeometry_help = new THREE.TextBufferGeometry('Help', fontCfg);
      fontGeometry_help.computeBoundingBox();//绑定盒子模型
      fontGeometry_help.center();
      console.log(fontGeometry_help)
      databus.helptext = new THREE.Mesh(fontGeometry_help, fontMaterial);
      databus.helptext.position.set(0,-30,0)
      databus.helptext.rotation.y += Math.PI
      //font.lookAt(camera.position)
      scene.add(databus.helptext);


      var fontGeometry_back = new THREE.TextBufferGeometry('Back', fontCfg);
      fontGeometry_back.computeBoundingBox();//绑定盒子模型
      fontGeometry_back.center();
      console.log(fontGeometry_back)
      databus.backtext = new THREE.Mesh(fontGeometry_back, fontMaterial);
      databus.backtext.position.set(0,-30,0)
      //databus.starttext.up.set(0,0,0)
      console.log(databus.backtext)
      // 计算出整个模型宽度的一半, 不然模型就会绕着x = 0,中心旋转
      databus.backtext.rotation.y += Math.PI
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
      //scene.add(databus.stoptext);
      
      preLoadDone = true
    })
    //help
    //字体加载


    // 添加环境光
    let ambientLight = new THREE.AmbientLight(0x999999)
    scene.add(ambientLight)

    // 添加投射光
    var directionalLight = new THREE.DirectionalLight(0xcccccc);
    directionalLight.position.set(0, 1200, 1000).normalize();
    scene.add(directionalLight);

    var renderScene = new THREE.RenderPass(scene, databus.camera);

    //console.log(databus.camera)
    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(winWidth, winHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    console.log(scene)

    //计时器
    clock = new Clock()
    wx.setPreferredFramesPerSecond(60)

    //点击获取物体
    raycaster = new THREE.Raycaster()
    console.log(raycaster)
    this.initRaycaster()

    //
    this.music = new Music()
    this.restart()
  }

  restart() {
    databus.reset()
    // 清除上一局的动画
    this.waitforloop()
  }

  waitforloop() {
    if (preLoadDone) {
      window.cancelAnimationFrame(this.aniId)
      //this.music.playBgm()
      this.loadimd()
      //this.noteadd(note1.data)
      //this.oldTime = Date.now()
      //window.setTimeout(clock.start.bind(clock), 2000)
      window.setTimeout(this.music.playBgm.bind(this.music), 2000)
      //this.music.playBgm()
      clock.start()
      this.loop()
    } else {
      this.aniId = window.requestAnimationFrame(
        this.waitforloop.bind(this),
        canvas
      )
    }
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
        raycaster.setFromCamera(pos, databus.camera)
        intersects = intersects.concat(raycaster.intersectObjects([databus.notes]).map(e => e.object))
        /* //传入的databus.notes是要检测的是否点击到的物体的数组（必须为Mesh类的数组，不能为Group类的数组），要检测其他的物体，修改databus.notes即可
        intersects = intersects.concat(raycaster.intersectObjects([databus.starttext]).map(e => e.object));
        intersects = intersects.concat(raycaster.intersectObjects([databus.helptext]).map(e => e.object));
        intersects = intersects.concat(raycaster.intersectObjects([databus.stoptext]).map(e => e.object));
        intersects = intersects.concat(raycaster.intersectObjects([databus.backtext]).map(e => e.object)); */
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
      /* //start点击检测
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
          scene.remove(child)
          scene.add(databus.starttext)
          scene.add(databus.helptext)
          //this.load()
        }
      }) */
    })

  }

  load() {
    THREE.loader('https://haurchefant-g.github.io/objs/scene.mtl', 'https://haurchefant-g.github.io/objs/scene.obj', function (object) {
      databus.goodmesh = object.children[3]
      databus.badmesh = object.children[4]
      databus.wonderfulmesh = object.children[6]
      databus.missmesh = object.children[5]
      databus.note1mesh = object.children[1]
      databus.note2mesh = object.children[2]
      databus.loopmesh = object.children[0]
      databus.loopmesh.scale.set(1.25, 1.25, 1.25)
      databus.loopmesh.position.y = loopY
      scene.add(databus.loopmesh)
      console.log(object)
      console.log(databus)
      preLoadDone = true
    })
  }

  //加载谱面文件
  loadimd() {
    var imd = FileSystemManager.readFileSync('/bin/standalonebeatmasta_4k_hd.bin')//,'binary')
    databus.keynum = 4
    databus.shiftdegree = 180 / databus.keynum

    imd = new DataView(imd)
    var index = 0
    databus.musictime = imd.getInt32(index, true)
    index += 4
    var flickernum = imd.getInt32(index, true)
    databus.flickernum = flickernum
    index += 4
    for (let i = 0; i < flickernum; ++i, index += 12) {
      databus.BPMlist.push({
        'time': imd.getInt32(index, true), 
        'BPM': imd.getFloat64(index + 4, true)
      })
    }
    index += 2
    let notenum = imd.getInt32(index, true)
    databus.notenum = notenum
    index += 4
    for (let i = 0; i < notenum; ++i, index += 11) {
      databus.notelist.push({
        'type': imd.getInt16(index, true),
        'time': imd.getInt32(index + 2, true), 
        'key': imd.getInt8(index + 6, true),
        'parameter': imd.getInt32(index + 7, true)
      })
    }
    console.log(imd)
    console.log(databus.BPMlist)
    console.log(databus.notelist)
    console.log('123')
  }


  flicker() {
    
  }

  playnotelist() {
    let nowtime = clock.getElapsedTime()
    //console.log(nowtime)
    let createtime
    while (databus.notelist[0]) {
      createtime = databus.notelist[0].time
      if (createtime <= nowtime) {
        console.log(nowtime)
        this.noteadd(databus.notelist.shift(), createtime - nowtime)
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
      var arc = Math.PI / 180 * ((data.key + 0.5) * databus.shiftdegree + 180)
      var fallstartX = Math.cos(arc) * startRadius
      var fallstartZ = Math.sin(arc) * startRadius

      switch (data.type) {
        case 0: noteobj = databus.note2mesh.clone()
          noteobj.position.set(fallstartX, fallstartY, fallstartZ)
          noteobj.update = NOTE.clicknotetUpdater(arc, fallstartY, fallstartY - loopY, startRadius, endRadius).bind(noteobj)
          break
      }
      noteobj.fade = NOTE.notetFadeUpdater().bind(noteobj)
      noteobj.status = 1
      noteobj.type = data.type
      noteobj.parameter = data.parameter
      databus.notes.push(noteobj)
      if (delta) {
        noteobj.update(delta)
      }
      scene.add(noteobj)
    }
  }

  update() {
    // 更新代码
    if (preLoadDone) {
      const delta = clock.getDelta()
      //databus.starttext.lookAt(camera.position)
      //console.log(databus.starttext.up)
      //console.log(delta)
      databus.notemessage.forEach((message) => {
        //console.log(databus.camera)
        //console.log(message.scale.x + ' ' + message.scale.y + ' ' + message.scale.z)
        //console.log(message.position)
        message.update(databus.camera.position)
      })
      databus.notemessage = databus.notemessage.filter((message) => {return !message.dead})
      databus.notes.forEach((note) => {
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
      databus.notes = databus.notes.filter((note) => { return (note.status !== 4) })
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
    if (preLoadDone) {
      composer.render()
      //renderer.render(scene, camera)
    }
  }

  // 实现帧循环
  loop() {
    //if (databus.frame % 300 === 150) {
      //this.noteadd(note1.data)
      //console.log(Date.now())
    //}
    //++databus.frame
    //console.log(databus.frame)
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
