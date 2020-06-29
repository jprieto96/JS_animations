var width = 520,
    height = 500,
    gLoop,
    c = document.getElementById('c'),
    ctx = c.getContext('2d');
    
c.width = width;
c.height = height;

var clear = function () {
    ctx.fillStyle = '#00A3E9';
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
}

var howManyCircles = 10,
    circles = [];
for (var i = 0; i < howManyCircles; i++) {
    circles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);
}

var DrawCircles = function () {
    for (var i = 0; i < howManyCircles; i++) {
        ctx.fillStyle = 'rgba(0, 255, 255, ' + circles[i][3] + ')';
        ctx.beginPath();
        ctx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
};

var GameLoop = function () {
    clear();
    DrawCircles();
    gLoop = setTimeout(GameLoop, 1000 / 50);
}

var player = new(function () {
    var that = this;
    that.image = new Image();

    that.image.src = "seta.png";
    that.width = 80;
    that.height = 80;
    that.frames = 1;
    that.actualFrame = 0;
    that.X = 0;
    that.Y = 0;

    that.isJumping = false;
    that.isFalling = false;
    that.jumpSpeed = 0;
    that.fallSpeed = 0;

    that.jump = function () {
        if (!that.isJumping && !that.isFalling) {
            that.fallSpeed = 0;
            that.isJumping = true;
            that.jumpSpeed = 25;
        }
    }
    that.checkJump = function () {
        that.setPosition(that.X, that.Y - that.jumpSpeed);
        that.jumpSpeed--;
        if (that.jumpSpeed == 0) {
            that.isJumping = false;
            that.isFalling = true;
            that.fallSpeed = 1;
        }
    }

    that.fallStop = function () {
        that.isFalling = false;
        that.fallSpeed = 0;
        that.jump();
    }

    that.checkFall = function () {
        if (that.Y < height - that.height) {
            that.setPosition(that.X, that.Y + that.fallSpeed);
            that.fallSpeed++;
        } else {
            that.fallStop();
        }
    }

    that.moveLeft = function () {
        if (that.X > 0) {
            that.setPosition(that.X - 5, that.Y);
        }
    }

    that.moveRight = function () {
        if (that.X + that.width < width) {
            that.setPosition(that.X + 5, that.Y);
        }
    }


    that.setPosition = function (x, y) {
        that.X = x;
        that.Y = y;
    }

    that.interval = 0;
    that.draw = function () {
        try {
            ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
        } catch (e) {

        }
    }
})();
player.setPosition(~~((width - player.width) / 2), ~~((height - player.height) / 2));

player.jump();

document.onmousemove = function (e) {
    if (player.X + c.offsetLeft > e.pageX) {
        player.moveLeft();
    } else if (player.X + c.offsetLeft < e.pageX) {
        player.moveRight();
    }
}

GameLoop = function () {
    clear();
    DrawCircles();
    if (player.isJumping)
        player.checkJump();
    if (player.isFalling)
        player.checkFall();
    player.draw();
    gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();
