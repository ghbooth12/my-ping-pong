window.onload = function() {
  animate(step);
};

var tableCanv = document.getElementById('table');
var ctx = tableCanv.getContext('2d');
tableCanv.width = tableCanv.getAttribute('width');
tableCanv.height = tableCanv.getAttribute('height');

tableCanv.render = function() {
  // draw table
  ctx.fillStyle = '#8fc5f1';
  ctx.fillRect(0, 0, this.width, this.height);

  // draw line
  ctx.beginPath();
  ctx.moveTo(0, this.height/2);
  ctx.lineTo(this.width, this.height/2);
  ctx.strokeStyle = '#eee';
  ctx.stroke();

  // draw score
  ctx.beginPath();
  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#eee';

  var computerScore = computer.paddle.score.toString();
  var playerScore = player.paddle.score.toString();

  ctx.fillText(computerScore, this.width - 55, this.height / 2 - 25);
  ctx.fillText(playerScore, this.width - 55, this.height / 2 + 45);
};

// Build objects
var computer = new Computer();
var player = new Player();
var ball = new Ball();

var key = {};
window.addEventListener('keydown', function(e) {
  key[e.keyCode] = true;
});

window.addEventListener('keyup', function(e) {
  delete key[e.keyCode];
});

var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { window.setTimeout(callback, 1000/60) };

var stopAnimate = window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame    ||
            window.oCancelAnimationFrame      ||
            window.msCancelAnimationFrame     ||
            clearTimeout;

function step() {
  render();
  update();
  animate(step);
}

function render() {
  tableCanv.render();
  computer.render();
  player.render();
  ball.render();
}

function update() {
  player.update();
  ball.update(player.paddle, computer.paddle);
  computer.update(ball);
}

// Object Constructor: Paddle
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = 0;
  this.score = 0;
}

Paddle.prototype.render = function() {
  ctx.fillStyle = '#662200';
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(speed) {
  this.x += speed;
  this.speed = speed;

  if (this.x < 0) { // hit the left wall
    this.x = 0;
  } else if (this.x + this.width > tableCanv.width) { // hit the right wall
    this.x = tableCanv.width - this.width;
  }
};

// Object Constructor: Computer
function Computer() {
  this.paddle = new Paddle(200, 0, 100, 20);
}

Computer.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.update = function(ball) {
  var diff = ball.x - (this.paddle.x + (this.paddle.width / 2));

  // when diff is greater than 4
  // set max speed to 5
  if(diff < -4) { // if paddle is in the right side of the ball
    diff = -5; // move paddle to the left to be closer to the ball
  } else if(diff > 4) {
    diff = 5;
  }

  this.paddle.move(diff);
};


// Object Constructor: Player
function Player() {
  this.paddle = new Paddle(200, 580, 100, 20);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Player.prototype.update = function() {
  var speed = 5;
  if (key[37]) {
    this.paddle.move(-speed);
  } else if (key[39]) {
    this.paddle.move(speed);
  }
};


// Object Constructor: Ball
function Ball() {
  var rand = randomBall();

  this.x = rand.x;
  this.y = 30;
  this.x_speed = rand.speed * rand.direc;
  this.y_speed = rand.speed + rand.basicSpeed;
  this.radius = 10;
}

Ball.prototype.render = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffff00';
  ctx.fill();
};

Ball.prototype.update = function(p1, p2) {
  this.x += this.x_speed;
  this.y += this.y_speed;

  var left_x = this.x - this.radius;
  var right_x = this.x + this.radius;
  var top_y = this.y - this.radius;
  var bottom_y = this.y + this.radius;
  var rand = randomBall();

  // if out of border, reset the ball
  if (this.y < 0) {
    player.paddle.score += 1; // player gains one point
    endGame();

    // player serves a ball
    this.x = rand.x;
    this.y = tableCanv.height - 30;
    this.x_speed = rand.speed * rand.direc;
    this.y_speed = (rand.speed + rand.basicSpeed) * -1;
  } else if (this.y > tableCanv.height) {
    computer.paddle.score += 1; // computer gains one point
    endGame();

    // computer serves a ball
    this.x = rand.x;
    this.y = 30;
    this.x_speed = rand.speed * rand.direc;
    this.y_speed = rand.speed + rand.basicSpeed;
  }

  // hit the left/right wall
  if (left_x < 0) {
    this.x = this.radius;
    this.x_speed = -this.x_speed;
  } else if (right_x > tableCanv.width) {
    this.x = tableCanv.width - this.radius;
    this.x_speed = -this.x_speed;
  }

  // ball is in player's range
  if (this.y > tableCanv.height / 2) {
    if (
      top_y <= p1.y + p1.height &&
      bottom_y >= p1.y &&
      right_x >= p1.x && // hit point of paddle
      left_x <= p1.x + p1.width // hit point of paddle
    ) {
      this.x_speed += p1.speed / 2;
      this.y_speed = -this.y_speed;
    }
  } else {  // ball is in computer's range
    if (
      top_y <= p2.y + p2.height &&
      bottom_y >= p2.y &&
      right_x >= p2.x && // hit point of paddle
      left_x <= p2.x + p2.width // hit point of paddle
    ) {
      this.x_speed += p2.speed / 2;
      this.y_speed = -this.y_speed;
    }
  }
};

function randomBall() {
  var obj = {};
  var arr = [-1, 1];

  obj.x = Math.floor(Math.random() * tableCanv.width);
  obj.speed = Math.floor(Math.random() * 2);
  obj.direc = arr[Math.floor(Math.random() * 2)];
  obj.basicSpeed = 6;
  return obj;
}

function endGame() {
  if (computer.paddle.score === 10 || player.paddle.score === 10) {
    stopAnimate();
    ctx.beginPath(); //
    ctx.fillStyle = '#eee'; //
    ctx.textAlign = 'center'; //
    ctx.textBaseline = 'middle'; //
    var w = tableCanv.width / 2;
    var h = tableCanv.height / 2;
    ctx.fillText('Game over', w, h);

    if (computer.paddle.score === 10) {
      ctx.fillText('Computer Wins!', w, h + 20);
    } else if (player.paddle.score === 10) {
      ctx.fillText('You Win!', w, h + 20);
    }
  }
}
