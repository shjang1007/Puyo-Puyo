import MovingPuyos from "./moving_puyos";
import Board from "./board";

class Game {
  constructor(ctx) {
    this.board = new Board();
    this.nextPuyos = new MovingPuyos();
    this.currentPuyos = null;
    this.ctx = ctx;
    this.paused = false;
    this.mute = false;
    this.over = false;
    this.speed = 0.03;

    const pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", this.togglePauseButton);

    const muteButton = document.getElementById("mute-button");
    muteButton.addEventListener("mousedown", this.toggleMuteButton);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.togglePauseButton = this.togglePauseButton.bind(this);
    this.toggleMuteButton = this.toggleMuteButton.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
  }

  gameOver() {
    const { ctx } = this;
    if (this.board.occupied(3, 0)) {
      this.over = true;
      document.getElementById("modal-container").style.display = "block";
      document.getElementById("start-text").style.display = "none";
      document.getElementById("end-text").style.display = "block";
      document.getElementById("bgm").pause();
      document.getElementById("bgm").currentTime = 0;
    }

    if (this.over && document.getElementById("sound-icon").className.includes("off")) {
      document.getElementById("game-over-music").play();
    }
  }

  resetGame() {
    this.board = new Board();
    this.currentPuyos = new MovingPuyos();
    this.nextPuyos = new MovingPuyos();
    this.over = false;
    this.speed = 0.03;
  }

  step() {
    document.getElementById("score").innerHTML = this.board.score;
    if (!this.paused) {
      if (!this.currentPuyos) {
        this.currentPuyos = new MovingPuyos();
      }

      const { mainPuyo, adjPuyo } = this.currentPuyos;
      if (this.speed < 0.13) {
        this.speed += 0.000002;
      }

      this.currentPuyos.moveDown(this.speed);

      // Right now, everytime we go through step, we are calling this.
      // Is this okay? Maybe only call this when ready?
      mainPuyo.markBoardUponLand(this.board);
      adjPuyo.markBoardUponLand(this.board);

      this.board.clearPuyos();
      this.board.dropToEmptyPos();
      if (mainPuyo.stop && adjPuyo.stop) {
        this.currentPuyos = this.nextPuyos;
        this.nextPuyos = new MovingPuyos();
      }
    }
  }

  togglePauseButton(e) {
    if (this.paused) {
      this.paused = false;
      $(e.target)
        .replaceWith('<i class="fa fa-pause-circle-o fa-fw fa-4x"></i>');
    } else {
      this.paused = true;
      $(e.target)
        .replaceWith('<i class="fa fa-play-circle-o fa-fw fa-4x"></i>');

    }
  }

  toggleMuteButton(e) {
    if (this.mute) {
      this.mute = false;
      document.getElementById("bgm").play();
      $(e.target)
        .replaceWith('<i id="sound-icon" class="fa fa-volume-off fa-fw fa-4x"></i>');
    } else {
      this.mute = true;
      document.getElementById("bgm").pause();
      $(e.target)
        .replaceWith('<i id="sound-icon" class="fa fa-volume-up fa-fw fa-4x"></i>');

    }
  }

  draw(ctx, nextPuyoCtx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    nextPuyoCtx.clearRect(0, 0, 50, 100);
    this.board.drawBoard(ctx);
    this.currentPuyos.drawPuyos(ctx);
    this.nextPuyos.drawNextPuyos(nextPuyoCtx);
  }

  handleKeyDown(e) {
    // Don't do anything if enter pressed
    if (!this.currentPuyos || e.which === 13) return;

    // If puyo landed or the game is paused, disable moves
    if (this.currentPuyos.disableMoves() || this.paused) return;

    if (e.which === 39) {
      this.currentPuyos.move("right", this.board);
    } else if (e.which === 37) {
      this.currentPuyos.move("left", this.board);
    } else if (e.which === 32) {
      this.currentPuyos.rotate(this.board);
    } else if (e.which === 40) {
      this.currentPuyos.quickDrop(this.board);
    }
  }
}

Game.DIM_X = 240;
Game.DIM_Y = 480;

export default Game;
