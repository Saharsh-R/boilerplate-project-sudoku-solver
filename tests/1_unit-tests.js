const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let answer = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
suite('UnitTests', () => {

    test("Logic handles a valid puzzle string of 81 characters", () => {
        assert.equal(solver.validate(puzzle), true)
    })

    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
        assert.equal(solver.validate('1.5*.2.84..63.12.7.2..5.....0..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), false)
    })

    test("Logic handles a puzzle string that is not 81 characters in length", () => {
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2674.3.7.2..9.47...8..1..16....926914.37.'), false)
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2674.3.7.2..9.47...8..1..16....926914.3.....7.'), false)
    })

    test('Logic handles a valid row placement', () => {
        assert.equal(solver.checkRowPlacement(puzzle, 0, 2, '5'), true)
    })

    test('Logic handles an invalid row placement', () => {
        assert.equal(solver.checkRowPlacement(puzzle, 0, 1, '1'), false)
    })

    test('Logic handles a valid column placement', () => {
        assert.equal(solver.checkColPlacement(puzzle, 8,8,'8'), true)
    })

    test('Logic handles an invalid column placement', () => {
        assert.equal(solver.checkColPlacement(puzzle, 0, 1, '2'), false)
    })

    test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement(puzzle, 0,1,'3'), true)
    })

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement(puzzle, 0,1,'5'), false)
    })

    test('Valid puzzle strings pass the solver', () => {
        assert.equal(solver.solve(puzzle), answer)
    })

    test('Invalid puzzle strings fail the solver', () => {
        let wrong = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        assert.equal(solver.solve(wrong), wrong)
    })

    test('Solver returns the the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve(puzzle), answer)
    })

});
