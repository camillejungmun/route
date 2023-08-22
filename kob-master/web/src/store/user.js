import $ from 'jquery';
export default {
  state: {
    id: "",
    username: "",
    photo: "",
    token: "",
    is_login: false,
    pulling_info:true, //表示当前是否在云端获取信息当中,正在拉取信息时不展示登录页面
  },
  getters: {
  },
  mutations: { //调用mutations里的函数用commit, 调用actions里的函数用dispatch
        updateUser(state,user) {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;

        },
        updateToken(state,token) {
            state.token = token;
        },
        //退出登录
        logout(state) {
            state.id = "";
            state.username = "";
            state.photo = "";
            state.token = "";
            state.is_login = false;
        },
        updatePullingInfo(state,pulling_info) {
          state.pulling_info = pulling_info;
        }
  },
  actions: { //异步操作全部放在actions里，同步放mutations里
    login(context, data) {
        $.ajax({ //登录
            url:"https://app5375.acapp.acwing.com.cn/api/user/account/token/",
            type:"post",
            data: { //data数据传给后端，后端返回resp
              username:data.username,
              password:data.password,
            },
            success(resp) { //在actions里调用mutations里的函数要用commit+字符串
              if(resp.error_message === "success") {
                localStorage.setItem("jwt_token",resp.token);//将token存入用户浏览器
                context.commit("updateToken",resp.token); //将token传到updateToken函数中
                data.success(resp); //成功或失败都要调用回调函数
              } else {
                 data.error(resp);
              }
            },
            error(resp) {
              data.error(resp);
            }
          });
    },
    //登录后，获取用户信息
    getinfo(context,data) {
        $.ajax({ //授权认证
            url:"https://app5375.acapp.acwing.com.cn/api/user/account/info/",
            type: "get",
            headers: { //需要传一个表头，到后端filter中,  当访问的后端的api需要授权时，就需要加表头,也就是访问filter中非公开链接时
                Authorization:"Bearer " + context.state.token,
            },
            success(resp) {
                if(resp.error_message === "success") {
                    context.commit("updateUser", {
                        ...resp, //解析resp中的内容,也就是把resp的内容放到当前对象里
                        is_login: true,
                    });
                    data.success(resp);
                } else {
                    data.error(resp);
                }

            },
            error(resp) {
                data.error(resp);
            }
        });
    },
    logout(context) {
      localStorage.removeItem("jwt_token");
        context.commit("logout");
    }


  },
  modules: {
  }
}
