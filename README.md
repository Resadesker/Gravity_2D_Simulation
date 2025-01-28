# Gravity Simulation

This project is a canvas-based gravity simulation that models the motion of planets under the influence of gravity. A central star exerts gravitational force on the planets, which orbit and interact dynamically. Planets can collide with each other, split into smaller fragments, or be absorbed by the central star.

## Features

- **Gravity Dynamics**: Planets are attracted to the central star based on the inverse-square law.
- **Collisions**: Planets can collide and split into smaller fragments, mimicking physical interactions.
- **Boundaries**: Planets bounce off the canvas edges when they hit the boundary.
- **Central Star Interaction**: Planets are absorbed when they collide with the central star.
- **Recording**: The animation can be recorded as a `.webm` video file.

## Math Behind the Simulation

### Gravitational Force
The gravitational force acting on a planet is computed using the inverse-square law:

    F = G * (M / r^2)

Where:
- `G`: Gravitational constant (scaled to 250 for simulation purposes).
- `M`: Mass of the central star (proportional to its radius).
- `r`: Distance between the planet and the star.

The force is broken into `x` and `y` components based on the angle `theta` between the planet and the star:

    a_x = cos(theta) * (F / m)
    a_y = sin(theta) * (F / m)

### Velocity and Position Updates
The planet's velocity is updated based on the acceleration:

    v_x = v_x + a_x
    v_y = v_y + a_y

The new position of the planet is then calculated:

    x_new = x + v_x
    y_new = y + v_y

### Collision Detection
Two planets collide if the distance between their centers is less than the sum of their radii:

    distance < radius_1 + radius_2

Upon collision:
- The planets split into smaller fragments (if their size allows).
- A collision delay is applied to avoid repeated collisions in quick succession.

If a planet collides with the central star, it is absorbed and removed from the simulation.

### Bouncing Off Boundaries
When a planet hits the edge of the canvas, its velocity is inverted to simulate a bounce:

    v_x = -v_x (on horizontal boundaries)
    v_y = -v_y (on vertical boundaries)

### Energy Conservation (Approximation)
The simulation approximates conservation of energy and momentum during collisions and gravity interactions for visual appeal. Precise conservation is not enforced due to the simplified nature of the physics model.

## Code Overview

### Key Components
- **`Planet` Class**:
  Handles the properties and behavior of individual planets, including motion, drawing, and collision logic.

- **`drawStar` Function**:
  Draws the central star at the center of the canvas.

- **`splitPlanet` Function**:
  Splits a colliding planet into smaller fragments with randomized velocities.

- **Animation Loop**:
  The `animate` function continuously updates the positions of all planets, checks for collisions, and redraws the scene.

### Recording Feature
The animation can be recorded using the `MediaRecorder` API. Uncomment the `startRecording()` function to enable recording. The recording will automatically stop after a set duration.

## How to Run

That's simple! Clone this project and open `index.html`. It will run!

PS: Uncomment the commented code parts in the `script.js` if you want to save a screen recording of the animation.


