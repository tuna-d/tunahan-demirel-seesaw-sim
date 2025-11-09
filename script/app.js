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
const switchDiv = document.getElementById("switch")
const toggleDiv = document.getElementById("toggle")
const slider = document.getElementById("slider")
const weightList = document.getElementById("weightList")
const resetBtn = document.getElementById("resetBtn")

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

let randomWeightsOpt = true

colorPicker()

const stateKey = "seesawState"

function saveState() {
  const weightsArray = Array.from(bar.querySelectorAll(".weightDiv")).map(
    (node) => {
      const kg = parseInt(node.textContent, 10) || 0
      const leftPx = parseFloat(node.style.left) || 0
      const diameter = kg * 10
      const padding = 20
      const totalSize = diameter + padding * 2
      const position = leftPx + totalSize / 2
      const distDiff = Math.abs(position - midPoint)
      const side = position > midPoint ? "right" : "left"
      return {
        kg: kg,
        position,
        side,
        color: node.style.backgroundColor,
        distDiff,
      }
    }
  )

  const state = {
    leftKg,
    rightKg,
    leftTor,
    rightTor,
    angle,
    randomWeightsOpt,
    sliderValue: parseInt(slider.value, 10),
    weights: weightsArray,
  }

  localStorage.setItem(stateKey, JSON.stringify(state))
}

function loadState() {
  try {
    const data = localStorage.getItem(stateKey)
    if (!data) {
      randomKg()
      updateInfoLabels()
      setToggle(true)
      return
    }

    const parsedData = JSON.parse(data)

    leftKg = parsedData.leftKg
    rightKg = parsedData.rightKg
    leftTor = parsedData.leftTor
    rightTor = parsedData.rightTor
    angle = parsedData.angle
    randomWeightsOpt = parsedData.randomWeightsOpt
    slider.value = parsedData.sliderValue

    setToggle(randomWeightsOpt)
    slider.disabled = randomWeightsOpt

    Array.from(bar.querySelectorAll(".weightDiv")).forEach((node) =>
      node.remove()
    )
    weightList.innerHTML = ""

    parsedData.weights.forEach((weight) => {
      createWeight(weight.kg, weight.position, weight.color)
      createWeightListItem(weight.kg, weight.distDiff, weight.side)
    })

    applyTiltOnly(angle)
    updateInfoLabels()
    randomWeightsOpt ? randomKg() : sliderKg()
  } catch (e) {
    console.log(e)
    randomKg()
    updateInfoLabels()
    setToggle(true)
  }
}

const barBound = bar.getBoundingClientRect()
const midPoint = barBound.width / 2

bar.addEventListener("click", (e) => {
  const dist = e.offsetX
  const distDiff = Math.abs(dist - midPoint)

  if (dist > midPoint) {
    rightKg += kg
    rightTor += distDiff * kg
    createWeightListItem(kg, distDiff, "right")
  } else if (dist < midPoint) {
    leftKg += kg
    leftTor += distDiff * kg
    createWeightListItem(kg, distDiff, "left")
  }

  leftWeightInfo.innerHTML = `${leftKg} kg`
  rightWeightInfo.innerHTML = `${rightKg} kg`

  createWeight(kg, dist, color)

  const indPos = updateIndicatorPos(e)
  createIndicator(kg, indPos, color)

  tiltBar(rightTor, leftTor)
  randomWeightsOpt ? randomKg() : sliderKg()
  saveState()
})

simSec.addEventListener("mousemove", (e) => {
  const dist = updateIndicatorPos(e)
  createIndicator(kg, dist, color)
})

toggleDiv.addEventListener("click", (e) => {
  switchDiv.classList.toggle("switchOn")
  toggleDiv.classList.toggle("toggleOn")

  randomWeightsOpt = !randomWeightsOpt

  slider.disabled = randomWeightsOpt

  if (randomWeightsOpt) {
    randomKg()
  } else {
    sliderKg()
  }

  saveState()
})

slider.addEventListener("input", (e) => {
  if (!randomWeightsOpt) {
    sliderKg()
    saveState()
  }
})

resetBtn.addEventListener("click", reset)

function setKg(value) {
  kg = value
  nextWeightInfo.innerHTML = `${kg} kg`
}

function randomKg() {
  const randKg = Math.floor(Math.random() * 10 + 1)
  setKg(randKg)
}

function sliderKg() {
  const sliderKg = parseInt(slider.value, 10)
  setKg(sliderKg)
  nextWeightInfo.innerHTML = `${sliderKg} kg`
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

function createWeightListItem(kg, distance, side) {
  const listItem = document.createElement("li")
  listItem.innerHTML = `${kg} kg weight placed on the ${side} side, ${distance}px from the center.`
  weightList.appendChild(listItem)
}

function updateInfoLabels() {
  leftWeightInfo.innerHTML = `${leftKg} kg`
  rightWeightInfo.innerHTML = `${rightKg} kg`
  tiltAngleInfo.innerHTML = `${parseInt(angle, 10)}°`
}

function setToggle(isRandomOn) {
  if (isRandomOn) {
    toggleDiv.classList.add("toggleOn")
    switchDiv.classList.add("switchOn")
  } else {
    toggleDiv.classList.remove("toggleOn")
    switchDiv.classList.remove("switchOn")
  }
}

function applyTiltOnly(angle) {
  bar.style.transition = "none"
  bar.style.transform = `rotate(${angle}deg)`
}

function reset() {
  localStorage.removeItem(stateKey)

  leftKg = 0
  rightKg = 0
  leftTor = 0
  rightTor = 0
  angle = 0
  randomWeightsOpt = true

  Array.from(bar.querySelectorAll(".weightDiv")).forEach((node) =>
    node.remove()
  )
  weightList.innerHTML = ""

  indicatorSec.classList.add("hideIndicator")

  applyTiltOnly(0)
  setToggle(true)
  slider.disabled = true
  randomKg()
  updateInfoLabels()
}

loadState()
