import "../scss/main.scss";

function loopIndex(array, current, step) {
    const nextIndex = current + step;
    return nextIndex >= array.length ? nextIndex - array.length : nextIndex;
}

class Player {
    constructor(options) {
        this.options = Object.assign({}, options);
        this.score = 0;
        this.player = {
            name: this.options.name,
            color: this.options.color
        };
    }

    assignDOM(scoreDOM) {
        this.DOM = scoreDOM;
        this.renderScore();
    }

    increaseScore() {
        this.score = this.score + 1;
        this.renderScore();
    }

    renderScore() {
        this.DOM.style.flexGrow = this.score + 1;
    }

    unsetAsActivePlayer() {
        this.DOM.classList.remove('active');
    }

    setAsActivePlayer() {
        this.DOM.classList.add('active');
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
        let winners = [];
        if(line.classList.contains('set')) {
            return false;
        }
        this.setActiveLine(line);
        const win = this.checkWinner(this);
        if(win) {
            winners.push(this);
        }

        if(this.neighbours[position]) {
            const neighbourWin = this.handleNeighbour(position);
            if(neighbourWin) {
                winners.push(this.neighbours[position]);
            }
        }

        if(winners.length === 0) {
            board.changePlayer();
        }

        board.winningSquares(winners);
    }

    handleNeighbour(position) {
        const opposite = loopIndex(this.positions, this.positions.indexOf(position), 2);
        this.setActiveLine(this.neighbours[position].lines[opposite]);
        return this.checkWinner(this.neighbours[position]);
    }

    checkWinner(square) {
        return square.lines.filter(line => line.classList.contains('set')).length === 4;
    }

    setActiveLine(line) {
        line.classList.add('set');
    }
}


class Board {
    constructor(options) {
        const defaultOptions = {
            grid: 3,
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
        this.players[this.activePlayer].setAsActivePlayer();
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

    setPlayers(players) {
        return players.map(player => {
            const scoreElement = document.createElement('span');
            scoreElement.style.backgroundColor = player.player.color;
            scoreElement.innerText = "It's your turn now";
            this.scoreBoard.append(scoreElement);
            player.assignDOM(scoreElement);
            return player;
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

    changePlayer() {
        this.players.forEach((player) => player.unsetAsActivePlayer());
        this.activePlayer = loopIndex(this.players, this.activePlayer, 1);
        this.players[this.activePlayer].setAsActivePlayer();
    }

    winningSquares(winners) {
        winners.forEach((square) => {
            this.players[this.activePlayer].increaseScore();
            square.square.style.backgroundColor = this.players[this.activePlayer].player.color;
        })
    }
}

let board = null;
const form = document.getElementById('setup-form');
const setupGrid = form.querySelector('#setup-grid');


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const settings = {
        grid: form.querySelector('#setup-grid').value,
        players: []
    };

    Array.from(form.querySelectorAll('.player')).forEach((player) => {
        settings.players.push({
            name: player.querySelector('input.player-name').value,
            color: player.querySelector('input.player-color').value
        });
    });

    board = new Board({
        grid: parseInt(settings.grid),
        players: settings.players.map((player) => new Player({name: player.name, color: player.color}))
    });

    form.remove();
});


