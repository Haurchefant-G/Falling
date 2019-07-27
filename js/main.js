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
  bloomThreshold: 0.29,
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

    Databus.bgm = false

    renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas, alpha:true })
    console.log(canvas)

    //winWidth = (canvas.width > canvas.height) ? canvas.width : canvas.height
    //winHeight = (canvas.width > canvas.height) ? canvas.height : canvas.width
    winWidth = window.innerWidth
    winHeight = window.innerHeight
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    cameraAspect = winWidth / winHeight
    console.log(winWidth)
    console.log(winHeight)

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
    
    //this.load()
    this.remoteload()
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
    Databus.updateUI = ui.originUI.bind(ui)
    let that = this
    wx.onShow(function() {
      if (!Databus.musicready) {
        that.music.playTitleBgm()
      }
    })
    this.downloadbgm()
    this.loop()

  }

  downloadbgm() {
    let that = this
    fs.access({
      path: `${wx.env.USER_DATA_PATH}/` +'bgm.mp3',
      success() {
        that.music.setTitleBgm(`${wx.env.USER_DATA_PATH}/` + 'bgm.mp3')
        Databus.bgm = true
        that.music.playTitleBgm()
      },
      fail(res) {
        wx.downloadFile({
          url: 'https://haurchefant-g.github.io/mp3/' + 'bgm.mp3', //音乐文件
          filePath: `${wx.env.USER_DATA_PATH}/` + 'bgm.mp3',
          success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              that.music.setTitleBgm(res.filePath)
              Databus.bgm = true
              that.music.playTitleBgm()
            } else {
              that.aniId = window.requestAnimationFrame(
                that.waitformusic.bind(that),
                canvas
              )
            }
          },
          fail() {
            that.aniId = window.requestAnimationFrame(
              that.waitformusic.bind(that),
              canvas
            )
          }
        })
      }
    })
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
      Databus.onHide = this.pause.bind(this)
      wx.onHide(Databus.onHide)
      bloomPass.threshold = 0
      bloomPass.strength = 1.5
      bloomPass.radius = 0.5
      Databus.updateUI()
      this.music.pauseTitleBgm()
      this.music.resetBgm()
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
    let mtl = fs.readFileSync('objs/scene.mtl', 'utf-8')
    console.log(mtl.length)
    let obj = fs.readFileSync('objs/scene.obj', 'utf-8')
    console.log(obj.length)
    THREE.packagefileloader(mtl, obj, function (object) {
      console.log(object)
      Databus.goodmesh = object.children[3].clone()
      Databus.badmesh = object.children[4].clone()
      Databus.wonderfulmesh = object.children[6].clone()
      Databus.missmesh = object.children[5].clone()
      Databus.note1mesh = object.children[1].clone()
      Databus.note2mesh = object.children[2].clone()
      Databus.loopmesh = object.children[0].clone()
      Databus.loopmesh.scale.set(1.25, 1.25, 1.25)
      Databus.loopmesh.position.y = loopY
      preLoadDone = true
    })
  }

  remoteload() {
    THREE.loader('https://haurchefant-g.github.io/objs/scene.mtl', 'https://haurchefant-g.github.io/objs/scene.obj',function (object) {
      console.log(object)
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
    if(nowtime > Databus.musictime + 2000) {
      wx.offHide(Databus.onHide)
      Databus.gameover = true
      Databus.clear()
      Databus.updateUI = ui.toscoreUI.bind(ui)
    }
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
    wx.offHide(Databus.onHide)
    wx.offHide(Databus.onHide)
    this.music.pauseBgm()
    let delta = clock.pause()
    Databus.updateUI = ui.pauseUI.bind(ui)
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
    this.update(delta)
    this.aniId = window.requestAnimationFrame(
      this.render.bind(this),
      canvas
    )
  }

  restart() {
    window.cancelAnimationFrame(this.aniId)
    wx.offHide(Databus.onHide)
    this.music.resetBgm()
    this.loop()
  }

  continue() {
    window.cancelAnimationFrame(this.aniId)
    wx.onHide(Databus.onHide)
    bloomPass.threshold = 0
    bloomPass.strength = 1.5
    bloomPass.radius = 0.5
    clock.continue()
    this.music.playBgm()
    this.aniId = window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
      )
  }

  returnmenu() {
    window.cancelAnimationFrame(this.aniId)
    wx.offHide(Databus.onHide)
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius
    Databus.reset()
    this.music.playTitleBgm()
    this.aniId = window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
      )
  }
}


