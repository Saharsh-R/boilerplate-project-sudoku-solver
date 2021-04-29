const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let puzzle = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'
let solution = '473891265851726394926345817568913472342687951197254638734162589685479123219538746'

suite('Functional Tests', () => {
    suite('For api/solve', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle})
                .end((err, res) =>{
                    assert.equal(res.body.solution, solution)
                    done()
                })
        })

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Required field missing")
                    done()
                })
        })

        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle: '.0.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Invalid characters in puzzle")
                    done()
                })
        }) 

        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle: puzzle.slice(0, 70)})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
                    done()
                })
        })

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle: "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Puzzle cannot be solved")
                    done()
                })
        })

    })

    suite('For api/check', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle, coordinate: 'a1', value: '4'})
                .end((err, res) =>{
                    assert.equal(res.body.valid, true)
                    done()
                })
        })

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle, coordinate: 'a9', value: '1'})
                .end((err, res) =>{
                    assert.equal(res.body.valid, false)
                    assert.equal( JSON.stringify(res.body.conflict) , JSON.stringify(['region']))
                    done()
                })
        })

        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle, coordinate: 'g9', value: '2'})
                .end((err, res) =>{
                    assert.equal(res.body.valid, false)
                    assert.equal( JSON.stringify(res.body.conflict) , JSON.stringify( [ "row", "column" ]))
                    done()
                })
        })

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle, coordinate: 'a1', value: '7'})
                .end((err, res) =>{
                    assert.equal(res.body.valid, false)
                    assert.equal( JSON.stringify(res.body.conflict) , JSON.stringify([ "row", "column", "region" ]))
                    done()
                })
        })

        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({ coordinate: 'a1', value: '4'})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Required field(s) missing")
                    done()
                })
        })


        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:puzzle.slice(0, 80) + '*', coordinate: 'a1', value: '4'})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Invalid characters in puzzle")
                    done()
                })
        })

        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle: puzzle + '..', coordinate: 'a1', value: '4'})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
                    done()
                })
        })

        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle, coordinate: 'j5', value: '4'})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Invalid coordinate")
                    done()
                })
        })

        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle, coordinate: 'a1', value: '0'})
                .end((err, res) =>{
                    assert.equal(res.body.error, "Invalid value")
                    done()
                })
        })

    })


});



