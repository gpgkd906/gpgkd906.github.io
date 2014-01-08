$(function() {
    $(".comment").css("display", "none");
    $(".more a").click(function() {
        var $this = $(this), $comments = $this.parents(".post").find(".comment");
        if($this.hasClass("open")) {
            $this.removeClass("open");            
        } else {
            $this.addClass("open");
        }
        $comments.slideToggle();
        return false;
    });
});