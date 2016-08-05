window.onload = function() {
  render();
};

var tableCanv = document.getElementById('table');
var ctx = tableCanv.getContext('2d');
tableCanv.width = tableCanv.getAttribute('width');
tableCanv.height = tableCanv.getAttribute('height');

// Build objects
var computer = new Computer();
var player = new Player();
var ball = new Ball();


function render() {
  // Render Table
  ctx.fillStyle = '#8fc5f1';
  ctx.fillRect(0, 0, tableCanv.width, tableCanv.height);

  computer.render();
  player.render();
  ball.render();
}

// Object Constructor: Paddle
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
}

Paddle.prototype.render = function() {
  ctx.fillStyle = '#662200';
  ctx.fillRect(this.x, this.y, this.width, this.height);
};


// Object Constructor: Computer
function Computer() {
  this.paddle = new Paddle(250, 0, 100, 20);
}

Computer.prototype.render = function() {
  this.paddle.render();
};


// Object Constructor: Player
function Player() {
  this.paddle = new Paddle(250, 480, 100, 20);
}

Player.prototype.render = function() {
  this.paddle.render();
};


// Object Constructor: Ball
function Ball() {
  this.x = 300;
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
