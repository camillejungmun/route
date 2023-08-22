<template>
    <ContentField v-if="!$store.state.user.pulling_info">
        <div class="row justify-content-md-center" >
            <div class="col-3">
                <form @submit.prevent="login">
                    <div class="mb-3">
                    <label for="用户名" class="form-label">用户名</label>
                    <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                    <label  for="password" class="form-label">密码</label>
                    <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                    </div>                    
                    <div class="error-message">{{ error_message }}</div>
                    <button type="summit" class="btn btn-primary">提交</button> <!--summit类型提交表单-->
                </form>
            </div>
        </div>
    </ContentField>
</template>

<script>
import ContentField from '../../../components/ContentField.vue'
import {useStore} from 'vuex'; //引入全局变量
import { ref } from 'vue';
import router from '@/router/index';
export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let error_message = ref('');
        
        const jwt_token = localStorage.getItem("jwt_token");
        if(jwt_token) { //如果浏览器存在token
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {
                success() {
                   router.push({name: "home"});//当刷新后，就会自动跳转到首页
                   store.commit("updatePullingInfo",false);
               }, 
                error() {
                    store.commit("updatePullingInfo",false);
                  }
            });
        } else {
            store.commit("updatePullingInfo",false);
        }
        const login = () => {
            error_message.value ="";
            store.dispatch("login", {//想调用actions里的函数就要用dispatch
                username: username.value,
                password: password.value,
                success() { //成功则调用user.js里的获取信息回调函数,同时跳转
                    store.dispatch("getinfo", {
                        success() {
                            router.push({name: 'home'}); //如果用户名与密码匹配，则跳转到登录页面           
                        }
                    })
                   
                },
                error() {
                    error_message.value = "用户名或密码错误"
                }
            })
        }
        return {
            username,
            password,
            error_message,
            login,
        }
    }
}
</script>

<style scoped>

button {
    width: 100%;
}
div.error-message {
    color:red;
}
</style>