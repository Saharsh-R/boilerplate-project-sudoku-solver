'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let {puzzle, coordinate, value} = req.body
      if (puzzle == undefined || coordinate == undefined || value == undefined){
        return res.json({ error: 'Required field(s) missing' })
      }
      if (puzzle.length != 81){
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      if (!solver.validate(puzzle)){
        return res.json({ error: 'Invalid characters in puzzle' })
      }

      if (! /^[a-i][1-9]$/i.test(coordinate)){
        return res.json({ error: 'Invalid coordinate'})
      }

      if (! /^[1-9]$/i.test(value)){
        return res.json({ error: 'Invalid value' })
      }

      let result = {}
      let errors = []
      let row = coordinate[0].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
      let col = parseInt(coordinate[1]) - 1
      if (!solver.checkRowPlacement(puzzle, row, col, value)){
        errors.push('row')
      }
      if (!solver.checkColPlacement(puzzle, row, col, value)){
        errors.push('column')
      }
      if (!solver.checkRegionPlacement(puzzle, row, col, value)){
        errors.push('region')
      }

      if (errors.length != 0){
        // order matters. This is only the order in which you will see the res.body in json in postman.
        //if conflict if above then on postman also it will come up
        // although the order does not matter if you just want to pass freecodecamp tests
        result.valid = false
        result.conflict = errors

      } else{
        result.valid = true
      }

      return res.json(result)
      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      if (puzzle == undefined){
        return res.json({ error: 'Required field missing' })
      }
      if (puzzle.length != 81){
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      if (!solver.validate(puzzle)){
        return res.json({ error: 'Invalid characters in puzzle' })
      }

      let solution = solver.solve(puzzle)

      if (solution.includes('.')){
        return res.json({ error: 'Puzzle cannot be solved' })
      }
      return res.json({solution: solution})
    });
};
