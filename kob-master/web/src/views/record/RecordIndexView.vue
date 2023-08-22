<template>
    <ContentField>
        <table class="table table-striped table-hover " >
            <thead >
                <tr>
                    <th>A</th>
                    <th>B</th>
                    <th>对战结果</th>
                    <th>对战时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in records" :key="record.record.id">
                    <td>
                        <img :src="record.a_photo" alt="" class="record-user-photo">
                        &nbsp; <!--空格-->
                        <span class="record-user-username">{{ record.a_username}}</span>
                    </td>
                    <td>
                        <img :src="record.b_photo" alt="" class="record-user-photo">
                        &nbsp;
                        <span class="record-user-username">{{ record.b_username}}</span>
                    </td>  
                    <td>{{ record.result }}</td>
                    <td>{{ record.record.createtime}}</td>
                    <td>                          
                        <button @click="open_record_content(record.record.id)" type="button" class="btn btn-primary">查看录像</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="...">
        <ul class="pagination" style="float: right">
            <li class="page-item" @click="click_page(-2)">
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
import router from '../../router/index'

export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        let records = ref([]);
        let current_page = 1; //初始页面等于1
        let total_records = 0; //总对局数量
        let pages = ref([]);//存页数

        const click_page = page => {
            if(page === -2) page = current_page - 1;
            else if(page === -1) page = current_page + 1;
            let max_pages = parseInt(Math.ceil(total_records / 10));
            //如果合法，则加载一个新的page
            if(page >= 1 && page <= max_pages) {
                pull_page(page);
            }

        }
        const update_pages = () => {
            let max_pages = parseInt(Math.ceil(total_records / 10)); //Math.ceil返回大于等于该数的至于许欸整数
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
                url: "https://app5375.acapp.acwing.com.cn/api/record/getlist/",
                data: { //传给后端当前是第几页
                    page,
                },
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    records.value = resp.records;
                    total_records = resp.records_count;
                    update_pages(); //每次从前端返回完信息后，都要更新页面
                },
                error(resp) {
                    console.log(resp);
                }
            })
        }
        pull_page(current_page);

        const stringTo2D= map => { //将一维字符串转化为二维数组
            let g = [];
            for(let i = 0, k = 0;i < 13;i ++) {
                let line = [];
                for(let j = 0;j < 14;j ++,k ++) {
                    if(map[k] === '0') line.push(0);
                    else line.push(1);
                }
                g.push(line);
            }
            return g;
        }
        const open_record_content = recordId => {
            for(const record of records.value) {
                if(record.record.id === recordId) {
                    store.commit("updateIsRecord",true);
                    store.commit("updateGame", {
                        map: stringTo2D(record.record.map),
                        a_id: record.record.aid,
                        a_sx: record.record.asx,
                        a_sy: record.record.asy,
                        b_id: record.record.bid,
                        b_sx: record.record.bsx,
                        b_sy: record.record.bsy,
                    });
                    store.commit("updateSteps", {
                        a_steps: record.record.asteps,
                        b_steps: record.record.bsteps,
                    });
                    store.commit("updateRecordLoser", record.record.loser);
                    router.push({ //页面跳转
                        name: "record_content",
                        params: { //路径钟有一个参数
                            recordId,
                        }
                    })
                    break;
                }
            }
        }
        return {
            records,
            open_record_content,
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