import Databus    from '../databus'

const advanceTime = 2000
const Miss = 15
const Perfect =  10
const Good =  20

function notemessageUpdater() {
  var i = 0
  return function (cameraposition) {
    if (i < 18) {
      this.scale.x *= Math.pow(1.02, i)
      this.scale.y *= Math.pow(1.02, i)
      this.scale.z *= Math.pow(1.02, i)
    } else if (i > 80) {
      Databus.scene.remove(this)
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
    if((fallstartY - this.position.y - vertical) > Miss) {
      this.status = 3
      var judgemessage
      judgemessage = Databus.missmesh.clone()
      judgemessage.scale.set(0.05, 0.05, 0.05)
      judgemessage.position.x = this.position.x
      judgemessage.position.y = this.position.y
      judgemessage.position.z = this.position.z
      judgemessage.update = notemessageUpdater().bind(judgemessage)
      Databus.notemessage.push(judgemessage)
      Databus.scene.add(judgemessage)
      Databus.resetcombo()

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
      Databus.scene.remove(this)
    }
  } 
}

function notejudge(note) {
  var judgemessage
  if (Math.abs(note.position.y - Databus.loopY) < Perfect) {
    judgemessage = Databus.wonderfulmesh.clone()
    Databus.score += 50 + Databus.combo * 4
  } else if (Math.abs(note.position.y - Databus.loopY) < Good) {
    judgemessage = Databus.goodmesh.clone()
    Databus.score += 30 + Databus.combo * 2
  } else {
    judgemessage = Databus.badmesh.clone()
    Databus.score += 10 + Databus.combo
  }
  judgemessage.scale.set(0.05, 0.05, 0.05)
  judgemessage.position.x = note.position.x
  judgemessage.position.y = note.position.y
  judgemessage.position.z = note.position.z
  judgemessage.update = notemessageUpdater().bind(judgemessage)
  Databus.notemessage.push(judgemessage)
  Databus.scene.add(judgemessage)
  ++Databus.combo
}

exports.clicknotetUpdater = clicknotetUpdater
exports.notetFadeUpdater = notetFadeUpdater
exports.notejudge = notejudge
exports.advanceTime = advanceTime

