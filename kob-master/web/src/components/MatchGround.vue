<template>
    <div class ="matchground">
        <div class="row">
            <div class="col-4">
                <div class="user-photo">
                <img :src="$store.state.user.photo" alt="">
                </div>
                <div class="user-username">
                    {{$store.state.user.username}}
                </div>
            </div>
             <div class="col-4">
                <div class="user-select-bot"> <!-- v-model 是 vue 的双向绑定的指令，能将页面上控件输入的值同步更新到相关绑定的data属性，也会在更新data绑定属性时候，更新页面上输入控件的值。-->
                    <select v-model="select_bot" class="form-select" aria-label="Default select example">
                        <option value="-1" selected>御驾亲征</option>
                        <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                            {{bot.title}}
                        </option>
                    </select>
                </div>
             </div>
            <div class="col-4">
                <div class="user-photo">
                <img :src="$store.state.pk.opponent_photo" alt="">
                </div>
                <div class="user-username">
                    {{ $store.state.pk.opponent_username }}
                </div>
            </div>
            <div class="col-12" style="text-align: center; padding-top: 15vh;">
                <button @click="click_match_btn" type="button" class="btn btn-success btn-lg">{{match_btn_info}}</button>
            </div>
        </div>
    </div>
</template>


<script>
import {ref} from 'vue'
import {useStore} from 'vuex';
import $ from 'jquery';
export default {
    setup() {
        const store = useStore();
        let match_btn_info = ref("开始匹配");
        let bots = ref([]); //存储bot列表
        let select_bot = ref("-1"); //双向数据绑定
        const click_match_btn = () => {
            if (match_btn_info.value === "开始匹配") {
                match_btn_info.value = "取消";
                store.state.pk.socket.send(JSON.stringify({//向后端发送一个字符串
                    event: "start-matching",
                    bot_id: select_bot.value,
                }));
            } else {
                match_btn_info.value = "开始匹配";
                store.state.pk.socket.send(JSON.stringify({
                    event: "stop-matching",
                }));
            }
        }

        const refresh_bots = () => { //动态获取bot列表
            $.ajax({
                url: "https://app5375.acapp.acwing.com.cn/api/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                }
            })
        }

        refresh_bots(); //从云端动态获取bots
        return {
        match_btn_info,
        click_match_btn,
        bots,
        select_bot,
        }
    }

}
</script>

<style scoped>
div.matchground {
    width: 60vw;
    height: 70vh;
    margin:40px auto;
    background-color:rgba(50 ,50 ,50 ,0.5 )
}

div.user-photo {
    text-align: center; /*块级元素居中*/
    padding-top: 10vh;
}
div.user-photo > img {
    border-radius: 50%;
    width: 20vh;
}
div.user-username {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    color:white;
    padding-top: 1vh;
}
div.user-select-bot {
    padding-top: 20vh;
}
div.user-select-bot > select {
    width:60%;
    margin:0 auto;
}
</style>