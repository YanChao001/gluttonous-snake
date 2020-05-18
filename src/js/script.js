let mySnakeHead = document.querySelector(".my-snake-head"); //查询用户操作的蛇头元素

class Snake {
    constructor(positionX, positionY, speed, style, length) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        this.style = style;
        this.length = length;
        this.body = new Array(length); //存储蛇身坐标，坐标不要添加在div上
        this.bodyDiv = new Array(length);
        this.direction = 0; //蛇的前进方向  
        this.lastDirection = 0; //上一次的方向

        for(let i = 0; i < this.length; i++) {
            this.body[i] = new Object(); //数组元素为对象，用以存储x,y坐标
        }
    }
    //蛇任意移动
    moveRandom() {
        //产生一个随机方向，限制和上一次方向不能偏差太大
        this.lastDirection = this.direction;
        do {
            this.direction = Math.random() * 2 * Math.PI; //产生一个0-2pi的任意弧度
        }while(Math.abs(this.direction - this.lastDirection) > 0.5); //控制转向，不能变化太大

        let offsetX = parseInt(this.speed * Math.cos(this.direction));
        let offsetY = parseInt(this.speed * Math.sin(this.direction));

        this.body[0].lastPositionX = this.positionX;
        this.body[0].lastPositionY = this.positionY;
        this.positionX += offsetX;
        this.positionY += offsetY;
        this.body[0].positionX = this.positionX;
        this.body[0].positionY = this.positionY;
        
        for (let i = 1; i < this.body.length; i++) {
            this.body[i].lastPositionX = this.body[i].positionX;
            this.body[i].lastPositionY = this.body[i].positionY;

            this.body[i].positionX = this.body[i - 1].lastPositionX;
            this.body[i].positionY = this.body[i - 1].lastPositionY;
        }

        //重新创建蛇头，防止通过同一个对象修改样式，重排重绘
        this.bodyDiv[0] = document.createElement("div");
        this.bodyDiv[0].className = "snake-head-1"; //通过类名修改样式

        //重新创建蛇身
        this.length = this.length < 5 ? 5 : this.length;
        for (let i = 1; i < this.length; i++) {
            this.bodyDiv[i] = document.createElement("div");
            this.bodyDiv[i].className = "snake-body-1";
        }
        for (let i = 0; i < this.length; i++) {
            this.bodyDiv[i].style.left = this.body[i].positionX + "px";
            this.bodyDiv[i].style.top = this.body[i].positionY + "px";
        }
    }
    //创建的蛇对象绑定到div上
    snakeAppend(divObj) {
        for(let i = 0; i < this.body.length; i++)
        {
            divObj.appendChild(this.bodyDiv[i]);
        }
    }
    //增加长度和粗度
    growBody() {

    }
    //判断是否死亡
    judgeDead() {

    }
}

//实例化蛇类
let snakeList = [];
for (let i = 0; i < 1000; i++) {
    snakeList[i] = new Snake(500, 500, 30, 1, 30);
}

let snakeTimer = setInterval(function () {
    //修改缓存来改变坐标，减少重排、重绘
    let bgTmp = document.createElement("div");
    let bgBody = document.querySelector("#bg>div");
    for (let i = 0; i < snakeList.length; i++) {
        snakeList[i].moveRandom();
        snakeList[i].snakeAppend(bgTmp);
    }
    bgBody.parentNode.replaceChild(bgTmp, bgBody);
}, 100);

let speedX = 0;
let speedY = 0;

document.onkeydown = function (event) {
    event = event || window.event;

    // 按键顺序，上、下、左、右
    if (event.keyCode == 87) {
        speedY = 20;
    } else if (event.keyCode == 83) {
        speedY = -20;
    }

    // 上下和左右不冲突，所以不用else if
    if (event.keyCode == 65) {
        speedX = 20;
    } else if (event.keyCode == 68) {
        speedX = -20;
    }
}
document.onkeyup = function (event) {
    event = event || window.event;

    if (event.keyCode == 87) {
        speedY = 0;
    } else if (event.keyCode == 83) {
        speedY = 0;
    }

    if (event.keyCode == 65) {
        speedX = 0;
    } else if (event.keyCode == 68) {
        speedX = 0;
    }
}

let positionX = 0;
let positionY = 0;

bgTimer = setInterval( function () {
    positionX += speedX;
    positionY += speedY;
    //bgBody.style.left = positionX + "px";
    //bgBody.style.top = positionY + "px";
}, 20);

/**
 * @method 获取元素计算样式
 * @param {object} obj 
 * @param {string} name 
 */
function getStyle(obj, name) {
    //正常浏览器的方式，具有getComputedStyle()方法，IE8的方式，没有getComputedStyle()方法
    return window.getComputedStyle ? getComputedStyle(obj, null)[name] : obj.currentStyle[name];
}