import databus    from '../databus'

const advanceTime = 2000
const Miss = 2
const Perfect =  5
const Good =  10
var frame = 0
var time = 0

function notemessageUpdater() {
  var i = 0
  return function (cameraposition) {
    //this.lookAt(cameraposition)
    if (i < 18) {
      this.scale.x *= Math.pow(1.02, i)
      this.scale.y *= Math.pow(1.02, i)
      this.scale.z *= Math.pow(1.02, i)
    } else if (i > 80) {
      databus.scene.remove(this)
      this.dead = true
    } else if (i > 50) {
      this.scale.x *= 1.0
      this.scale.y *= 0.75
    }
    ++i
  }
}


function clicknotetUpdater(arc, fallstartY, vertical, startRadius, endRadius) {
  var factor = Math.pow(startRadius - endRadius, 2) / vertical
  var sign = (startRadius > endRadius) ? -1 : 1
  return function(delta) {
    this.position.y -= vertical / advanceTime * delta
    var d = sign * Math.sqrt(factor * (fallstartY - this.position.y))
    this.position.x = (startRadius + d) * Math.cos(arc)
    this.position.z = (startRadius + d) * Math.sin(arc)
    this.rotation.y += 0.1
    //time += delta * 1000
    //console.log(delta*6000 + ', ' + time + ' , '+ frame)
    //frame++
    if((fallstartY - this.position.y - vertical) > Miss) {
      this.status = 3
      //console.log(this.position)
      var judgemessage
      judgemessage = databus.missmesh.clone()
      judgemessage.scale.set(0.05, 0.05, 0.05)
      //console.log(judgemessage.scale.x + ' ' + judgemessage.scale.y + ' ' + judgemessage.scale.z)
      judgemessage.position.x = this.position.x
      judgemessage.position.y = this.position.y
      judgemessage.position.z = this.position.z
      //judgemessage.lookAt(databus.camera.position)
      judgemessage.update = notemessageUpdater().bind(judgemessage)
      databus.notemessage.push(judgemessage)
      databus.scene.add(judgemessage)

    }
  } 
}


function notetFadeUpdater() {
  return function() {
    this.scale.x *= 0.92
    this.scale.y *= 0.92
    this.scale.z *= 0.92
    if (this.scale.x < 0.01) {
      this.status = 4
      databus.scene.remove(this)
    }
  } 
}

function notejudge(note) {
  var judgemessage
  if (Math.abs(note.position.y - databus.loopY) < Perfect) {
    judgemessage = databus.wonderfulmesh.clone()
    databus.score += 1000
  } else if (Math.abs(note.position.y - databus.loopY) < Good) {
    judgemessage = databus.goodmesh.clone()
    databus.score += 700
  } else {
    judgemessage = databus.badmesh.clone()
  }
  judgemessage.scale.set(0.05, 0.05, 0.05)
  //console.log(judgemessage.scale.x + ' ' + judgemessage.scale.y + ' ' + judgemessage.scale.z)
  judgemessage.position.x = note.position.x
  judgemessage.position.y = note.position.y
  judgemessage.position.z = note.position.z
  //judgemessage.lookAt(databus.camera.position)
  judgemessage.update = notemessageUpdater().bind(judgemessage)
  databus.notemessage.push(judgemessage)
  databus.scene.add(judgemessage)
}

exports.clicknotetUpdater = clicknotetUpdater
exports.notetFadeUpdater = notetFadeUpdater
exports.notejudge = notejudge
exports.advanceTime = advanceTime

