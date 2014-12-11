test("testing cell creation", function() {
  var cell = createGameOfLifeAPI().createCell(3, 4);
  equal(cell.x, 4, "x co-ordinate");
  equal(cell.y, 3, "y co-ordinate");
  equal(cell.currentState, 0, "initial current state");
  equal(cell.futureState, 0, "initital future state");
});

test("testing cell birth, killing, state toggling", function() {
  var cell = createGameOfLifeAPI().createCell(3, 4);
  cell.birth();
  equal(cell.currentState, 1, "cell's current state post-birth is live");

  var cell = createGameOfLifeAPI().createCell(3, 4);
  cell.kill();
  equal(cell.currentState, 0, "cell's current state post-killing is dead");

	var cell = createGameOfLifeAPI().createCell(3, 4);
	cell.currentState = 1;
	cell.toggleState();
	equal(cell.currentState, 0, "dead cell becomes live on toggling");
	cell.currentState = 0;
	cell.toggleState();
	equal(cell.currentState, 1, "live cell becomes dead on toggling");
});

test("testing get neighbors", function() {
	var cell = createGameOfLifeAPI().createCell(3, 4);
	equal(cell.getNeighbors().length, 8, "a cell always has 8 neighbors");
	var cell = createGameOfLifeAPI().createCell(0, 0);
	equal(cell.getNeighbors().length, 8, "even a cell on the edge of the board always has 8 neighbors");
});

test("testing if future state gets set properly", function() {
	var api = createGameOfLifeAPI();
	var board = api.getGameOfLifeBoard();
	var cell = board[10][10];

	board[10][9].birth();
	board[10][11].birth();
	board[9][10].birth();

	equal(cell.getLiveNeighborCount(), 3, "cell should return the right number of live neighbors (3)");

	cell.setFutureState();
	equal(cell.futureState, 1, "cell should be born (reproduction)");

	cell.currentState = 1;
	cell.setFutureState();
	equal(cell.futureState, 1, "live cell should stay alive");

	board[9][10].kill();
	equal(cell.getLiveNeighborCount(), 2, "cell should return the right number of live neighbors (2)");
	cell.currentState = 1;
	cell.setFutureState();
	equal(cell.futureState, 1, "live cell should stay alive");

	board[9][10].birth();
	board[11][10].birth();
	equal(cell.getLiveNeighborCount(), 4, "cell should return the right number of live neighbors (4)");
	cell.currentState = 1;
	cell.setFutureState();
	equal(cell.futureState, 0, "live cell should die (overcrowding)");

	board[9][10].kill();
	board[10][9].kill();
	board[11][10].kill();
	equal(cell.getLiveNeighborCount(), 1, "cell should return the right number of live neighbors (1)");
	cell.currentState = 1;
	cell.setFutureState();
	equal(cell.futureState, 0, "live cell should die (loneliness)");

});
