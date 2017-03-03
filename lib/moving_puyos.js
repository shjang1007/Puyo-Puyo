import SinglePuyo from "./single_puyo";

class MovingPuyos {
  constructor() {
    this.mainPuyo = new SinglePuyo();
    this.adjPuyo = new SinglePuyo(this.mainPuyo.col, this.mainPuyo.row  - 1);
  }

  // Probably can refactor two methods below to one. Something to work on.
  moveDown() {
    if (!this.mainPuyo.stop) {
      this.mainPuyo.row += 0.05;
    }
    if (!this.adjPuyo.stop) {
      this.adjPuyo.row += 0.05;
    }
  }

  move(direction, board) {
    const { mainPuyo, adjPuyo } = this;
    let { col, row } = mainPuyo.col <= adjPuyo.col ? mainPuyo : adjPuyo;
    let nextPos = -1;
    let inBound = (col > 0);

    if (direction === "right") {
      const puyo = mainPuyo.col <= adjPuyo.col ? adjPuyo : mainPuyo;
      col = puyo.col;
      row = puyo.row;
      nextPos = 1;
      inBound = (col + nextPos < board.col);
    }

    if (inBound &&
        board.posEmpty(col + nextPos, Math.ceil(row))) {
      mainPuyo.col += nextPos;
      adjPuyo.col += nextPos;
    }
  }

  quickDrop(board) {
    this.mainPuyo.row = board.openBottomRow(this.mainPuyocol);
    this.adjPuyo.row = board.openBottomRow(this.adjPuyocol);
  }

  drawPuyos(ctx) {
    this.mainPuyo.drawPuyo(ctx);
    this.adjPuyo.drawPuyo(ctx);
  }

  // handleKeyUp(e) {
  //   if (e.keyCode === 39) {
  //     this.rightPressed = false;
  //   } else if (e.keyCode === 37) {
  //     this.leftPressed = false;
  //   }
  // }

  // constructor(ctx) {
  //   const colors = ["yellow", "blue", "purple", "red", "green"];
  //   this.color = colors[Math.floor(Math.random() * colors.length)];
  //   this.ctx =ctx;
  //   this.rightPressed = false;
  //   this.leftPressed = false;
  //
  //   this.handleKeyDown = this.handleKeyDown.bind(this);
  //   this.handleKeyUp = this.handleKeyUp.bind(this);
  // }
  //
  // draw(ctx) {
  //   let ballRadius = 10;
  //   let x = 125;
  //   let y = 0;
  //
  //   let dy = 5;
  //
  //   return () => {
  //     ctx.clearRect(0, 0, 250, 500);
  //     this.drawBall(ctx, x, y);
  //
  //     if(y + dy > 500 - ballRadius) {
  //       dy = 0;
  //     }
  //

  //
  //     y += dy;
  //   };
  // }
  //
  // drawBall(ctx, x, y) {
  //   ctx.beginPath();
  //   ctx.arc(x, y, 10, 0, Math.PI * 2);
  //   ctx.fillStyle = this.color;
  //   ctx.fill();
  //   ctx.closePath();
  // }
  //

}

export default MovingPuyos;