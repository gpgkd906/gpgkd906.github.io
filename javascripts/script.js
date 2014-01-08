/*back-top*/
$(document).ready(function() {  
	$('#pageTop a').click(function () {
		$('html,body').animate({scrollTop:'0px'},1000);return false;
});
});
/*back-top*/

/*target _blank*/
$(document).ready( function () {
    $('.blank').click(function(){
        window.open(this.href, '_blank');
        return false;
    });
});
/*target _blank*/
