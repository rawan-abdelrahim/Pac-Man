# 🟡 Pac-Man Clone – JavaScript Canvas Game

Welcome to a custom-built **Pac-Man**-style game using pure **JavaScript** and the **HTML5 Canvas API**! 🎮

This game brings to life the retro experience of arcade gaming with a modern, clean design. It includes classic features like ghost movement, teleporting tunnels, food collection, and lives — all powered by collision detection and game loops.

## 🧠 Game Overview

- **Grid-based Movement**
  Players and ghosts move on a grid made from a character-based `tileMap`. Each tile is 32x32 pixels, and the board is dynamically sized based on this map.

- **Game Characters**
  - 🟡 **Pac-Man**: Controlled by the player via arrow keys or WASD.
  - 👻 **Ghosts**: Move in random directions and reset when colliding with walls.
  - 🍒 **Food Pellets**: Scattered across the board and increase your score when collected.

## 🧩 Core Features

- 🔄 Continuous game loop using `setTimeout` with `Update()`
- 🧱 Collision detection for walls, ghosts, and food
- ↕️ Direction queuing and validation (you can press a direction before a turn is available!)
- 🌐 Teleportation through left/right tunnel exits
- 💀 Ghost collision triggers life loss and game over logic


-----

## Table of Contents
* [Getting Started](#-getting-started)
* [Game Mechanics & Algorithms](#game-mechanics--algorithms)
  * [Collision Detection](#collision-detection)
  * [Movement and Wall Interaction](#movement-and-wall-interaction)
  * [Ghost AI (Simple Random Movement)](#ghost-ai-simple-random-movement)
  * [Game State Management](#game-state-management)
  * [Map Loading and Object Management](#map-loading-and-object-management)
* [Code Structure](#code-structure)
* [Future Enhancements](#future-enhancements)
* [Credits](#credits)
  
-----
## 🚀 Getting Started
Play the live Pac-Man game [here](https://rawan-abdelrahim.github.io/Pac-Man/)!
-----

## Game Mechanics & Algorithms

This Pac-Man game, while seemingly simple, employs several core algorithms and techniques to create an engaging experience.

### Collision Detection

The heart of many game interactions lies in collision detection. Here, a standard **Axis-Aligned Bounding Box (AABB) collision detection algorithm** is used.

**Algorithm: `collision(a, b)`**

This function checks if two rectangular `Block` objects, `a` and `b`, are overlapping. It returns `true` if they're colliding and `false` otherwise.

The condition for collision is:

$$(a.x < b.x + b.width) \land (a.x + a.width > b.x) \land (a.y < b.y + b.height) \land (a.y + a.height > b.y)$$

This means that `a`'s left edge is to the left of `b`'s right edge, `a`'s right edge is to the right of `b`'s left edge, `a`'s top edge is above `b`'s bottom edge, and `a`'s bottom edge is below `b`'s top edge. If all these conditions are met, the two rectangles are overlapping.

This algorithm is used extensively for:

  * Pac-Man colliding with walls.
  * Ghosts colliding with walls.
  * Pac-Man colliding with food.
  * Pac-Man colliding with ghosts.

### Movement and Wall Interaction

Both Pac-Man and the ghosts move based on a set velocity (`velocityX`, `velocityY`) determined by their current direction.

**Pac-Man's Movement:**

Pac-Man's movement incorporates a "**look-ahead**" mechanism for smoother control. When a new direction is input (`pacman.nextDirection` is set), a temporary `Block` object is created with this new direction. This temporary block is then "moved" forward one step to check for collisions with walls.

  * If the temporary block **does not collide** with a wall, Pac-Man's actual direction is updated, and his `nextDirection` is cleared. This allows Pac-Man to smoothly change direction as soon as the path is clear.
  * If the temporary block **does collide** with a wall, Pac-Man continues in his current direction until the `nextDirection` becomes clear.

After determining the valid direction, Pac-Man's `x` and `y` coordinates are updated based on his `velocityX` and `velocityY`. If a collision with a wall occurs after the actual move, Pac-Man's position is reverted to its previous state, effectively stopping him at the wall.

**Teleportation:**

The game implements a classic Pac-Man feature: **teleportation through side tunnels**. If Pac-Man moves off the left edge of the board, he reappears on the right edge, and vice-versa. This is achieved by checking if `pacman.x <= 0` or `pacman.x + pacman.width >= boardWidth` and adjusting his `x` coordinate accordingly.

### Ghost AI (Simple Random Movement)

The ghosts in this version employ a straightforward **random movement algorithm**.

**Algorithm:**

1.  **Initial Direction:** When the game loads or ghosts are reset, each ghost is assigned a random initial direction (Up, Down, Left, Right).
2.  **Wall Collision Reaction:** When a ghost collides with a wall (detected using the `collision` function), it immediately chooses a new random direction. This ensures ghosts don't get stuck.
3.  **Tunneling Behavior:** Similar to Pac-Man, ghosts can also traverse the side tunnels.
4.  **Special Case (Center Hallway):** There's a specific rule for ghosts when they are in the center horizontal hallway (`ghost.y == tileSize * 9`). In this particular row, if a ghost's current direction is not 'U' (Up) or 'D' (Down), it is forced to move 'U' (Up). This helps to direct ghosts out of their starting pen more consistently.

While simple, this random movement provides an unpredictable element to the ghost behavior, making the game challenging enough for a basic implementation. More advanced Pac-Man games would typically feature sophisticated pathfinding algorithms (like A\* search) and target-based AI for each ghost.

### Game State Management

The game manages various states to control the flow and display information:

  * **`score`**: Tracks the player's points.
  * **`lives`**: Tracks the number of remaining attempts.
  * **`gameOver`**: A boolean flag that becomes `true` when `lives` reaches 0, stopping the game loop and displaying "Game Over."
  * **`foods.size === 0`**: When all food pellets are eaten, the `loadMap()` and `resetPosition()` functions are called, effectively "resetting" the level and continuing the game.

### Map Loading and Object Management

The `tileMap` is a 2D array of characters that represents the game board's layout.

**Algorithm: `loadMap()`**

1.  **Clear Existing Objects:** Before loading, all existing `walls`, `foods`, and `ghosts` are cleared from their respective `Set` objects. This is crucial for resetting the level.
2.  **Iterate through `tileMap`:** The function iterates through each character in the `tileMap`.
3.  **Object Instantiation:** Based on the character, a new `Block` object is created and added to the appropriate `Set`:
      * `'X'`: Wall (`walls` Set)
      * `'b'`, `'r'`, `'o'`, `'p'`: Ghosts (`ghosts` Set) with their respective images.
      * `'P'`: Pac-Man (assigned to the `pacman` variable).
      * `' '`: Food pellet (`foods` Set). Note that food pellets are smaller and positioned centrally within a tile.

This method efficiently constructs the game world from a simple text representation, making it easy to design and modify levels. Using `Set` objects for `walls`, `foods`, and `ghosts` allows for efficient adding and deleting of elements, particularly useful when Pac-Man eats food.

-----

## Code Structure

The game's code is organized into several key functions and a `Block` class:

  * **Global Variables**: Define game dimensions, image references, and game state variables.
  * **`window.onload`**: The entry point of the game, initializing the canvas, loading images, loading the map, setting initial ghost directions, and starting the `Update` loop.
  * **`loadImages()`**: Loads all necessary image assets for Pac-Man, ghosts, and walls.
  * **`loadMap()`**: Parses the `tileMap` array and populates the `walls`, `foods`, and `ghosts` sets, and initializes `pacman`.
  * **`Update()`**: The main game loop, called repeatedly using `setTimeout`. It calls `move()` and `draw()`.
  * **`draw()`**: Clears the canvas and redraws all game elements (Pac-Man, ghosts, walls, food, score, and lives).
  * **`move()`**: Handles the movement logic for Pac-Man and ghosts, including collision detection, wall interactions, and food consumption.
  * **`movePacman(e)`**: Event listener for keyboard input, setting `pacman.nextDirection`.
  * **`collision(a, b)`**: Utility function to detect collisions between two `Block` objects.
  * **`resetPosition()`**: Resets Pac-Man and all ghosts to their starting positions and sets their velocities to zero.
  * **`getPacmanImage()`**: Returns the correct Pac-Man image based on his current direction.
  * **`class Block`**: A reusable class representing any game object (Pac-Man, ghosts, walls, food). It manages position, dimensions, image, and movement properties. It also includes methods for updating direction and resetting position.

-----

## Future Enhancements

  * **Improved Ghost AI:** Implement pathfinding (e.g., A\* algorithm) and more complex behaviors for ghosts (e.g., targeting Pac-Man, scattering, ambushing).
  * **Power Pellets:** Introduce power pellets that allow Pac-Man to eat ghosts temporarily.
  * **Levels:** Implement multiple distinct levels with increasing difficulty.
  * **Sound Effects:** Add classic Pac-Man sounds for eating food, dying, etc.
  * **Animations:** Animate Pac-Man's mouth opening and closing, and ghost movements.
  * **Game Start/Pause Screens:** Add proper menus for starting, pausing, and restarting the game.
  * **Scoreboard:** Implement a high score system.
  * **Flickering Foods:** Make the foods flicker for a more authentic feel.

-----

## Credits

  * **Game Logic & Code:** \[Your Name/Alias]
  * **Images:** Provided in the `./resources/` directory. (Attribution if specific sources are required).


