/*
Game of Life v1.1
The game constructs a board with cells.
Most of the logic and state is encapsulated within each individual cell,
so that none of the state needs to be maintained globally.
*/

function createGameOfLifeAPI() {

  var cellSize = 15;
  var boardWidth = 600;
  var boardHeight = 600;
  var width = boardWidth / cellSize;
  var height = boardHeight / cellSize
  var gameOfLifeBoard = new Array();
  var universeLoopID = undefined;
  var generation = 0;


  $("#board").click(function(e) {
    //code from stackoverflow, to get the x and y co-ordinates of the click event relative to the wrapper
    var posX = $(this).position().left,
      posY = $(this).position().top;
    // console.log((e.pageX - posX) + ' , ' + (e.pageY - posY));
    var x = Math.floor((e.pageX - posX) / cellSize);
    var y = Math.floor((e.pageY - posY) / cellSize);
    // console.log(x + " , " + y)
    if (!universeLoopID) {
      gameOfLifeBoard[y][x].toggleState();
    }
  });


  function clearBoard() {
    gameOfLifeBoard = [];
    $("#board").empty();
    generation = 0;
  }

  //this function sets up the game by:
  //1. clearing the board
  //2. instantiating cells (using the new operator) and inserting them into the gameOfLifeBoard object (an array of arrays)
  function setupGame() {
    clearBoard();

    for (var y = 0; y < height; y++) {
      var gameOfLifeBoardRow = [];
      for (var x = 0; x < width; x++) {
        //console.log("Cell " + x + "," + y + " created.")
        var cell = new Cell(y, x);
        gameOfLifeBoardRow.push(cell);
        $("#board").append(cell.$cell);
      }
      gameOfLifeBoard.push(gameOfLifeBoardRow);
    }

  }

  //the Cell function represents a single cell.
  //x and y represent the co-ordinates for the cell number (0,0) is the top leftmost cell
  //currentState and futureState keep a record of the state of the cell; 0=dead, 1=live
  function Cell(y, x) {
    this.x = x;
    this.y = y;
    this.$cell = $("<div>", {
      id: "c" + x.toString() + "-" + y.toString(),
      class: "cell",
      height: cellSize,
      width: cellSize
    });
    //NOTE: create a getter and setter for states; implement protection so you can never set an invalid state
    this.currentState = 0;
    this.futureState = 0;

    //the birth function sets the currentState of a cell to 1, and fills in that square on the canvas with black
    this.birth = function() {
      this.currentState = 1;
      //context.fillRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize, cellSize);
      this.$cell.css("background-color", "#000");
    }

    //the kill function sets the currentState of a cell to 0, and clears that square on the canvas
    this.kill = function() {
      this.currentState = 0;
      //context.clearRect(x * cellSize + 0.5, y * cellSize + 0.5, cellSize, cellSize);
      this.$cell.css("background-color", "#fff");
    }

    this.toggleState = function() {
      if (this.currentState === 0) {
        this.birth();
        // console.log("birthed!");
      } else {
        // console.log("killed!");
        this.kill();
      }
    }

    //invoke this function to ask a cell for a list (an array) of its neighbors
    //each element of this array is an array with the x,y co-ordinates of the neighbor
    //a cell will always return an array of length 8, because the grid has been implemented as a toroidal grid
    this.getNeighbors = function() {
      var neighbors = [];

      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          if (!(i === x && j === y)) { //discarding the cell itself
            var a = i;
            var b = j;
            if (a === -1) {
              a = width - 1;
            };
            if (b === -1) {
              b = height - 1;
            };
            if (a === width) {
              a = 0
            };
            if (b === height) {
              b = 0
            };
            neighbors.push([a, b]);
          }
        }
      }
      return neighbors;
    }

    //asks a cell to tell us how many live neighbors it has, based on the currentState of its neighbors
    this.getLiveNeighborCount = function() {
      var neighbors = this.getNeighbors();
      var liveNeighborCount = 0;
      // console.log("Cell co-ordinates: " + x + "," + y);
      // console.log("Neighbors: ");
      // console.log(neighbors);
      for (var i = 0; i < neighbors.length; i++) {
        //I would want to eventually refactor this line. It references a global variable
        //and it isn't possible for me to test this behavior without creating the whole board
        if (gameOfLifeBoard[neighbors[i][1]][neighbors[i][0]].currentState === 1) {
          ++liveNeighborCount;
        }
      }
      return liveNeighborCount;
    }

    //asks a cell to set its future state by looking at how many live neighbors it has
    this.setFutureState = function() {
      var liveNeighborCount = this.getLiveNeighborCount();
      if (liveNeighborCount > 3 || liveNeighborCount < 2) {
        this.futureState = 0; //death by overcrowding or loneliness
      } else {
        if (liveNeighborCount === 3) {
          this.futureState = 1;
        } else { //count === 2
          //console.log(liveNeighborCount);
          this.futureState = this.currentState;
        }
      }
      return (this.futureState);
    }

    //updates the futureState of a cell to become equal to the currentState
    //CAUTION: this must be invoked only after all cells on the board have updated their futureState
    this.updateState = function() {
      if (this.currentState === this.futureState) {
        //console.log("No change!")
      } else {
        this.currentState = this.futureState;
        if (this.currentState === 0) {
          this.kill();
        } else {
          this.birth();
        }
      }
    }
  }


  //universeCounter is the global counter, implemented using a closure
  //for each incremembt of the global counter, the whole board changes state
  //change of state happens in two steps:
  //step 1: the first nested for loop asks each cell to set its future state
  //step 2: the second nested for loop asks each cell to update its state
  //Note that the universe counter is not aware of state - it expects cells to know how to take care of this


  function universeCounter() {
    //console.log("Universe Counter Started!");
    var count = generation;
    return function() {
      ++count;
      generation = count;
      $("#counter").text(generation.toString());

      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          //console.log("Count: " + count + " ");
          var fs = gameOfLifeBoard[y][x].setFutureState();
          //console.log("Future State of " + x + "," + y + ": " + fs);
        }
      }

      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          gameOfLifeBoard[y][x].updateState();
        }
      }
    }
  }

  function startGame() {
    if (!universeLoopID) {
        universeLoopID = setInterval(universeCounter(), 50);
        // console.log("Just invoked universe counter. Loop ID is " + universeLoopID);
    }
  }

  function stopGame() {
    // console.log("Just clicked on pause. Universe ID is " + universeLoopID);
    clearInterval(universeLoopID);
    universeLoopID = undefined;
  }

  function resetGame() {
    clearInterval(universeLoopID);
    setupGame();
    generation = 0;
    $("#counter").text("0");
    universeLoopID = undefined;
  }

  function randomizeInitialConditions() {

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
          gameOfLifeBoard[y][x].kill();
        }
      }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (Math.random() > 0.8) {
          //console.log(x + " , " + y);
          gameOfLifeBoard[y][x].birth();
        }
      }
    }
  }

  setupGame();

  //returns an object that serves as a client side API
  return {
    start: function() {
      startGame();
    },
    stop: function() {
      stopGame();
    },
    reset: function() {
      resetGame();
    },
    randomize: function() {
      randomizeInitialConditions();
    },
    //functions below are only exposed for testing
    createCell: function(y, x) {
      var cell = new Cell(y, x);
      return cell;
    },
    getGameOfLifeBoard: function() {
      return gameOfLifeBoard;
    }
  }

}
