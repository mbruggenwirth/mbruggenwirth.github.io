import "../scss/main.scss";

function loopIndex(array, current, step) {
    const nextIndex = current + step;
    return nextIndex >= array.length ? nextIndex - array.length : nextIndex;
}

class Player {
    constructor(scoreDOM) {
        this.score = 0;
        this.player = {
            name: 'Michiel',
            color: "#ff000"
        };
        this.DOM = scoreDOM;
        this.renderScore();
    }

    increaseScore() {
        this.score = this.score + 1;
        this.renderScore();
    }

    renderScore() {
        this.DOM.textContent = this.score.toString();
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
        this.neighbours = {};
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
            this.handleNeighbour(position);
        }

        const win = this.checkWinner(this);
        if(!win) {
            game.activePlayer = loopIndex(game.players, game.activePlayer, 1);
        }
    }

    handleNeighbour(position) {
        const opposite = loopIndex(this.positions, this.positions.indexOf(position), 2);
        this.setActiveLine(this.neighbours[position].lines[opposite]);
        this.checkWinner(this.neighbours[position]);
    }

    checkWinner(square) {
        const winner = square.lines.filter(line => line.classList.contains('set')).length === 4;
        if(winner) {
            square.square.classList.add(`win-player-${game.activePlayer}`);
            game.players[game.activePlayer].increaseScore();
            return true;
        }
        return false;
    }

    setActiveLine(line) {
        line.classList.add('set');
    }
}


class Game {
    constructor(options) {
        const defaultOptions = {
            grid: 3,
            players: 2
        };
        this.options = Object.assign({}, defaultOptions, options);
        this.grid = this.options.grid ? this.options.grid : 3;
        this.matrix = [...Array(this.grid)].map(x => Array(this.grid).fill(0));
        this.squares = this.matrix;
        this.createBoard();
        this.createGrid();
        this.setNeighbours();

        this.activePlayer = 0;
        this.players = this.setPlayers(this.options.players);
    }

    createBoard() {
        const game = document.getElementById('game');
        this.gameBoard = document.createElement('div');
        this.scoreBoard = document.createElement('div');
        this.gameBoard.classList.add('grid');
        this.scoreBoard.classList.add('scores');
        game.appendChild(this.gameBoard);
        game.appendChild(this.scoreBoard);
    }

    createGrid(){
        this.matrix.map((rows, rowIndex) => {
            const row = document.createElement('div');
            row.classList.add('row');
            rows.map((column, columnIndex) => {
                const square = new Square(rowIndex, columnIndex);
                this.squares[rowIndex][columnIndex] = square;
                row.appendChild(square.renderSquare());
                this.gameBoard.appendChild(row);
            });
        });
    }

    setNeighbours() {
        this.matrix.forEach((rows, rowIndex) => {
            rows.forEach((column, columnIndex) => {
                this.findNeighboursOfSquare(this.squares[rowIndex][columnIndex]);
            })
        });
    }

    setPlayers(amount) {
        return [...Array(amount)].map(x => {
            const scoreElement = document.createElement('span');
            this.scoreBoard.append(scoreElement);
            return new Player(scoreElement);
        });
    }

    findSquareOnPosition(row, col) {
        if(this.squares[row] !== undefined && this.squares[row][col] !== undefined) {
            return this.squares[row][col];
        }
    }

    findNeighboursOfSquare(square) {
        square.neighbours = {
            top: this.findSquareOnPosition(square.row - 1, square.col),
            right: this.findSquareOnPosition(square.row, square.col + 1),
            bottom: this.findSquareOnPosition(square.row + 1, square.col),
            left: this.findSquareOnPosition(square.row, square.col - 1)
        };
    }
}


const game = new Game({
    grid: 3,
    players: 2
});


