/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */




/** game class to hold all variables and functions */

class Game{
  constructor(height, width, player1,player2){
    this.height = height;
    this.width=width;
    this.currPlayer=[player1,player2];
    this.board = [];
    this.gameEnd = false;
    this.makeBoard();
    this.makeHtmlBoard();
  }
  /** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x]) */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }

  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor= this.currPlayer[0].color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);

    const dropDistance =this.calculateDropDistance(y+1);
    let speed = dropDistance/280;
    piece.style.transform = `translate(0px,-${dropDistance}px)`;
    piece.style.transition=`transform ${speed}s ease-in`
  
    setTimeout(()=>{
    piece.style.transform = `translate(0px,0px)`
      piece.style.position='relative';
  },40)
    
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
    this.gameEnd = true;
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if(this.gameEnd) return;
    let {currPlayer, board, findSpotForCol, placeInTable,checkForWin,endGame} = this;
    
    let endGameHere= endGame.bind(this);
    // get x from ID of clicked cell
    const x = evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol.call(this, x);
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    board[y][x] = currPlayer[0].player;
    placeInTable.call(this,y,x);
    
    // check for win
    if (checkForWin.call(this)) {
      return endGameHere(`Player ${currPlayer[0].player} won!`);
    }
    
    // check for tie
    if (board.every(row => row.every(cell => cell))) {
      return endGameHere('Tie!');
    }
      
    // switch players
    [this.currPlayer[0], this.currPlayer[1]]=[this.currPlayer[1],this.currPlayer[0]];
    console.log(this.currPlayer);
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    let {currPlayer, board, height, width, findSpotForCol, placeInTable,checkForWin,endGame} = this;
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < height &&
          x >= 0 &&
          x < width &&
          board[y][x] === currPlayer[0].player
      );
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  calculateDropDistance(cell){
    const cellDist = 58.14;
    return cellDist*cell
  }
}

class Player{
  constructor(player, color){
    this.player=player;
    this.color=color;
  }
}



let game;

function gameBegin(){
  const startGame = document.querySelector('#game-start');
  startGame.addEventListener('click',(e)=>{
    e.preventDefault();
    let color1= document.querySelector('#p1-color');
    let color2= document.querySelector('#p2-color');
    let p1 = new Player(1,color1.value);
    let p2 = new Player(2,color2.value);
    delete game;
    setTimeout(()=>{
      let  game = new Game(6,7,p1,p2);},300);
  })
}
  gameBegin();





// makeBoard();
// makeHtmlBoard();
