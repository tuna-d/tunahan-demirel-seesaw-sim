const bar = document.getElementById("bar")
const simSec = document.getElementById("simSec")

let kg

randomKg()

bar.addEventListener("click", (e) => {
  const bound = bar.getBoundingClientRect()
  const dist = e.clientX - bound.left
  randomKg()
  createWeight(kg, dist)
})

function setKg(value) {
  kg = value
}

function randomKg() {
  const randKg = Math.floor(Math.random() * 10 + 1)
  setKg(randKg)
}

function createWeight(weight, position) {
  const weightDiv = document.createElement("div")
  weightDiv.classList.add("weightDiv")

  weightDiv.innerHTML = `${weight} kg`

  const diameter = weight * 10
  const padding = 20 //px
  const totalSize = diameter + padding * 2

  weightDiv.style.height = `${diameter}px`
  weightDiv.style.width = `${diameter}px`

  weightDiv.style.left = `${position - totalSize / 2}px`

  bar.appendChild(weightDiv)
}
