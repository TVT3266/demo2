<?php
header("Content-Type:application/json;charset=utf-8");
    //严格按照JSON格式
    $result='{
        "success":true,
        "msg":[
            [
                {"img":"//img.alicdn.com/bao/uploaded/i1/2695034346/TB2clABnVXXXXaKXXXXXXXXXXXX_!!2695034346.jpg_q50.jpg","title":"[为你推荐]临安农家特产自制纯手工烤芝麻年糕片现炒香脆非油炸500g两份包邮","price":"18.8"},
                {"img":"//img.alicdn.com/bao/uploaded/i1/2695034346/TB2clABnVXXXXaKXXXXXXXXXXXX_!!2695034346.jpg_q50.jpg","title":"[为你推荐]临安农家特产自制纯手工烤芝麻年糕片现炒香脆非油炸500g两份包邮","price":"18.8"}
            ],
            [
                {"img":"//img.alicdn.com/bao/uploaded/i1/2695034346/TB2clABnVXXXXaKXXXXXXXXXXXX_!!2695034346.jpg_q50.jpg","title":"[为你推荐]临安农家特产自制纯手工烤芝麻年糕片现炒香脆非油炸500g两份包邮","price":"18.8"},
                {"img":"//img.alicdn.com/bao/uploaded/i1/2695034346/TB2clABnVXXXXaKXXXXXXXXXXXX_!!2695034346.jpg_q50.jpg","title":"[为你推荐]临安农家特产自制纯手工烤芝麻年糕片现炒香脆非油炸500g两份包邮","price":"18.8"}
            ]
        ]
    }';
    echo $result;
?>