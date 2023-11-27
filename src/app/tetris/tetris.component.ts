import { Component, OnInit } from '@angular/core';

class Tetromino {
  shape: number[][];
  color: string;

  constructor(shape: number[][], color: string) {
    this.shape = shape;
    this.color = color;
  }
}

class TetrominoT extends Tetromino {
  constructor() {
    super(
      [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      'blue'
    );
  }
}

class TetrominoI extends Tetromino {
  constructor() {
    super(
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      'red'
    );
  }
}

class TetrominoJ extends Tetromino {
  constructor() {
    super(
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      'yellow'
    );
  }
}
class TetrominoL extends Tetromino {
  constructor() {
    super(
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 0],
      ],
      'green'
    );
  }
}
class TetrominoO extends Tetromino {
  constructor() {
    super(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
      'purple'
    );
  }
}
class TetrominoS extends Tetromino {
  constructor() {
    super(
      [
        [0, 1],
        [1, 1],
        [1, 0],
        [2, 0],
      ],
      'orange'
    );
  }
}
class TetrominoZ extends Tetromino {
  constructor() {
    super(
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
      'black'
    );
  }
}

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)',
  },
})
export class TetrisComponent implements OnInit {
  gameBoard: (Tetromino | null)[][] = Array(20)
    .fill(null)
    .map(() => Array(10).fill(null));

  tetrominos: any;
  currentTetromino: any;
  currentX: number = 0;
  currentY: number = 0;

  constructor() {
    this.initBoard();
    this.initTetrominos();
    this.generateTetromino();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.moveTetrominoDown();
    }, 1000);
  }

  initBoard() {
    this.gameBoard = Array(20)
      .fill(null)
      .map(() => Array(10).fill(null));
  }

  initTetrominos() {
    this.tetrominos = {
      T: new TetrominoT(),
      I: new TetrominoI(),
      J: new TetrominoJ(),
      L: new TetrominoL(),
      O: new TetrominoO(),
      S: new TetrominoS(),
      Z: new TetrominoZ(),
    };
  }

  generateTetromino() {
    const tetrominoKeys = Object.keys(this.tetrominos);
    const randomTetromino =
      this.tetrominos[
        tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)]
      ];
    this.currentTetromino = randomTetromino;

    this.currentX = 5;
    this.currentY = 0;
    this.placeTetromino(
      this.currentX,
      this.currentY,
      this.currentTetromino,
      true
    );
  }

  placeTetromino(x: number, y: number, tetromino: Tetromino, value: boolean) {
    tetromino.shape.forEach((point: number[]) => {
      const [row, col] = point;
      this.gameBoard[y + col][x + row] = value ? tetromino : null;
    });
  }

  moveTetromino(direction: number) {
    // Tetrominoyu kaldır
    this.placeTetromino(
      this.currentX,
      this.currentY,
      this.currentTetromino,
      false
    );

    // Yeni X pozisyonunu hesapla
    const newX = this.currentX + direction;

    // Hem X hem de Y koordinatları için çarpışma kontrolü yap
    if (
      !this.checkCollision(newX, this.currentY, this.currentTetromino) &&
      !this.checkCollision(
        this.currentX,
        this.currentY + 1,
        this.currentTetromino
      )
    ) {
      // Eğer çarpışma yoksa, X pozisyonunu güncelle
      this.currentX = newX;
    }

    // Tetrominoyu yeni pozisyona yerleştir
    this.placeTetromino(
      this.currentX,
      this.currentY,
      this.currentTetromino,
      true
    );
  }

  moveTetrominoDown() {
    this.placeTetromino(
      this.currentX,
      this.currentY,
      this.currentTetromino,
      false
    );

    const newY = this.currentY + 1;

    if (!this.checkCollision(this.currentX, newY, this.currentTetromino)) {
      this.currentY = newY;
      this.placeTetromino(
        this.currentX,
        this.currentY,
        this.currentTetromino,
        true
      );
    } else {
      this.placeTetromino(
        this.currentX,
        this.currentY,
        this.currentTetromino,
        true
      );

      const completedLines = this.checkCompleteLines();
      this.clearCompleteLines(completedLines);

      this.generateTetromino();
    }
  }

  rotateTetromino() {
    const newRotation = this.currentTetromino.shape.map((point: number[]) => {
      const [x, y] = point;
      const newX = 1 - (y - 1);
      const newY = x - 1 + 1;
      return [newX, newY];
    });

    const collision = newRotation.some(([x, y]: number[]) => {
      return (
        x < 0 ||
        x >= this.gameBoard[0].length ||
        y < 0 ||
        y >= this.gameBoard.length ||
        (this.gameBoard[y + this.currentY] &&
          this.gameBoard[y + this.currentY][x + this.currentX] !== null &&
          this.gameBoard[y + this.currentY][x + this.currentX] !==
            this.currentTetromino)
      );
    });

    if (!collision) {
      this.placeTetromino(
        this.currentX,
        this.currentY,
        this.currentTetromino,
        false
      );
      this.currentTetromino.shape = newRotation;
      this.placeTetromino(
        this.currentX,
        this.currentY,
        this.currentTetromino,
        true
      );
    }
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.rotateTetromino();
    } else if (event.key === 'ArrowLeft') {
      this.moveTetromino(-1);
    } else if (event.key === 'ArrowRight') {
      this.moveTetromino(1);
    } else if (event.key === 'ArrowDown') {
      this.moveTetrominoDown();
    }
  }

  checkCollision(x: number, y: number, tetromino: Tetromino): boolean {
    for (let point of tetromino.shape) {
      const newX = x + point[0];
      const newY = y + point[1];
      if (
        newX < 0 ||
        newX >= this.gameBoard[0].length ||
        newY >= this.gameBoard.length ||
        this.gameBoard[newY][newX] !== null
      ) {
        return true;
      }
    }
    return false;
  }
  checkCompleteLines(): number[] {
    return this.gameBoard
      .map((row, index) => (row.every((cell) => cell !== null) ? index : -1))
      .filter((index) => index !== -1);
  }

  clearCompleteLines(completedLines: number[]) {
    completedLines.forEach((line) => {
      this.gameBoard.splice(line, 1);
      this.gameBoard.unshift(Array(10).fill(null));
    });
  }

  getCellClass(cell: Tetromino | null): string {
    if (cell instanceof TetrominoT) {
      return 'tetromino-t';
    } else if (cell instanceof TetrominoI) {
      return 'tetromino-i';
    } else if (cell instanceof TetrominoJ) {
      return 'tetromino-j';
    } else if (cell instanceof TetrominoL) {
      return 'tetromino-l';
    } else if (cell instanceof TetrominoO) {
      return 'tetromino-o';
    } else if (cell instanceof TetrominoS) {
      return 'tetromino-s';
    } else if (cell instanceof TetrominoZ) {
      return 'tetromino-z';
    } else {
      return '';
    }
  }
}
