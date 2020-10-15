//const numWords = require('num-words');

const numWords = {0:'zero', 1:'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six',
					7:'seven', 8:'eight', 9:'nine'}

class tictactoe {
  constructor(size, player) {
    this.size = size;
    this.turn = 1;
    this.used = 0;
    this.board = new Array(size);

    for (var i = 0; i < size; i++) {
	  this.board[i] = new Array(size);
	}

	for(let row = 0; row<this.size; row++){
  		for(let col = 0; col < this.size; col++){
  			this.board[row][col] = 0;
  		}
  	}
  }
  print_board() {
  	let board_str = ":black_large_square:";
  	for(let row = -1; row<this.size; row++){
  		for(let col = -1; col < this.size; col++){
  			if(row == -1 && col > -1){
  					board_str += `:${numWords[col]}:`;
  			}
  			if(col == -1 && row > -1){
  					board_str += `:${numWords[row]}:`;
  			}
  			else if(row > -1 && col > -1){

	  			if(this.board[row][col]==0){
	  				board_str += ":white_square_button:"; 
	  			}
	  			else if (this.board[row][col]==1){
	  				board_str += ":regional_indicator_x:"; 
	  			}
	  			else if (this.board[row][col]==2){
	  				board_str += ":regional_indicator_o:"; 
	  			}
  			}

  			
  		}
  		
  		board_str += "\n";
  	}
    return board_str;
  }

  currentTurn() {
  	return this.turn;
	}

  makeMove(x, y) {
		if(this.checkPosition(x, y) == 0 ) {
			this.board[x][y] = this.turn;
			this.used++;
			this.updateTurn();
			return true;
		}
		return false;
	}



	gameStatus() { // 0 with no winners
		
		for(let r =0; r < this.size; r++) {
			  let row_win;   let col_win; 
			  let diagLeft_win;   let diagRight_win;
			row_win = col_win = diagLeft_win = diagRight_win = true;
			
			let row_current = this.board[r][0]; 
			let col_current = this.board[0][r];
			let diagLeft_current = row_current;
			let diagRight_current = col_current;
			
			for (let c = 0; c < this.size; c++) {
				
				row_win = row_win && row_current != 0 && (row_current == this.board[r][c]);
				col_win = col_win && col_current != 0 && (col_current == this.board[c][r]);
				diagLeft_win = diagLeft_win && diagLeft_current != 0 && (diagLeft_current == this.board[c][c]);
				diagRight_win = diagRight_win && diagRight_current != 0 && (diagRight_current == this.board[this.size-c-1][c]);
				
				row_current = this.board[r][c];
				col_current = this.board[c][r];
				diagLeft_current = this.board[c][c];
				diagRight_current = this.board[this.size-c-1][c];
			}
			if(row_win) {
				return row_current; // returns player number of winner if won in row
			}
			else if(col_win){
				return col_current; // returns player number of winner if won in col
			}
			else if(diagLeft_win) {
				return diagLeft_current;
			}
			else if(diagRight_win) {
				return diagRight_current;
			}
			
		}
		
		if(this.used == this.size * this.size) { // if all the spaces have been filled, thus, a tie
			return -1;
		}
		
		return 0; // if no winners
	}

	gameOver() {
		return gameStatus() != 0;
	}

  checkPosition(x, y) {
		return (x > -1 && y > -1 && x  < this.size && y < this.size) ? this.board[x][y] : -1;
	}

	updateTurn() {
		this.turn = this.turn == 1? 2: 1; // update the turn on every successful move
	}

	setTurn(player) {
		this.turn = player;
	}

}

module.exports = tictactoe;