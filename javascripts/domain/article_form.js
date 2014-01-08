$(function() {
    $(".article_form #coverbtn").click(function() {
        $(".article_form #import").click();
    });
    $(".article_form #import").change(function() {
        $(".article_form .file_cover").val($(this).val());
    });
    $(".article_form").submit(function() {
        var self = $(this), required = [], param, alert_message, modal;
        self.find("[data-required]").each(function() {
            if(required.indexOf(this.name) === -1) {
                required.push(this.name);
            }
        });
        param = self.formToArray();
        $.each(param, function(k, v) {
            var idx;
            if((idx = required.indexOf(v.name)) > -1 && !!v.value) {
                required.splice(idx, 1);
            }
        });
        if(required.length > 0) {
            $.each(required, function(k, v) {
                required[k] = self.find("[name='" + v + "'][data-required]").attr("data-required");
            });
            window.view.modal("入力不備があります", '<p>以下の項目を入力ください<br/>' + required.join(", ") + '</p>');
            return false;
        }
        self.ajaxSubmit({
            type: "POST",
            url: window.view.www + "api/article",
            dataType: "JSON",
            success: function(res) {
                if(!!res.article) {
                    window.view.add_article(res.article);
                }
            }
        });
        return false;
    });
})