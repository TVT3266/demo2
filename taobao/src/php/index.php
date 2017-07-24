<?php
    header("Content-Type:application/json;charset=utf-8");
    $content=array('南京一周楼市总结','杨幂撞裤光头强？显瘦到想一口气买5件！','带最亲的人，拥抱自然点亮你的旅行');
    if($_SERVER['REQUEST_METHOD']=='GET'){
        $number=$_GET['number'];
        $result='{"success":false,"msg":"null"}';
        $result='{"success":true,"msg":'.'"'.$content[$number].'"'.'}';
        echo $result;
    }
?>