<template>
    <!--引用全局变量: 如果在script 也就是js里写时不用加$符号， 但在<template>里写就要加$-->
     <PlayGround /> 
    </template>
    
    <script>
    import PlayGround from '../../components/PlayGround.vue'

    export default {
        components: {
            PlayGround,

    },
        setup() {
            
        }
    }
    </script>
    
    <style scoped>
    
    </style>