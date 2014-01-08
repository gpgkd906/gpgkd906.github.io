$(function() {
    //instant search
    (function() {
        var $form = $("#instant_search_form")
        , $hidden = $("#article [name=station]")
        , $input = $("#instant_search_input, #f_info_station"), $list = [], i, $entry;
        $input.autocomplete({
            source: function(request, response) {
                var pattern, row, $text, find, i, j, res = [];
                pattern = request.term.split(/\s/g);
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
                        res.push($text);
                        if(res.length > 15) {
                            break;
                        }
                    }
                }
                response(res);
            },
            select: function(e, ui) {
                var i, row, find = false;               
                for(i in window.cache.$station.list) {
                    row = window.cache.$station.list[i];
                    if(ui.item.value === row.company + " " + row.name) {
                        find = true;
                        break;
                    }
                }
                $form.attr("action", window.view.www + "station/id/" + row.id);
                $hidden.val(row.id);
            }
        })
    })();
});