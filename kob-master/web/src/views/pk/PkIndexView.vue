<template>
<!--展示玩家所在位置-->
<div v-if="$store.state.pk.status === 'playing'">
    <div class="user-color" v-if="parseInt($store.state.user.id) === parseInt($store.state.pk.a_id)">我竟然在左下角</div>
    <div class="user-color" v-else-if="parseInt($store.state.user.id) === parseInt($store.state.pk.b_id)">我竟然在右上角</div>
</div>

<!--引用全局变量: 如果在script 也就是js里写时不用加$符号， 但在<template>里写就要加$-->
 <PlayGround v-if="$store.state.pk.status === 'playing'"/> 
 <MatchGround v-if="$store.state.pk.status === 'matching'"/>
 <ResultBoard v-if="$store.state.pk.loser != 'none'" />
<<<<<<< HEAD
 <div class="user-color" v-if="$store.state.pk.status === 'playing' && parseInt($store.state.user.id) === parseInt($store.state.pk.a_id)">我方在左下角</div>
 <div class="user-color" v-if="$store.state.pk.status === 'playing' && parseInt($store.state.user.id) === parseInt($store.state.pk.b_id)">我方在右上角</div>
=======

>>>>>>> 88a3d4ec22506404fced027f6392ac2aa37d9176
</template>

<script>
import PlayGround from '../../components/PlayGround.vue'
import {onMounted, onUnmounted} from 'vue' //onUnmounted表示当组件被卸载后执行
import {useStore} from 'vuex'
import MatchGround from '../../components/MatchGround.vue'
import ResultBoard from '../../components/ResultBoard.vue'
export default {
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
},
    setup() {
        const store = useStore();     //websocket没有jwt的概念，所以不用表头，token可以用链接传过去
        const socketUrl = `wss://app5375.acapp.acwing.com.cn/websocket/${store.state.user.token}/`;
        store.commit("updateLoser", "none");
        store.commit("updateIsRecord",false);
        let socket = null;
        onMounted(() => {
            
            store.commit("updateOpponent", {
                username: "对手竟是我自己",
                photo:"https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png"
            })
            socket = new WebSocket(socketUrl); //创建一个链接

            socket.onopen = () => { //当进入到页面时执行
                console.log("connected!");
                store.commit("updateSocket",socket); //登录时，把socket存进全局变量中1
            }

            socket.onmessage = msg => { //该函数要传入信息参数
                const data = JSON.parse(msg.data); //spring传来的数据是在.data中
                if(data.event === "start-matching") { //匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    setTimeout(() => {
                        store.commit("updateStatus","playing");
                    },2000)
                    store.commit("updateGame",data.game);//传入game全部信息
                } else if(data.event === "move") {
                    console.log(data);
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
               } else if(data.event === "result") {
                    console.log(data);
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;

                    if(data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    }
                    if(data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser); //出现后更新状态
               }
            } 

            socket.onclose = () => { //当关闭时执行的函数
                console.log("disconnected");
            }
        });

        onUnmounted(() => { 
            socket.close(); //如果没在卸载后断开连接，就会产生很多冗余连接, 像改变页面这类的，就会卸载当前页面
            store.commit("updateStatus","matching"); //刷新即认输
        })
    }
}
</script>

<style scoped>
<<<<<<< HEAD

div.user-color{
    text-align: center;
    color: red;
    font-size: 45px;
=======
div.user-color {
    text-align: center;
    color: white;
    font-size: 30px;
>>>>>>> 88a3d4ec22506404fced027f6392ac2aa37d9176
    font-weight: 600;
}
</style>