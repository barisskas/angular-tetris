import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)',
  },
})
export class TetrisComponent implements OnInit {
  gameBoard: boolean[][] = Array(20)
    .fill(null)
    .map(() => Array(10).fill(false));

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
      .map(() => Array(10).fill(false));
  }

  initTetrominos() {
    this.tetrominos = {
      T: [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      I: [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      J: [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      L: [
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 0],
      ],
      O: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
      S: [
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
      ],
      Z: [
        [0, 0],
        [1, 0],
        [1, 1],
        [2, 1],
      ],
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

  placeTetromino(x: number, y: number, tetromino: any, value: boolean) {
    tetromino.forEach((point: number[]) => {
      const [row, col] = point;
      this.gameBoard[y + col][x + row] = value;
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
    if (!this.checkCollision(newX, this.currentY, this.currentTetromino)) {
      this.currentX = newX;
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
    }
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
      if (completedLines.length > 0) {
        this.clearCompleteLines(completedLines);
      }
      this.generateTetromino();
    }
  }
  rotateTetromino() {
    // Yeni rotasyonu hesaplayın
    const newRotation = this.currentTetromino.map((point: number[]) => {
      const [x, y] = point;
      // Merkez etrafında döndürün: Örneğin, merkezi (1,1) olarak kabul edelim
      const newX = 1 - (y - 1);
      const newY = x - 1 + 1;
      return [newX, newY];
    });

    const collision = newRotation.some((point: number[]) => {
      const [x, y] = point;
      return (
        x < 0 ||
        x >= this.gameBoard[0].length ||
        y >= this.gameBoard.length ||
        this.gameBoard[y][x]
      );
    });

    // Eğer rotasyon geçerliyse, Tetromino'nun pozisyonunu güncelleyin
    if (!collision) {
      // Önceki pozisyonu temizleyin
      this.placeTetromino(
        this.currentX,
        this.currentY,
        this.currentTetromino,
        false
      );
      // Yeni rotasyonu uygulayın
      this.currentTetromino = newRotation;
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

  checkCollision(x: number, y: number, tetromino: any): boolean {
    for (let point of tetromino) {
      const newX = x + point[0];
      const newY = y + point[1];
      if (
        newX < 0 ||
        newX >= this.gameBoard[0].length ||
        newY >= this.gameBoard.length
      ) {
        return true;
      }
      if (this.gameBoard[newY][newX]) {
        return true;
      }
    }
    return false;
  }

  checkCompleteLines() {
    const completedLines = [];

    for (let y = 0; y < this.gameBoard.length; y++) {
      let isComplete = true;

      for (let x = 0; x < this.gameBoard[y].length; x++) {
        if (!this.gameBoard[y][x]) {
          isComplete = false;
          break;
        }
      }

      if (isComplete) {
        completedLines.push(y);
      }
    }

    return completedLines;
  }

  clearCompleteLines(completedLines: number[]) {
    completedLines.forEach((line) => {
      this.gameBoard.splice(line, 1);
      this.gameBoard.unshift(Array(10).fill(false));
    });
  }
}
