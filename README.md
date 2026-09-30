# Endless Runner
<a href="http://127.0.0.1:5500/javascript-project/index.html">click here to play</a>
A small browser game built with HTML, CSS, and vanilla JavaScript. Jump over obstacles and try to beat your high score.

## Run the game

Open `index.html` in a modern web browser. No packages or build tools are required.

## Controls

- Press **Space** or **↑** to start and jump.
- On a touch screen, tap the game area to start and jump.

## Scores

The current score appears while you play. Your best score is saved in the browser using `localStorage`, so it stays available when you reopen the game in the same browser. Scores are stored on your device and are not uploaded.

## Project files

- `index.html` contains the game page and canvas.
- `style.css` styles the page and adapts it for smaller screens.
- `script.js` handles the game loop, player movement, obstacles, collisions, and high score.

## Learning notes

The game uses `requestAnimationFrame` to animate, delta time to keep movement consistent, and a simple game state (`ready`, `playing`, or `over`). The JavaScript is kept in one file so the main game flow is easy to follow.
