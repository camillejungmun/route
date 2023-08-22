import { setInterval } from "core-js";
import { AcGameObject } from "./AcGameObject";//这里因为是AcGameObject  export得到的，需要用花括号，
import { Snake } from "./Snake";
                                                //但如果是export default 就不用括号,同时 导入类时可以重命名
import { Wall } from "./Wall";                                                
export class GameMap extends AcGameObject {
    constructor(ctx, parent,store) { //导入画布和父元素
        super();
        
        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        //存格子的绝对距离，其它都为相对距离
        this.L = 0;

        this.rows = 13;
        this.cols = 14;
        this.inner_walls_count = 20;
        this.walls = []; //存储所有墙
        
        this.snakes = [
            new Snake({id: 0, color: "red",r: this.rows - 2, c : 1}, this),
            new Snake({id: 1, color: "blue", r: 1, c: this.cols - 2}, this),
        ]
                
    }

    // check_connecticity(g, sx,sy, tx,ty) {// floodfill算法
    //     if(sx == tx && sy == ty) return true;
    //     g[sx][sy] = true;

    //     let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
    //     for(let i = 0;i < 4;i ++) {
    //         let x = sx + dx[i], y = sy + dy[i];
    //         if(!g[x][y] && this.check_connecticity(g, x, y, tx, ty))
    //             return true;
    //     }

    //     return false;
    // }

    create_walls() {
        // const g = [];
        // for(let r = 0; r < this.rows;r ++) { //相当于初始化一个布尔数组
        //     g[r] = [];
        //     for(let c = 0;c < this.cols;c ++) {
        //         g[r][c] = false;
        //     }
        // }

        // //给四周加上障碍物
        // for(let r = 0;r < this.rows;r ++) {
        //     g[r][0] = g[r][this.cols - 1] = true;
        // }

        // for(let c = 0;c < this.cols;c ++ ) {
        //     g[0][c] = g[this.rows - 1][c] = true;
        // }

        // //创建随机障碍物
        // for(let i = 0;i < this.inner_walls_count;i ++) {
        //     for(let j = 0;j < 1000;j ++) {
        //         let r = parseInt(Math.random() * this.rows);
        //         let c = parseInt(Math.random() * this.cols);
        //         if(g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;
        //         if(r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
        //             continue;
        //         g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
        //         break;
        //     }
        // }
        // //深度复制一个对象: 先转化为JSON,再把JSON解析出来
        // const copy_g = JSON.parse(JSON.stringify(g));
        // if(!this.check_connecticity(copy_g,this.rows - 2, 1, 1, this.cols - 2)) return false;
        //放墙

        const g = this.store.state.pk.gamemap;
        for(let r = 0;r < this.rows;r ++) {
            for(let c = 0;c < this.cols;c ++)
                if(g[r][c]) {
                    this.walls.push(new Wall(r,c,this));
                }
        }
    }

    add_listrning_events() {
        //如果是录像
        if(this.store.state.record.is_record) {
            let k = 0;
            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;
            const interval_id = setInterval(() => { //每300毫秒执行一次，走一步
                if(k >= a_steps.length - 1) { //最后一步，即死亡

                    if(loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if(loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    
                    clearInterval(interval_id); //结束后，取消循环
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                }
                k ++;
            }, 300);
        } else {
            this.ctx.canvas.focus(); //绑定聚焦

            this.ctx.canvas.addEventListener("keydown", e => {
                let d = -1;
                if(e.key === 'w') d = 0;
                else if(e.key === 'd') d = 1;
                else if(e.key === 's') d = 2;
                else if(e.key === 'a') d = 3;
                else if(e.key === "ArrowUp") d = 0;
                else if(e.key === "ArrowRight") d = 1;
                else if(e.key === "ArrowDown") d  = 2;
                else if(e.key === "ArrowLeft") d =  3;
    
                if(d >= 0) { //当有输入时，向后端传递
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move",
                        direction: d,
                    }));
    
                }
            });
        }
        
    }
    start() {
        this.create_walls();
         this.add_listrning_events(); 
    }

    update_size() { //clientHeight 用于求div的长宽
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight/ this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {//判断两条蛇是否都准备好下一回合了
        for(const snake of this.snakes) {
            if(snake.status !== "idle") return false;
            if(snake.direction === -1) return false;
        } 
        return true;
    }

    next_step() { //让两条蛇进入下一回合
        for(const snake of this.snakes) {
            snake.next_step();
        }
    }

    check_valid(cell) {  // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c)
                return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {  // 当蛇尾会前进的时候，蛇尾不要判断
                k -- ;
            }
            for (let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }

        return true;
    }


    update() {
        this.update_size(); //每一帧都更新大小
        if(this.check_ready()) {
            this.next_step();
        }
        this.render();   
    }

    render() {
        const color_even ="#DDDDDD", color_odd = "#EFEFEF"; //画地图
        for(let r = 0;r < this.rows; r ++) {
            for(let c = 0;c < this.cols ;c ++) {
                if((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L,this.L);
            }
        }
    
}                                                
}