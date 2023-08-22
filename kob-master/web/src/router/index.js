import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '../views/pk/PkIndexView'
import RanklistIndexView from '../views/ranklist/RanklistIndexView'
import RecordIndexView from '../views/record/RecordIndexView';
import RecordContentView from '../views/record/RecordContentView';
import UserBotIndexView from '../views/user/bot/UserBotIndexView';
import NotFound from '../views/error/NotFound';
import UserAccountLoginView from '../views/user/account/UserAccountLoginView';
import UserAccountRegisterView from '../views/user/account/UserAccountRegisterView';
import TheInstructionsView from '../views/Instruction/TheInstructionsView';
import store from '../store/index';
const routes = [
  { //如果是根路径，直接重定向到pk页面
    path:'/',
    name: "home",
    redirect: "/pk/",
    meta: {  //存储额外信息，名字随便定义
      requestAuth: true, // 进入该页面是否需要授权，也就是是否是登录状态
    }
  },
  {
    path:"/pk/", //路径是pk时显示PkIndexView组件
    name: "pk_index", //给路径随便起个名字
    component: PkIndexView,
    meta: {  
      requestAuth: true, 
    }
  },
  {
    path:"/record/", 
    name: "record_index", 
    component: RecordIndexView,
    meta: {  
      requestAuth: true, 
    }
  },
  { //展示录像的内容
    path:"/record/:recordId", 
    name: "record_content", 
    component: RecordContentView,
    meta: {  
      requestAuth: true, 
    }
  },
  {
    path:"/ranklist/", 
    name: "ranklist_index", 
    component: RanklistIndexView,
    meta: {  
      requestAuth: false,  //不授权也能进入该页面
    }
  } ,
  {
    path:"/user/bot/", 
    name: "user_bot_index", 
    component: UserBotIndexView,
    meta: {  
      requestAuth: true, 
    }
  },
  {
    path:"/user/account/login/", 
    name: "user_account_login", 
    component: UserAccountLoginView,
    meta: {  
      requestAuth: false, 
    }
  },
  {
    path:"/user/account/register", 
    name: "user_account_register", 
    component: UserAccountRegisterView,
    meta: {  
      requestAuth: false, 
    }
  },
  {
    path:"/instructions/", 
    name: "instruction_index", 
    component: TheInstructionsView,
    meta: {  
      requestAuth: false, 
    }
  },
  {
    path:"/404/", 
    name: "404", 
    component: NotFound,
    meta: {  
      requestAuth: false, 
    }
  },

  {
    path:"/:catchAll(.*)",
    redirect:"/404/",
  } ,     
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
//to表示跳转到哪个页面,form表示从哪个页面跳转过去的,next表示将页面要不要执行下一边操作
router.beforeEach((to,form,next) => { //该api在通过router进入到某个页面前，会执行该函数
  if(to.meta.requestAuth && !store.state.user.is_login) {
    next({name: "user_account_login"});
  } else {
    next();
  }
})

export default router
