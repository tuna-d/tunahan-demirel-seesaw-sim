const bar = document.getElementById("bar")
const simSec = document.getElementById("simSec")
const leftWeightInfo = document.getElementById("leftWeight")
const nextWeightInfo = document.getElementById("nextWeight")
const rightWeightInfo = document.getElementById("rightWeight")
const tiltAngleInfo = document.getElementById("tiltAngle")
const indicatorDiv = document.getElementById("indicatorDiv")
const indicatorSec = document.getElementById("indicatorSec")
const weightInd = document.getElementById("weightInd")
const lineInd = document.getElementById("lineInd")

const colors = [
  "#fbf8cc",
  "#fde4cf",
  "#ffcfd2",
  "#f1c0e8",
  "#cfbaf0",
  "#a3c4f3",
  "#90dbf4",
  "#8eecf5",
  "#98f5e1",
  "#b9fbc0",
]

let kg
let color
let leftKg = 0
let leftTor = 0

let rightKg = 0
let rightTor = 0

let angle = 0

randomKg()
colorPicker()

const barBound = bar.getBoundingClientRect()
const midPoint = barBound.width / 2

bar.addEventListener("click", (e) => {
  const dist = e.offsetX
  const distDiff = Math.abs(dist - midPoint)

  if (dist > midPoint) {
    rightKg += kg
    rightTor += distDiff * kg
  } else if (dist < midPoint) {
    leftKg += kg
    leftTor += distDiff * kg
  }

  leftWeightInfo.innerHTML = `${leftKg} kg`
  rightWeightInfo.innerHTML = `${rightKg} kg`

  createWeight(kg, dist, color)

  const indPos = updateIndicatorPos(e)
  createIndicator(kg, indPos, color)

  tiltBar(rightTor, leftTor)
  randomKg()
})

simSec.addEventListener("mousemove", (e) => {
  const dist = updateIndicatorPos(e)
  createIndicator(kg, dist, color)
})

function setKg(value) {
  kg = value
  nextWeightInfo.innerHTML = `${kg} kg`
}

function randomKg() {
  const randKg = Math.floor(Math.random() * 10 + 1)
  setKg(randKg)
}

function createWeight(weight, position, color) {
  const weightDiv = document.createElement("div")
  weightDiv.classList.add("weightDiv")

  weightDiv.innerHTML = `${weight} kg`

  const diameter = weight * 10
  const padding = 20 //px
  const totalSize = diameter + padding * 2

  weightDiv.style.height = `${diameter}px`
  weightDiv.style.width = `${diameter}px`
  weightDiv.style.backgroundColor = color

  weightDiv.style.left = `${position - totalSize / 2}px`

  bar.appendChild(weightDiv)
  colorPicker()
}

function tiltBar(rightTorque, leftTorque) {
  const torqueDiff = rightTorque - leftTorque
  angle = Math.max(-30, Math.min(30, torqueDiff / 10))

  const tiltDuration = 3000 - Math.min(1500, Math.abs(torqueDiff)) //ms

  bar.style.transform = `rotate(${angle}deg)`
  bar.style.transition = `transform ${tiltDuration}ms ease`

  tiltAngleInfo.innerHTML = `${parseInt(angle, 10)}°`
}

function createIndicator(weight, position, color) {
  indicatorSec.classList.remove("hideIndicator")
  weightInd.innerHTML = `${weight} kg`

  const diameter = weight * 10

  weightInd.style.width = `${diameter}px`
  weightInd.style.height = `${diameter}px`
  weightInd.style.backgroundColor = color
  lineInd.style.backgroundColor = color

  indicatorDiv.style.left = `${position}px`
}

function colorPicker() {
  const randNum = Math.floor(Math.random() * colors.length)
  color = colors[randNum]
}

function updateIndicatorPos(e) {
  const relativePos = e.clientX - barBound.left

  const indicatorPos = Math.max(0, Math.min(relativePos, barBound.width))
  return indicatorPos
}
