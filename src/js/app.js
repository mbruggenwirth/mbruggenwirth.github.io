import "../scss/main.scss";

const grid = 3;
const matrix = [...Array(grid)].map(x => Array(grid).fill(0));
const squares = matrix;
const game = document.getElementById('game');
const gameSegment = document.createElement('div');
const scoreSegment = document.createElement('div');
gameSegment.classList.add('grid');
scoreSegment.classList.add('scores');
game.appendChild(gameSegment);
game.appendChild(scoreSegment);

function loopIndex(array, current, step) {
    const nextIndex = current + step;
    return nextIndex >= array.length ? nextIndex - array.length : nextIndex;
}



class Player {
    constructor() {
        this.score = 0;
    }

    increaseScore() {
        this.score = this.score + 1;
    }
}



class Square {
    constructor(row, col) {
        this.square = null;
        this.lines = null;
        this.row = row;
        this.col = col;
        this.positions = ['top', 'right', 'bottom', 'left'];
        this.renderSquare();
    }

    renderSquare() {
        this.square = document.createElement('div');
        this.square.classList.add('square');

        this.lines = [...this.positions].map(() => document.createElement('span'));
        this.lines.forEach((line) => {

            line.addEventListener('click', (e) => this.handleLineClick(e.target));
            this.square.appendChild(line);
        });

        return this.square;
    }

    handleLineClick(line) {
        const position = this.positions[this.lines.indexOf(line)];
        if(line.classList.contains('set')) {
            return false;
        }
        this.setActiveLine(line);

        if(this.neighbours[position]) {
            this.handleNeigbour(position);
        }

        const win = this.checkWinner(this);
        if(!win) {
            activePlayer = loopIndex(players, activePlayer, 1);
            console.log(players[activePlayer]);
        }
    }

    handleNeigbour(position) {
        const opposite = loopIndex(this.positions, this.positions.indexOf(position), 2);
        this.setActiveLine(this.neighbours[position].lines[opposite]);
        this.checkWinner(this.neighbours[position]);
    }

    checkWinner(square) {
        const winner = square.lines.filter(line => line.classList.contains('set')).length === 4;
        if(winner) {
            square.square.classList.add(`win-player-${activePlayer}`);
            players[activePlayer].increaseScore();
            return true;
        }
        return false;
    }

    setActiveLine(line) {
        line.classList.add('set');
    }

    getSquare(row, col) {
        if(squares[row] !== undefined && squares[row][col] !== undefined) {
            return squares[row][col];
        }
    }

    getNeighbours() {
        this.neighbours = {
            top: this.getSquare(this.row - 1, this.col),
            right: this.getSquare(this.row, this.col + 1),
            bottom: this.getSquare(this.row + 1, this.col),
            left: this.getSquare(this.row, this.col - 1)
        };
    }
}

let activePlayer = 0;
const players = [...Array(2)].map(x => {
    return new Player();
} );

matrix.map((rows, rowIndex) => {
    const row = document.createElement('div');
    row.classList.add('row');
    rows.map((column, columnIndex) => {
        const square = new Square(rowIndex, columnIndex);
        squares[rowIndex][columnIndex] = square;
        row.appendChild(square.renderSquare());
        gameSegment.appendChild(row);
    });
});

matrix.map((rows, rowIndex) => {
    rows.map((column, columnIndex) => {
        squares[rowIndex][columnIndex].getNeighbours();
    })
});
