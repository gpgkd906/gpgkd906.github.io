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
        modal: function($title, $message, $before_render, $save) {
            $("#myModal").remove();
            var $html = ['<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
                         '<div class="modal-header">',
                         '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
                         '<h3 id="myModalLabel">' + $title + '</h3>',
                         '</div><div class="modal-body">',
                         $message,
                         '</div>'].join("");
            var $footer = ['<div class="modal-footer"><button class="btn modal-close" data-dismiss="modal" aria-hidden="true">閉じる</button>'];
            if(!!$save) { 
                $footer.push('<button class="btn modal-save">保存する</button>'); 
            }
            $footer.push('</div>');
            $modal = $($html + $footer.join(""));
            if(!!$save) {
                $modal.on("click", ".modal-save", function() {
                    $save.call($modal);
                    $modal.modal("hide");
                });
            }
            if(!!$before_render) {
                $before_render.call($modal);
            }
            $modal.modal();
        },
        add_article: function($article) {
            var html = $(['<div class="article">',
                          '<div class="article_header row">',
                          '<div class="article_thumb span1"><img width="50" height="50"></div>',
                          '<div class="article_info span2"><p>ユーザ名</p><p>場所</p></div>',
                          '<div class="article_type pull-right"><span class="article_type_icon article_type_"></span></div>',
                          '<div class="article_img pull-right"><img src=' + this.www + $article.img + ' width="50" height="50"></div>',
                          '</div>',
                          '<div class="article_body popover bottom">',
                          '<div class="arrow"></div>',
                          '<div class="popover-content">',
                          '<h4></h4>',
                          '<p>' + $article.message + '</p>',
                          '<div class="pull-right article-controller">',
                          '<span class="article-edit btn-link"><i class="icon-edit"></i>編集</span> | ',
                          '<span class="article-delete btn-link"><i class="icon-trash"></i>削除</span> | ',
                          '<span class="article-quote btn-link"><i class="icon-share"></i>引用して返信</span> | ',
                          '<span class="article_report btn-link"><i class="icon-fire"></i>報告</span></div>',
                          '</div></div></div>'
                         ].join("")).css("backgroun-color", "#FFF1E6").slideUp();
            html.insertBefore(".article_zone .article:eq(0)").slideDown(1000).animate({"backgroun-color": "#FFF1E6"}, 1000);
        },
        add_reply: function($box, $replies) {
            var $zone = $(".article_reply_zone", $box), $reply, i, $html = [""];
            for(i in $replies) {
                $reply = $replies[i];
                $html.push("<span class='article_reply'>" + $reply.message + "</span>");
            }
            $zone.append($html.join(""));
            this.reply_toggle($box);
        },
        reply_toggle: function($box) {
            $(".article_reply_zone", $box).slideToggle(0);
        },
        reply_show: function($box) {
            $(".article_reply_zone", $box).slideDown(0);
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

$(function() {
    //search_station
    var $search_station = $("#search_station"), $search_instance = $(".search_instance");
    $search_station.keyup(function() {
        var self = $(this), pattern = self.val(), sub_pattern, del_index, find, row, $text, res = [], i, j;
        if(!pattern) {
            $search_instance.html("").hide();
            return;
        }
        //multi match
        pattern = pattern.split(/\s/g);
        while((del_index = pattern.indexOf("")) > 0) {
            pattern.splice(del_index, 1);
        }
        for(i in window.cache.$station.list) {
            row = window.cache.$station.list[i];
            $text = row.company + " " + row.name;
            find = false;
            for(j = 0; j < pattern.length; j++) {
                find = true;
                if($text.indexOf(pattern[j]) === -1) {
                    find = false;
                    break;
                }
            }
            if(find){
                res.push("<li><a tabindex='-1' data-id='" + row.id + "'>" + $text + "</a></li>");
                if(res.length > 7) {
                    break;
                }
            }
        }
        if(res.length === 0) {
            return ;
        }
        $res = $(res.join("")).click(function() {
            var $a = $(this).find("a"), $val = $a.text(), $id = $a.data("id");
            $search_station.val($val);
            $search_station.data("id", $id);
            $search_instance.hide().parent().removeClass("open");
        });
        $search_instance.html($res).dropdown("toggle").show();
        //$search_instance.css("top", ($search_station.offset().top - ($search_instance.height() + 5) * 2) + "px");
    });
    //search_box btn
    $(".search_box button").click(function() {
        var $id = $search_station.data("id"), $link = null;
        if(!!$id) {
            $link = window.view.www + "station/id/" + $id;
            window.location.href = $link;
        }
    });
    //article_scroll
    $(".article_zone").perfectScrollbar({
        wheelSpeed: 20,
        wheelPropagation: false
    });
});