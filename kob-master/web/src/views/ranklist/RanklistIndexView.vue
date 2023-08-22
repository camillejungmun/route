<template>
    <ContentField>
        <table class="table table-striped table-hover" >
            <thead>
                <tr>
                    <th>玩家</th>
                    <th>天梯积分</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>
                        <img :src="user.photo" alt="" class="record-user-photo">
                        &nbsp; <!--空格-->
                        <span class="record-user-username">{{ user.username}}</span>
                    </td>
                    <td>{{ user.rating }}</td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="...">
        <ul class="pagination" style="float: right">
            <li class="page-item " @click="click_page(-2)">
            <a class="page-link" href="#">前一页</a>
            </li>   <!--page-item 后面要加上空格，因为新添加了类名，不加空格会连在一起-->
            <li :class="'page-item ' + page.is_active" v-for="page in pages" :key="page.number" @click="click_page(page.number)"> 
                <a class="page-link" href="#">{{ page.number }}</a>
            </li>
            <li class="page-item" @click="click_page(-1)">
                <a class="page-link" href="#">后一页</a>
            </li>
        </ul>
        </nav>
    </ContentField>
</template>

<script>
import ContentField from '../../components/ContentField.vue'
import {useStore} from 'vuex';
import {ref} from 'vue';
import $ from 'jquery'

export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        let users = ref([]);
        let current_page = 1; //初始页面等于1
        let total_users = 0; //总对局数量
        let pages = ref([]);//存页数

        const click_page = page => {
            if(page === -2) page = current_page - 1;
            else if(page === -1) page = current_page + 1;
            let max_pages = parseInt(Math.ceil(total_users / 10)); //排行榜每页三个数
            //如果合法，则加载一个新的page
            if(page >= 1 && page <= max_pages) {
                pull_page(page);
            }

        }
        const update_pages = () => {
            let max_pages = parseInt(Math.ceil(total_users / 10)); //Math.ceil返回大于等于该数的至于许欸整数
            let new_pages = [];
            for(let i = current_page - 2;i <= current_page + 2;i ++) { //展示前后两页
                if(i >= 1 && i <= max_pages) {
                    new_pages.push({
                        number: i,
                        is_active: i === current_page ? "active" : "", //判断i是否是当前页面
                    });
                }
            }
            pages.value = new_pages;
        }

        const pull_page = page => {
            current_page = page; //当前在第page个页面
            $.ajax({
                url: "https://app5375.acapp.acwing.com.cn/api/ranklist/getlist/",
                data: { //传给后端当前是第几页
                    page,
                },
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    users.value = resp.users;
                    total_users = resp.users_count;
                    update_pages(); //每次从前端返回完信息后，都要更新页面
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }
        pull_page(current_page);

        
        return {
            users,
            pages,
            click_page,
        }
    }
}
</script>

<style scoped>
img.record-user-photo {
    width: 5vh;
    border-radius: 50%;
}
</style>