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
}

// Object Constructor: Paddle
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Paddle.prototype.render = function() {
  ctx.fillStyle = '#662200';
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(speed) {
  this.x += speed;

  if (this.x < 0) { // hit the left wall
    this.x = 0;
  } else if (this.x + this.width > tableCanv.width) {
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
  var speed = 10;
  if (key[37]) {
    this.paddle.move(-speed);
  } else if (key[39]) {
    this.paddle.move(speed);
  } else {
    this.paddle.move(0);
  }
};


// Object Constructor: Ball
function Ball() {
  this.x = 250;
  this.y = 30;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 10;
}

Ball.prototype.render = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffff00';
  ctx.fill();
};
