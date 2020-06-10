let mySnakeHead = document.querySelector(".my-snake-head"); //查询用户操作的蛇头元素

class Snake {
    constructor(positionX, positionY, speed, style, length) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.speed = speed;
        this.style = style;
        this.length = length;

        this.direction = 0; //蛇的前进方向  
        //this.lastDirection = 0; //上一次的方向

        this.body = new Array(length); //存储蛇身坐标
        for(let i = 0; i < this.length; i++) {
            this.body[i] = new Object(); //数组元素为对象，用以存储x,y坐标
        }
    }
    /**
     * @method 任意移动蛇
     * @param {object} divObj 要绑定的div对象
     */
    moveRandom(divObj) {
        this.body[0].lastDirection = this.direction;
        this.body[0].lastPositionX = this.positionX;
        this.body[0].lastPositionY = this.positionY;

        //产生一个随机方向，限制和上一次方向不能偏差太大
        let lastDirection = this.direction;
        do {
            this.direction = Math.random() * 2 * Math.PI; //产生一个0-2pi的任意弧度
        }while(Math.abs(this.direction - lastDirection) > 0.3); //控制转向，不能变化太大
        let offsetX = parseInt(this.speed * Math.cos(this.direction));
        let offsetY = parseInt(this.speed * Math.sin(this.direction));
        this.positionX += offsetX;
        this.positionY += offsetY;

        this.body[0].direction = this.direction;
        this.body[0].positionX = this.positionX;
        this.body[0].positionY = this.positionY;
        
        for (let i = 1; i < this.body.length; i++) {
            this.body[i].lastDirection = this.body[i].direction;
            this.body[i].lastPositionX = this.body[i].positionX;
            this.body[i].lastPositionY = this.body[i].positionY;

            this.body[i].direction = this.body[i - 1].lastDirection;
            this.body[i].positionX = this.body[i - 1].lastPositionX;
            this.body[i].positionY = this.body[i - 1].lastPositionY;
        }

        //重新创建蛇头，防止通过同一个对象修改样式，重排重绘
        let bodyDiv = [];
        bodyDiv[0] = document.createElement("div");
        bodyDiv[0].className = this.style[0]; //通过类名修改样式

        //重新创建蛇身
        this.length = this.length < 5 ? 5 : this.length;
        for (let i = 1; i < this.length; i++) {
            bodyDiv[i] = document.createElement("div");
            bodyDiv[i].className = this.style[1];
        }
        for (let i = 0; i < this.length; i++) {
            //旋转非常影响性能
            bodyDiv[i].style.transform = "rotate(" + parseInt(this.body[i].direction / Math.PI * 180) + "deg)";
            bodyDiv[i].style.left = this.body[i].positionX + "px";
            bodyDiv[i].style.top = this.body[i].positionY + "px";

            //绑定到新建的div上
            divObj.appendChild(bodyDiv[i]);
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
let styleList = [
                ["snake-head-1", "snake-body-1"],
                ["snake-head-2", "snake-body-2"],
                ["snake-head-3", "snake-body-3"],
                ["snake-head-4", "snake-body-4"],
                ["snake-head-5", "snake-body-5"]
                ];
let snakeList = [];
for (let i = 0; i < 10; i++) {
    let styleNum = parseInt(Math.random() * styleList.length);
    let snakeStyle = [styleList[styleNum][0], styleList[styleNum][1]];
    let snakeLength = parseInt(Math.random() * 50);
    snakeList[i] = new Snake(500, 500, 30, snakeStyle, 30);
}

let positionX = 0;
let positionY = 0;
let speedX = 0;
let speedY = 0;

let snakeTimer = setInterval(function () {
    let bgTmp = document.createElement("div");
    let bgBody = document.querySelector("#bg>div");
    for (let i = 0; i < snakeList.length; i++) {
        snakeList[i].moveRandom(bgTmp);
    }

    //移动背景
    positionX += speedX;
    positionY += speedY;
    bgTmp.style.left = positionX + "px";
    bgTmp.style.top = positionY + "px";

    //修改缓存来改变坐标，减少重排、重绘
    bgBody.parentNode.replaceChild(bgTmp, bgBody);
}, 40); //20ms刷新一次，50帧

document.onkeydown = function (event) {
    event = event || window.event;

    // 按键顺序，上、下、左、右
    if (event.keyCode == 87) {
        speedY = 30;
    } else if (event.keyCode == 83) {
        speedY = -30;
    }

    // 上下和左右不冲突，所以不用else if
    if (event.keyCode == 65) {
        speedX = 30;
    } else if (event.keyCode == 68) {
        speedX = -30;
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

/**
 * @method 获取元素计算样式
 * @param {object} obj 
 * @param {string} name 
 */
function getStyle(obj, name) {
    //正常浏览器的方式，具有getComputedStyle()方法，IE8的方式，没有getComputedStyle()方法
    return window.getComputedStyle ? getComputedStyle(obj, null)[name] : obj.currentStyle[name];
}