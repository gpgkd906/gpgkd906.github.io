(function(exports) {
    var article_controller = (function() {
        var reply = {id: {}, load: {}};
        return {
            execute: function($target) {
                var $match = /edit|delete|report|quote|load_reply/.exec($target.attr("class")), $action = $match[0], $box = $target.parents(".article"), $id = $box.data("id");
                this[$action].call($box, $id);
            },
            edit: function($id) {
                var $message_box = this.find(".article_message"), $message = $message_box.text();
                view.modal("情報を編集", "<textarea class='article_editor'>" + $message + "</textarea>", 
                           function() {
                               $(".article_editor", this).css({
                                   width: "95%", height: "100px"
                               });
                           }, function() {
                               var $new_message = $(".article_editor", this).val();
                               view.access("api/article/" + $id, "put", {
                                   message: $new_message
                               }, function($res) {
                                   if(!!$res.error) {
                                       view.modal("更新が失敗しました", $res.error.message);
                                   } else {
                                       $message_box.text($new_message);
                                   }
                               });
                           });
            },
            delete: function($id) {
                var self = this;
                view.modal("情報を削除します", "情報を削除します、削除した後には復元できません、それでも削除しますか", 
                           function() {
                               $(".modal-close", this).text("キャンセル");
                               $(".modal-save", this).text("削除する");
                           }, function() {
                               view.access("api/article/" + $id, "delete", null, function($res) {
                                   if(!!$res.error) {
                                       view.modal("削除が失敗しました", $res.error.message);
                                   } else {
                                       self.remove();
                                   }
                               })
                           });
            },
            report: function($id) {
                view.modal("間違い情報・不当発言の報告", "<textarea class='report_editor'></textarea>",
                           function() {
                               $(".report_editor", this).css({
                                   width: "95%", height: "100px"
                               });
                           }, function() {
                               var $report = $(".report_editor", this).val();
                               view.access("api/report", "post", {
                                   article_id: $id, message: $report
                               }, function() {
                                   view.modal("報告完了", "<p>報告完了しました、情報提供ありがとうございます</p>");
                               });
                           });
            },
            quote: function($id) {
                var $box = this, $message_box = this.find(".article_message"), $message = $message_box.text();
                view.modal("情報を編集", "<textarea class='article_editor'>" + $message + "</textarea>", 
                           function() {
                               $(".article_editor", this).css({
                                   width: "95%", height: "100px"
                               });
                           }, function() {
                               var $new_message = $(".article_editor", this).val();
                               view.access("api/article_reply/" + $id, "post", {
                                   message: $new_message
                               }, function(res) {
                                   if(!!res.reply) {
                                       view.add_reply($id, [res.reply]);
                                       view.reply_show($box);
                                   }
                               });
                           });
            },
            load_reply: function($id) {
                if(!!reply.load[$id]){
                    return;
                }
                $box = this;
                if(!reply.id[$id]) {
                    reply.load[$id] = true;
                    view.access("api/article_reply/" + $id, "get", null, function($res){
                        $res = JSON.parse($res);
                        view.add_reply($box, $res.reply);
                        reply.id[$id] = true;
                        reply.load[$id] = false;
                    });
                } else {
                    view.reply_toggle($box);
                }
            },
            silent: function() {}
        }
    })()
    exports.article_controller = article_controller;
})(window)

$(function() {
    $(".article_zone").on("click", ".btn-link", function() {
        $param = window.article_controller.execute($(this));        
    });
})