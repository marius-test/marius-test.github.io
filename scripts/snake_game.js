    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const gameOverMsg = document.getElementById('gameOverMsg');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');

    const scale = 20;
    const rows = canvas.height / scale;
    const cols = canvas.width / scale;

    let snake;
    let food;
    let score;
    let gameInterval;
    let isGameOver = false;

    function Snake() {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.total = 0;
      this.tail = [];

      this.draw = function() {
        ctx.fillStyle = '#000080';
        for(let i=0; i < this.tail.length; i++) {
          ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
      };

      this.update = function() {
        for(let i = 0; i < this.tail.length - 1; i++) {
          this.tail[i] = this.tail[i+1];
        }
        if(this.total >= 1) {
          this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        // wrap around screen edges
        this.x = (this.x + canvas.width) % canvas.width;
        this.y = (this.y + canvas.height) % canvas.height;

        // check self collision
        for(let i=0; i < this.tail.length; i++) {
          if(this.x === this.tail[i].x && this.y === this.tail[i].y) {
            gameOver();
          }
        }
      };

      this.changeDirection = function(direction) {
        switch(direction) {
          case 'Up':
            if(this.ySpeed === 0) {
              this.xSpeed = 0;
              this.ySpeed = -scale;
            }
            break;
          case 'Down':
            if(this.ySpeed === 0) {
              this.xSpeed = 0;
              this.ySpeed = scale;
            }
            break;
          case 'Left':
            if(this.xSpeed === 0) {
              this.xSpeed = -scale;
              this.ySpeed = 0;
            }
            break;
          case 'Right':
            if(this.xSpeed === 0) {
              this.xSpeed = scale;
              this.ySpeed = 0;
            }
            break;
        }
      };

      this.eat = function(foodPos) {
        if(this.x === foodPos.x && this.y === foodPos.y) {
          this.total++;
          return true;
        }
        return false;
      };
    }

    function randomFoodPosition() {
      return {
        x: Math.floor(Math.random() * cols) * scale,
        y: Math.floor(Math.random() * rows) * scale
      };
    }

    function gameOver() {
      clearInterval(gameInterval);
      isGameOver = true;
      gameOverMsg.style.display = 'block';
      restartBtn.disabled = false;
    }

    function resetGame() {
      snake = new Snake();
      food = randomFoodPosition();
      score = 0;
      scoreDisplay.textContent = `Score: ${score}`;
      gameOverMsg.style.display = 'none';
      restartBtn.disabled = true;
      isGameOver = false;
      draw();
    }

    function draw() {
      ctx.fillStyle = '#fefefe';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      snake.draw();

      ctx.fillStyle = '#ff0000';
      ctx.fillRect(food.x, food.y, scale, scale);
    }

    function update() {
      if (isGameOver) return;
      snake.update();

      if(snake.eat(food)) {
        food = randomFoodPosition();
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
      }

      draw();
    }

    window.addEventListener('keydown', e => {
      const key = e.key;
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        switch(key) {
          case 'ArrowUp': case 'w':
            snake.changeDirection('Up');
            break;
          case 'ArrowDown': case 's':
            snake.changeDirection('Down');
            break;
          case 'ArrowLeft': case 'a':
            snake.changeDirection('Left');
            break;
          case 'ArrowRight': case 'd':
            snake.changeDirection('Right');
            break;
        }
      }
    });

    startBtn.addEventListener('click', () => {
      if (!gameInterval) {
        resetGame();
        gameInterval = setInterval(update, 150);
        startBtn.disabled = true;
      }
    });

    restartBtn.addEventListener('click', () => {
      clearInterval(gameInterval);
      gameInterval = setInterval(update, 150);
      resetGame();
      startBtn.disabled = true;
    });

    // initial setup
    resetGame();
    