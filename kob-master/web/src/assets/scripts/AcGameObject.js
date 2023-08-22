const AC_GAME_OBJECTS = []; //为了在每一帧都将所有游戏对象刷新一遍，先将它们存下来

export class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0;
        this.has_called_start = false;
    }

    start() {

    }

    update() { //每一帧执行一次，除了第一帧

    }

    on_destroy() { //删除之前执行

    }

    destroy() {
        this.on_destroy();

        for(let i in AC_GAME_OBJECTS) {
            const obj = AC_GAME_OBJECTS[i];
            if(obj === this) {
                AC_GAME_OBJECTS.splice(i); //js删除数组元素
                break;
            }
        }
    }
}

let last_timestamp = 0;
const step = timestamp => {
    for(let obj of AC_GAME_OBJECTS) {
        if(!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step)
}

requestAnimationFrame(step)//requestAnimationFrame () 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画