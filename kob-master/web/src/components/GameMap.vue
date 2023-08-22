<template>
<div ref ="parent" class ="gamemap">
    <canvas ref ="canvas" tabindex = "0"></canvas>  <!--游戏地图在画布中-->
</div>

</template>

<script>
import { GameMap } from "@/assets/scripts/GameMap"
import { ref,onMounted } from 'vue';//ref用于获取标签值
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();
        let parent = ref(null);
        let canvas = ref(null);

        onMounted(() => { //组件挂载完后执行该函数
           store.commit("updateGameObject", new GameMap(canvas.value.getContext('2d') , parent.value,store));
        });
        return {
            canvas,
            parent,
        }
    }
}
</script>

<style scoped>
div.gamemap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; /*水平居中*/
    align-items: center; /*竖直居中*/
}
</style>