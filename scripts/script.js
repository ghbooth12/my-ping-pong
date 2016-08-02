window.onload = function() {
  render();
  movePaddle();
  // animate(step);
};

var tableCanv = document.getElementById('table');
var ctx = tableCanv.getContext('2d');
var widthCanv = tableCanv.getAttribute('width');
var heightCanv = tableCanv.getAttribute('height');

var computer = new Computer();
var player = new Player();
var ball = new Ball();
// var paddle = new Paddle();

function table() {
  ctx.fillStyle = '#8fc5f1';
  ctx.fillRect(0, 0, widthCanv, heightCanv);
}

function Computer() {
  this.color = '#662200';
  this.posX = 250;
  this.posY = 0;
  this.width = 100;
  this.height = 20;
  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  };
}

function Player() {
  this.color = '#662200';
  this.posX = 250;
  this.posY = 480;
  this.width = 100;
  this.height = 20;
  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.posX, this.posY, this.width, this.height);
  };
}

// function Paddle() {
//   this.speed = 10;
//   this.move = function() {
//     window.addEventListener('keypress', function(event) {
//       if (event.keyCode == 37) {
//         console.log("left arrow");
//         player.posX -= 10;
//       } else if (event.keyCode == 39) {
//         console.log("right arrow");
//         player.posY += 10;
//       }
//     });
//   };
// }

function Ball() {
  this.color = '#ffff00';
  this.posX = 300;
  this.posY = 30;
  this.radius = 10;
  this.render = function() {
    ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  };
}

// var animate = window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame    ||
//         window.oRequestAnimationFrame      ||
//         window.msRequestAnimationFrame     ||
//         function(callback) { window.setTimeout(callback, 1000/60) };
//
// function step() {
//   movePaddle();
//   animate(step);
// }

function render() {
  table();
  computer.render();
  ball.render();
}

function movePaddle() {
  var speed = 50;
  var leftKey = 44;
  var rightKey = 46;
  player.render();

  window.addEventListener('keypress', function(e) {
    console.log(e.keyCode); // For testing
    if (e.keyCode == leftKey) {
      ctx.clearRect(player.posX, player.posY, player.width, player.height);
      render();
      if (player.posX >= player.width / 2) {
        player.posX -= speed;
      }
      player.render();
    } else if (e.keyCode == rightKey) {
      ctx.clearRect(player.posX, player.posY, player.width, player.height);
      render();
      if (player.posX < (widthCanv - player.width)) {
        player.posX += speed;
      }
      player.render();
    }
  });
}
