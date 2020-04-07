(function($) {
 
 	//Выпадающие подсказки
    $.fn.oxDropdownTips = function(options) {

        if(typeof options != 'object')
            options = {};

        var settings = jQuery.extend({
            source : [],
            textProperty:'',
            valueProperty:'',
            minToSearch:3,
            maxToSearch:30,
            url:'',
            method:'GET',
            termProperty:'term' 
        },options);
 
        this.filter('input,textarea').each(function() {
            var origin_input = jQuery(this);
            var term_input = jQuery('<input type="text" class="oxDropdownTipsInput" />').insertAfter(origin_input[0]);
            var tips_wrapper = jQuery('<div class="oxDropdownTipsWrapper"></div>').insertAfter(term_input[0]);
            	origin_input.data('term_input',term_input);
            	origin_input.data('tips_wrapper',tips_wrapper);
            	term_input.data('tips_wrapper',tips_wrapper);

            	term_input.on('keyup',function(){

            	});
        });
 
        return this;
 
    };
 
}(jQuery));