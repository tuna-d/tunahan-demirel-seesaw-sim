# Seesaw Simulator

A simple **physics-based seesaw simulation** built with **pure JavaScript, HTML, and CSS**.
Drop weights directly onto the plank and watch the seesaw tilt based on real torque logic — no frameworks, just clean DOM and math.

## 🧠 Thought Process & Design

The goal was to replicate the physical behavior of a real seesaw in a browser environment.

Each click adds a weight (1–10 kg) on the plank.
The program calculates torque on both sides —
`torque = weight × distance from pivot` —
and tilts the seesaw smoothly toward the heavier side, capped between **–30° and +30°**.

The structure follows a clean separation of concerns:

- **HTML:** Defines sections for information, simulation, and controls
- **CSS:** Provides a playful, clean visual style inspired by playground colors
- **JavaScript:** Manages torque logic, animations, and state persistence

All states (weights, torque values, toggle status) are stored in `localStorage` to preserve progress even after refresh.

## ⚙️ Core Features

✅ **Interactive physics** – click to drop weights and tilt the seesaw
✅ **Random or fixed weights** – toggle random mode or set a specific weight with the slider
✅ **Live UI updates** – shows left/right total weights, next weight, and current tilt angle
✅ **Persistent state** – automatically saves data using `localStorage`
✅ **Smooth tilt animation** – transition timing depends on torque difference
✅ **Reset button** – clears all weights and resets tilt

## ⚖️ Trade-offs & Limitations

One main trade-off was ensuring that **only the plank (bar)** is clickable, not the background.
This required precise event targeting and careful use of offset coordinates.
It keeps the simulation realistic but slightly limits flexibility for future layout changes.

The torque model is intentionally simplified — it provides visually convincing motion but does not use full physical integration or damping.

## 🤖 AI Assistance

AI tools (ChatGPT) were used only for **README file**.
All logic, structure, and style decisions were written manually and are fully understood.

## 🚀 How to Run

1. Clone this repo:

   ```bash
   git clone https://github.com/tuna-d/tunahan-demirel-seesaw-sim.git
   ```

2. Open the folder and run `index.html` in your browser.
3. Click on the **plank** to drop weights and watch the tilt change in real time.

## 🪄 Author

Built with care by **Tunahan Demirel**

💻 Front-End Developer
