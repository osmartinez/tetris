const board = document.getElementById("board")
const context = board.getContext("2d")
const body = document.body


class Square {
    matrix = []
    game = undefined
    position = [0, 0]
    stop = false
    applyMove = undefined

    constructor(game) {
        this.game = game
        this.matrix = [
            [1, 1],
            [1, 1]
        ]
    }

    clearPrevious() {
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[0].length; j++) {
                const nextRow = this.position[0] + i
                const nextCol = this.position[1] + j
                this.game.matrix[nextRow][nextCol] = 0
            }
        }
    }

    checkCollision() {
        return this.position[0] + this.matrix.length >= this.game.rows ||
            this.game.matrix[this.position[0] + this.matrix.length][this.position[1]] === 1 ||
            this.game.matrix[this.position[0] + this.matrix.length][this.position[1] + 1] === 1

    }

    next() {
        if (this.stop) {
            return
        }

        this.clearPrevious()

        this.position = [this.position[0] + 1, this.position[1]]

        if (this.applyMove === 'left') {
            this.position = [this.position[0], this.position[1] - 1]
            this.applyMove = undefined

        }
        else if (this.applyMove === 'right') {
            this.position = [this.position[0], this.position[1] + 1]
            this.applyMove = undefined
        }

        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[0].length; j++) {
                const nextRow = this.position[0] + i
                const nextCol = this.position[1] + j
                this.game.matrix[nextRow][nextCol] = 1
            }
        }

        this.stop = this.checkCollision()
    }

    run() {
        if (this.applyMove === "down") {
            while (!this.stop) {
                this.next()
            }
        }
        else {
            this.next()
        }
    }

    move(direction) {
        this.applyMove = direction
    }
}

class Game {
    width = board.width
    height = board.height
    squareDim = 20
    matrix = undefined
    rows = this.height / this.squareDim
    cols = this.width / this.squareDim
    pieces = []

    constructor() {
        this.clear()
        this.run()
        this.generate()
        setInterval(() => {
            if (this.pieces.filter(x => !x.stop).length === 0) {
                this.generate()
            }
        }, 1 * 1000)

        body.addEventListener('keyup', (e) => {
            if (e.key.includes("Arrow")) {
                for (const piece of this.pieces) {
                    piece.move(e.key.replace("Arrow", "").toLowerCase())
                }
            }
        })
    }

    clear() {
        this.matrix = []
        for (let i = 0; i < this.rows; i++) {
            const row = []
            for (let j = 0; j < this.cols; j++) {
                row.push(0)
            }
            this.matrix.push(row)
        }
    }

    run() {
        context.clearRect(0, 0, board.width, board.height);

        for (const piece of this.pieces) {
            piece.run()
        }

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                const cell = this.matrix[j][i]
                if (cell === 1) {
                    context.fillStyle = "yellow"
                }
                else {
                    context.fillStyle = "darkblue"
                }
                context.fillRect(i * this.squareDim, j * this.squareDim, this.squareDim - 0.1, this.squareDim - 0.1)

            }
        }
        this.checkline()
    }

    checkline() {
        let rowComplete = -1
        for (let i = 0; i < this.rows; i++) {
            if (this.matrix[i].filter(x => x !== 1).length === 0) {
                rowComplete = i
                break
            }
        }

        for (let i = rowComplete; i > 0; i--) {
            for (let j = 0; j < this.cols; j++) {
                const cellUp = this.matrix[i - 1][j]
                this.matrix[i][j] = cellUp
            }
        }
    }

    generate() {
        this.pieces.push(new Square(this))
    }


}

const game = new Game()



setInterval(() => {
    game.run()
}, 200)