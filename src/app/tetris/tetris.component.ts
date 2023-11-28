import { Component, OnInit } from '@angular/core';

class Tetromino {
  shape: { coords: number[]; imageUrl: string }[];
  rotation: number = 0;

  constructor(shape: { coords: number[]; imageUrl: string }[]) {
    this.shape = shape;
    this.rotation = 0;
  }
}

class TetrominoT extends Tetromino {
  constructor() {
    super([
      { coords: [1, 0], imageUrl: '/assets/y.png' },
      { coords: [0, 1], imageUrl: '/assets/x.png' },
      { coords: [1, 1], imageUrl: '/assets/x.png' },
      { coords: [2, 1], imageUrl: '/assets/y.png' },
    ]);
  }
}

class TetrominoI extends Tetromino {
  constructor() {
    super([
      { coords: [0, 1], imageUrl: '../../assets/x.png' },
      { coords: [1, 1], imageUrl: '../../assets/z.png' },
      { coords: [2, 1], imageUrl: '../../assets/w.png' },
      { coords: [3, 1], imageUrl: '../../assets/y.png' },
    ]);
  }
}

class TetrominoJ extends Tetromino {
  constructor() {
    super([
      { coords: [0, 0], imageUrl: '../../assets/y.png' },
      { coords: [0, 1], imageUrl: '../../assets/y.png' },
      { coords: [1, 1], imageUrl: '../../assets/y.png' },
      { coords: [2, 1], imageUrl: '../../assets/y.png' },
    ]);
  }
}

class TetrominoL extends Tetromino {
  constructor() {
    super([
      { coords: [2, 0], imageUrl: '../../assets/y.png' },
      { coords: [0, 1], imageUrl: '../../assets/y.png' },
      { coords: [1, 1], imageUrl: '../../assets/x.png' },
      { coords: [2, 1], imageUrl: '../../assets/x.png' },
    ]);
  }
}

class TetrominoO extends Tetromino {
  constructor() {
    super([
      { coords: [0, 0], imageUrl: '../../assets/y.png' },
      { coords: [1, 0], imageUrl: '../../assets/y.png' },
      { coords: [0, 1], imageUrl: '../../assets/y.png' },
      { coords: [1, 1], imageUrl: '../../assets/y.png' },
    ]);
  }
}

class TetrominoS extends Tetromino {
  constructor() {
    super([
      { coords: [1, 0], imageUrl: '../../assets/z.png' },
      { coords: [2, 0], imageUrl: '../../assets/w.png' },
      { coords: [0, 1], imageUrl: '../../assets/z.png' },
      { coords: [1, 1], imageUrl: '../../assets/w.png' },
    ]);
  }
}

class TetrominoZ extends Tetromino {
  constructor() {
    super([
      { coords: [0, 0], imageUrl: '../../assets/z.png' },
      { coords: [1, 0], imageUrl: '../../assets/w.png' },
      { coords: [1, 1], imageUrl: '../../assets/z.png' },
      { coords: [2, 1], imageUrl: '../../assets/w.png' },
    ]);
  }
}

interface Cell {
  tetromino: Tetromino;
  imageUrl: string;
  rotation: number;
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
  gameBoard: (Cell | null)[][] = Array(20)
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
    }, 500);
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
    tetromino.shape.forEach((point) => {
      const [row, col] = point.coords;
      if (value) {
        this.gameBoard[y + col][x + row] = {
          tetromino: tetromino,
          imageUrl: point.imageUrl,
          rotation: tetromino.rotation,
        };
      } else {
        this.gameBoard[y + col][x + row] = null;
      }
    });
  }

  moveTetromino(direction: number) {
    this.placeTetromino(
      this.currentX,
      this.currentY,
      this.currentTetromino,
      false
    );

    const newX = this.currentX + direction;

    if (
      !this.checkCollision(newX, this.currentY, this.currentTetromino) &&
      !this.checkCollision(
        this.currentX,
        this.currentY + 1,
        this.currentTetromino
      )
    ) {
      this.currentX = newX;
    }

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
    let newRotation = this.currentTetromino.shape.map(
      (point: { coords: number[]; imageUrl: string }) => {
        const [x, y] = point.coords;
        const newX = 1 - (y - 1);
        const newY = x - 1 + 1;
        return { coords: [newX, newY], imageUrl: point.imageUrl };
      }
    );
    if (this.currentTetromino instanceof TetrominoO) {
      return;
    }
    if (this.currentTetromino instanceof TetrominoI) {
      newRotation = this.currentTetromino.shape.map(
        (point: { coords: number[]; imageUrl: string }) => {
          const [x, y] = point.coords;
          const newX = 2 - (y - 1);
          const newY = x - 1 + 1;
          return { coords: [newX, newY], imageUrl: point.imageUrl };
        }
      );
    }

    const collision = newRotation.some(
      (point: { coords: number[]; imageUrl: string }) => {
        const [relX, relY] = point.coords;
        const newX = this.currentX + relX;
        const newY = this.currentY + relY;

        return (
          newX < 0 ||
          newX >= this.gameBoard[0].length ||
          newY < 0 ||
          newY >= this.gameBoard.length ||
          (this.gameBoard[newY][newX] !== null &&
            this.gameBoard[newY][newX]?.tetromino !== this.currentTetromino)
        );
      }
    );

    if (!collision) {
      this.placeTetromino(
        this.currentX,
        this.currentY,
        this.currentTetromino,
        false
      );
      this.currentTetromino.shape = newRotation;
      this.currentTetromino.rotation =
        (this.currentTetromino.rotation + 90) % 360;

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
    return tetromino.shape.some((point) => {
      const [newX, newY] = [x + point.coords[0], y + point.coords[1]];
      return (
        newX < 0 ||
        newX >= this.gameBoard[0].length ||
        newY >= this.gameBoard.length ||
        this.gameBoard[newY][newX] !== null
      );
    });
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

  getTetrominoImageUrl(cell: Cell | null): string {
    return cell ? cell.imageUrl : '';
  }
}
