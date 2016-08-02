window.onload = function() {
  table();
  render();
};

var tableCanv = document.getElementById('table');
var ctx = tableCanv.getContext('2d');

function table() {
  ctx.fillStyle = '#8fc5f1';
  ctx.fillRect(0, 0, 600, 500);
}

function Computer() {
  this.color = '#662200';
  this.xPos = 250;
  this.yPos = 0;
  this.width = 100;
  this.height = 20;
  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  };
}

function Player() {
  this.color = '#662200';
  this.xPos = 250;
  this.yPos = 480;
  this.width = 100;
  this.height = 20;
  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
  };
}

function Paddle(constructor) {
  var paddle = new constructor();
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
}

function Ball() {
  this.color = '#ffff00';
  this.xPos = 300;
  this.yPos = 30;
  this.radius = 10;
  this.render = function() {
    ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  };
}

function render() {
  var computer = new Computer();
  var player = new Player();
  var ball = new Ball();

  computer.render();
  player.render();
  ball.render();
}
