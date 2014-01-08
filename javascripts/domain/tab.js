$(function() {
    $(".tabpage").css("display", "none");
    var target = $(".pageNav span.active").data("target");
    $("." + target).css("display", "block");
    $(".pageNav span").click(function() {
        var target = $(this).data("target");
        $(".tabpage").css("display", "none");
        $("." + target).css("display", "block");
        $(".pageNav span.active").removeClass("active");
        $(this).addClass("active");
    });
});