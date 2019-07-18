import THREE      from '../libs/three_modified'

const advanceTime = 0.02
function clicknotetUpdater(arc, fallstartY, vertical, startRadius, endRadius) {
  var factor = Math.pow(startRadius - endRadius, 2) / vertical
  var sign = (startRadius > endRadius) ? -1 : 1
  return function(delta) {
    this.position.y -= vertical / advanceTime * delta
    var d = sign * Math.sqrt(factor * (fallstartY - this.position.y))
    this.position.x = (startRadius + d) * Math.cos(arc)
    this.position.z = (startRadius + d) * Math.sin(arc)
    this.rotation.y += 0.1
    if(Math.abs(fallstartY -this.position.y - vertical) < 1) {
    console.log(this.position)
    }
  } 
}


exports.clicknotetUpdater = clicknotetUpdater

