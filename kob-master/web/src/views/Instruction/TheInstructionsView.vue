<template>
    <div class="container">
        <div class="card">
            <div class="card-body">

                <ContentField>
        <table class="table table-striped table-hover" >
            <thead class="message_head">
                <tr>
                    关于游戏玩法
                </tr>
            </thead>
            <tbody class="message_color">
                <br>
                
                <tr>本游戏是回合制游戏，可通过 WASD 或 上下左右键操控🐍蛇头的走向</tr>
                <tr>初始时蛇身长度为1，每走一步蛇身长度加一，当长度 大于等于10 时，每走三步蛇身加1</tr>
                当一方玩家蛇头撞向墙或任意蛇身或超过20秒未操作时，则判定为输

                <br>
                <tr>游戏有三种玩法：人人对战、人机对战、机器对战。</tr> 
                <br><br>
                bot代码由玩家自己编写(在个人中心页面添加自己的bot,在对战时可选择自己的bot出战)
                <br>
                <button class="message_button">注意，游戏将随机分配双方位置，注意留意地图正下方的提示</button>
            </tbody>
        </table>
    </ContentField>


    <!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  点击获取基础bot代码
</button>

        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">bot代码实例</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                package com.kob.botrunningsystem.utils;
                <br>
                import java.io.File;
                <br>
                import java.io.FileNotFoundException;
                <br>
                import java.util.ArrayList;
                <br>
                import java.util.List;
                <br>
                import java.util.Scanner;
                <br>
                public class Bot implements java.util.function.Supplier&lt;Integer&gt; {
                    <br>
                    //Cell为一个格子<br>
                    static class Cell {<br>
                        public int x, y;<br>
                        public Cell(int x, int y) {<br>
                            this.x = x; <br>
                            this.y = y; <br>
                        } <br>
                    } <br>
                    <br>
                    private boolean check_tail_increasing(int step) {  // 检验当前回合，蛇的长度是否增加 <br>
                        if (step &lt;= 10) return true; <br>
                        return step % 3 == 1; <br>
                    } <br>
                    //getCells用于取出两条蛇的蛇身所占位置<br>
                    public List&lt;Cell&gt; getCells(int sx, int sy, String steps) { <br>
                        steps = steps.substring(1, steps.length() - 1); <br>
                        List&lt;Cell&gt; res = new ArrayList&lt;&gt;(); <br>
                        <br>
                        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1}; <br>
                        int x = sx, y = sy; <br>
                        int step = 0; <br>
                        res.add(new Cell(x, y)); <br>
                        for (int i = 0; i &lt; steps.length(); i ++ ) { <br>
                            int d = steps.charAt(i) - &#x27;0&#x27;; <br>
                            x += dx[d]; <br>
                            y += dy[d]; <br>
                            res.add(new Cell(x, y)); <br>
                            if (!check_tail_increasing( ++ step)) { <br>
                                res.remove(0); <br>
                            } <br>
                        } <br>
                        return res; <br>
                    } <br>
                    //编写函数入口<br>
                    //传入的input中有六个字符串编码,依次为: <br>
                    //地图 # my蛇头x坐标 # my蛇头y坐标 # 我的操作 #you蛇头x # you蛇头y # 对手操作<br>
                    public Integer nextMove(String input) { <br>
                        String[] strs = input.split(&quot;#&quot;); <br>
                        int[][] g = new int[13][14]; <br>
                        for (int i = 0, k = 0; i &lt; 13; i ++ ) { <br>
                            for (int j = 0; j &lt; 14; j ++, k ++ ) { <br>
                                if (strs[0].charAt(k) == &#x27;1&#x27;) { <br>
                                    g[i][j] = 1; <br>
                                } <br>
                            } <br>
                        } <br>
                        //得到两条蛇的起点坐标<br>
                        int aSx = Integer.parseInt(strs[1]), aSy = Integer.parseInt(strs[2]); <br>
                        int bSx = Integer.parseInt(strs[4]), bSy = Integer.parseInt(strs[5]); <br>
                        <br>
                        List&lt;Cell&gt; aCells = getCells(aSx, aSy, strs[3]); //将蛇身所占的位置也标志为1<br>
                        List&lt;Cell&gt; bCells = getCells(bSx, bSy, strs[6]); <br>
                        <br>
                        for (Cell c: aCells) g[c.x][c.y] = 1; <br>
                        for (Cell c: bCells) g[c.x][c.y] = 1; <br>
                        <br>
                        <br>
                        <br>
                        //以下开始编写蛇移动的逻辑 <br>
                        int[] dx = {-1, 0, 1, 0}, dy = {0, 1, 0, -1}; <br>
                        for (int i = 0; i &lt; 4; i ++ ) { <br>
                            int x = aCells.get(aCells.size() - 1).x + dx[i]; <br>
                            int y = aCells.get(aCells.size() - 1).y + dy[i]; <br>
                            if (x &gt;= 0 &amp;&amp; x &lt; 13 &amp;&amp; y &gt;= 0 &amp;&amp; y &lt; 14 &amp;&amp; g[x][y] == 0) { <br>
                                return i; <br>
                            } <br>
                        } <br>
                        <br>

                        //结束编写<br>
                        return 0; <br>
                    } <br>
                    <br>
                    @Override <br>
                    public Integer get() { <br>
                        File file = new File(&quot;input.txt&quot;); <br>
                        try { <br>
                            Scanner sc = new Scanner(file); <br>
                            return nextMove(sc.next()); <br>
                        } catch (FileNotFoundException e) { <br>
                            throw new RuntimeException(e); <br>
                        } <br>
                    } <br>
                } <br>
                
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">朕已知晓</button>
            </div>
            </div>
        </div>
        </div>
            </div>
        </div>
    </div> 

   
    
</template>
<script>

</script>
<style scoped>
tbody.message_color {
    background-color:(beige);
    text-align: center;
    color:rgb(0, 204, 255);
    font-size: 30px;
    font-weight: 600;
}

thead.message_head{
    text-align: center;
    color:brown;
    font-size: 30px;
}
button.message_button{
    text-align: center;
    color: cadetblue;
    font-size: 30px;
}

</style>