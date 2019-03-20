<?php

function isMobile()
{
    if ( isset ( $_SERVER[ 'HTTP_USER_AGENT' ] ) ) {
        $clientkeywords = ['iphone','ipod','android'];
        if ( preg_match( "/(" . implode( '|', $clientkeywords ) . ")/i", strtolower( $_SERVER[ 'HTTP_USER_AGENT' ] ) ) ) {
            return true;
        }
    }
    return false;
}

if ( isMobile() ) {
    $http_host = $_SERVER[ 'HTTP_HOST' ];
    $www_site_arr=['www.xxxx.com'=>'m.xxxx.com','guanwang.com'=>'m.guanwang.com','www.xxxx.la'=>'m.xxxx.la','xxxx.la'=>'m.xxxx.la',
'www.dev.xxxx.red'=>'m.dev.xxxx.red'];
    if ( array_key_exists($http_host,$www_site_arr)) {
        $m_site = "http://".$www_site_arr[$http_host].$_SERVER["REQUEST_URI"];
        header( "Location:" . $m_site );
        exit;
    }
}



$config = [


    // 指定站点映射关系 , 只在根配置下有效, default表示未指出的站点，如未设置 default 将拒绝不在列表的域名进行访问
    'SITE' => [
        'xxxx.com'     => 'pc',
        'xxxx.la'     => 'pc',
        'www.xxxx.com' => 'pc',
        'xxxx_zs.la'   => 'pc',
        'm.xxxx.com'   => 'mobile',
        'm.xxxx.la'   => 'mobile',
        'default'      => null
    ],

];
