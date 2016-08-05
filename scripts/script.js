window.onload = function() {
  animate(step);
};

var tableCanv = document.getElementById('table');
var ctx = tableCanv.getContext('2d');
tableCanv.width = tableCanv.getAttribute('width');
tableCanv.height = tableCanv.getAttribute('height');

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

function step() {
  update();
  render();
  animate(step);
}

function render() {
  // Render Table
  ctx.fillStyle = '#8fc5f1';
  ctx.fillRect(0, 0, tableCanv.width, tableCanv.height);

  computer.render();
  player.render();
  ball.render();
}

function update() {
  player.update();
  ball.update(player.paddle, computer.paddle);
}

// Object Constructor: Paddle
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = 0;
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

  // if out of border, reset the ball
  if (this.y < 0 || this.y > tableCanv.height) {
    var rand = randomBall();

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

  if (this.y > tableCanv.height / 2) {
    if (
      bottom_y >= p1.y &&
      right_x >= p1.x && // when hit point of paddle
      left_x <= p1.x + p1.width // when hit point of paddle
    ) {
      this.x_speed += p1.speed / 2;
      this.y_speed = -this.y_speed;
    }
  } else {
    if (
      top_y <= p2.y &&
      right_x >= p2.x &&
      left_x <= p2.x + p2.width
    ) {
      this.x_speed += p2.speed / 2;
      this.y_speed = this.y_speed;
    }
  }
};

function randomBall() {
  var obj = {};
  var arr = [-1, 1];

  obj.x = Math.floor(Math.random() * tableCanv.width);
  obj.speed = Math.floor(Math.random() * 3);
  obj.direc = arr[Math.floor(Math.random() * 2)];
  obj.basicSpeed = 3;
  return obj;
}
