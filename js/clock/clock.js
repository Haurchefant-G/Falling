export default class Clock {
  constructor (autoStart) {
    this.autoStart = (autoStart !== undefined) ? autoStart : true
    this.startTime = -1
    this.oldTime = -1
    this.elapsedTime = -1
    this.running = false
  }

  start () {
    this.startTime = Date.now()
    this.oldTime = this.startTime
    this.elapsedTime = 0
    this.running = true
  }

  stop () {
    this.getElapsedTime()
    this.running = false
    this.autoStart = false
  }

  pause () {
    var diff = this.getDelta()
    this.running = false
    this.autoStart = false
    return diff
  }

  continue () {
    this.running = true
    this.autoStart = true
    this.oldTime = Date.now()
  }

  getElapsedTime () {
    var diff = 0
    if (this.running) {
      var newTime = Date.now()
      diff = (newTime - this.oldTime)
    }
    return this.elapsedTime + diff
  }

  getDelta () {
    var diff = 0
    if (!this.running) {
      return 0
    }

    if (this.running) {
      var newTime = Date.now()
      diff = (newTime - this.oldTime)
      this.oldTime = newTime
      this.elapsedTime += diff
    }
    return diff
  }
}
