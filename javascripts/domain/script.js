var view = (function() {
    var $body = $("body");
    return {
        www: "http://vm/mirairo/",
        set_fontsize: function($size) {
            $body.css("font-size", $size + "px");
        },
        access: function($api, $method, $data, $success) {
            if(!$method) {
                $method = "get";
            }
            $option = {
                type: $method,
                success: $success
            }
            $option.dataType = "json";
            if($method.toLowerCase() === "get") {
                $option.dataType = "html";
            }
            if(!!$data) {
                $option.data = $data;
            }
            $.ajax(this.www + $api, $option);
        },
        add_article: function($article) {
        },
        add_reply: function($box, $replies) {
        }
    }
})();
//init
(function(w){
    //cacheなど、
    var $station, $station_expire, $now, $station_expire_day = 1;
    w.canCache = !!window.Storage;
    if(w.canCache) {
        w.cache = {};
        $station_expire = localStorage.getItem("station_expire") | 0;
        $now = new Date().valueOf() / 1000 | 0;
        //指定日数以内であれば、ローカルのキャッシュを使用する
        if($station_expire + $station_expire_day * 86400 > $now) {
            $station = localStorage.getItem("station");
        }
    }
    if(!$station) {
        $.ajax(w.view.www + "api/station_list", {
            type: "get",
            dataType: "html",
            success: function($list) {
                w.cache.$station = JSON.parse($list);
                if(w.canCache) {
                    localStorage.setItem("station", $list);
                    localStorage.setItem("station_expire", (new Date().valueOf() / 1000 | 0));
                }
            }
        });
    } else {
        w.cache.$station = JSON.parse($station);
    }

})(window);
/*
$(function() {
    //article_scroll
    $(".postZone").perfectScrollbar({
        wheelSpeed: 20,
        wheelPropagation: false,
    });
});
*/