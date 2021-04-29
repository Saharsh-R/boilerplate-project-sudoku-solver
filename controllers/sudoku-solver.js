var solveSudoku = function(board) {
  let rows = []
  let cols = []
  let tris = []
  for (let i = 0; i < 9; i ++){
      rows.push(new Set())
      cols.push(new Set())
      tris.push(new Set())
  }
  var getTri = (row, col) => {
      let r = Math.floor(row / 3)
      let c = Math.floor(col / 3)
      return r * 3 + c
  }
  let visit = []
  for (let r = 0; r < 9 ; r ++){
      for (let c = 0; c < 9; c ++){
          if (board[r][c] == '.'){
              visit.push([r, c])
          } else {
              rows[r].add(board[r][c])
              cols[c].add(board[r][c])
              tris[getTri(r, c)].add(board[r][c])
          }
      }
  }
  var dfs = () => {
      if (visit.length == 0){
          return true
      }
      let [r, c] = visit.pop()
      let allDigit = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      for (let i = 0; i < 9; i ++){
          let x = allDigit[i]
          if (!rows[r].has(x) && !cols[c].has(x) && !tris[getTri(r, c)].has(x)) {
              board[r][c] = x
              rows[r].add(x)
              cols[c].add(x)
              tris[getTri(r, c)].add(x)
              if (dfs()){
                  return true
              }
              board[r][c] = '.'
              rows[r].delete(x)
              cols[c].delete(x)
              tris[getTri(r, c)].delete(x)
          }
      }
      visit.push([r, c])
      return false
  }
  dfs()
};

class SudokuSolver {
  constructor(){
    this.digits = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  }

  validate(puzzleString) {
    if ( puzzleString.length != 81){
      return false
    }
    for (let c of puzzleString){
      if (!( c == '.' || this.digits.has(c))){
        return false
      }
    }
    return true
  }

  getIndex(row, col){
    return row * 9 + col
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let i = row * 9; i < row * 9 + 9; i ++){
      let c = puzzleString[i]
      if (c != '.' && this.getIndex(row, column) != i) {
        if (value == c){
          return false
        }
      }
    }
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i ++){
      let index = column + i * 9
      let c = puzzleString[index]
      if (c != '.' && this.getIndex(row, column) != index) {
        if (value == c){
          return false
        }
      }
    }
    return true
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let r = Math.floor(row / 3)
    let c = Math.floor(col / 3)
    for (let i = 0; i < 3; i ++){
      for (let j = 0; j < 3; j ++){
        let index = (r * 3 + i ) * 9  + c * 3 + j
        let char = puzzleString[index]
        if (char != '.' && this.getIndex(row, col) != index){
          if (value == char){
            return false
          }
        }
      }
    }
    return true
  }
  


  solve(puzzleString) {
    let board = []
    for (let i = 0; i < 9; i ++){
      let row = []
      for (let j = 0; j < 9; j ++){
        row.push(puzzleString[i * 9 + j])
      }
      board.push(row)
    }
    solveSudoku(board)
    return board.map(x => x.join('')).join('')
  }
}

module.exports = SudokuSolver;

