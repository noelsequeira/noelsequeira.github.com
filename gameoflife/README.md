proj1
=====

Game of Life

A) Design Challenges:

When building the game of life in the DOM, the key challenges that I encountered were:

1) Rendering the game using divs

Rendering the game using divs instead of the canvas created a few complications. I had assumed that it would be fairly
trivial to replace the canvas implementation with a CSS version. However, the design decision that I took (letting divs float
  inside a parent wrapper) meant that I could no longer iterate over the columns of the game of life board before the rows.

2) Creating a Toroidal Board:

One of the big limitations of my canvas-based implementation of the game of life was the fact that I treated the space outside the
board as "dead". So the cell [0,0] would only have 3 neighbors [0,1], [1,0], and [1,1]. However, in the DOM based implementation,
I made a conscious decision to

3) Setting up the initial conditions (INNOVATIVE FEATURE!):

I used a DOM event listener to check when a user clicks on a div. When a click is registered, I return the co-ordinates for that div,
and calculate which div the click occured inside of. I then toggle the state of that div (kill it if it is alive / bring it to life if
  it is dead). This is my innovative feature that lets you set up custom initial conditions.

Continuing from my previous canvas-based implementation, I also used a function to set up a random initial state each time the game is reloaded.
This function computes a random number for each cell, and either gives “birth” to a cell or “kills” it based on whether that random number is above a threshold.
Tweaking the threshold enables me to influence the number of live cells that are present in the initial state.

B) Help Wanted:

I implemented unit tests to test some of the critical behaviors of cells. However, given the way I had designed the game, my global
function only returned an "API" object with essential functions, thereby encapsulating all other functionality. This resulted in
challenges while testing the code - functions that I wanted to access were now "private", and I had to expose them through my
API object - something that I felt uncomfortable doing. Is there a way around this?
