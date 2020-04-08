(function($) {
 
 	//Выпадающие подсказки
    $.fn.oxDropdownTips = function(options) {

        function oxDropdownTipsSearch(term,callback){
            if(typeof settings.source == 'object' && Object.isArray(settings.source))
                oxDropdownTipsLocalSearch(term,callback);
            else if(typeof settings.source == 'string')
                oxDropdownTipsRemoteSearch(term,callback);
            else
                if(typeof settings.onError == 'function')
                    settings.onError({title:'Unsuported source type',description:'Your source has not valid data type. Use String (URL) or Array'});
        }

        function oxDropdownTipsLocalSearch(term,callback){
            var tips = [];

            if(typeof settings.onStartSearch == 'function')
                settings.onStartSearch(tips,term);

            if(settings.textProperty.trim() == ''){
                tips = settings.source.filter(function(item) {
                    if(typeof item == 'object'){
                        for (var prop in item) {
                            if (item.hasOwnProperty(prop) && typeof item[prop] == 'string') {
                                if(item[prop].toUpperCase().indexOf(term.toUpperCase()) > -1)
                                    return true;
                            }
                        }
                        return false;
                    }else{
                        return (String(item).toUpperCase().indexOf(term.toUpperCase()) > -1);
                    }
                });
            }else{
                tips = settings.source.filter(function(item) {
                    if(typeof item == 'object'){
                        if(item[settings.textProperty] !== undefined && typeof item[settings.textProperty] == 'string')
                            return (item[settings.textProperty].toUpperCase().indexOf(term.toUpperCase()) > -1);
                        else
                            return false;
                    }else{
                        return (String(item[settings.textProperty]).toUpperCase().indexOf(term.toUpperCase()) > -1);
                    } 
                });
            }

            if(tips.length > settings.maxTipsCount)
                tips = tips.slice(0,settings.maxTipsCount);

            if(typeof settings.onEndSearch == 'function')
                settings.onEndSearch(tips);

            if(typeof callback == 'function')
                callback(tips);

            return tips;
        }

        function oxDropdownTipsRemoteSearch(term,callback){
            var tips = [];

            if(typeof settings.onStartSearch == 'function')
                settings.onStartSearch(tips,term);

            if(typeof settings.data == 'object')
                var data = settings.data;
            else
                var data = {};

                data[settings.termProperty] = term;

            jQuery.ajax({
                url:settings.source,
                method:settings.method,
                data:data,
                success:function(tips){
                    if(typeof settings.onEndSearch == 'function')
                        settings.onEndSearch(tips);

                    if(typeof callback == 'function')
                        callback(tips);
                },
                error:function(err){
                    if(typeof settings.onError == 'function')
                        settings.onError({title:'Ajax error',description:JSON.stringify(err)});
                }
            });
        }

        function oxDrawDropDownTipsList(tips,origin_input){
            var tips_wrapper = origin_input.data('tips_wrapper');
            var tips_html = [];
            if(settings.textProperty.trim() == ''){
                for (var i = 0; i < tips.length; i++) {
                    var tip = tips[i];
                    if(typeof tip == 'string'){
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                    }else if(typeof tip == 'object'){
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${(settings.valueProperty.trim() == '' && tip[settings.valueProperty] !== undefined ? '-' : tip[settings.valueProperty])}">-</a>`);
                    }else
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                }
            }else{
                for (var i = 0; i < tips.length; i++) {
                    var tip = tips[i];
                    if(typeof tip == 'string'){
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                    }else if(typeof tip == 'object'){
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${(settings.valueProperty.trim() == '' && tip[settings.valueProperty] !== undefined ? '-' : tip[settings.valueProperty])}">
                                            ${(settings.textProperty.trim() == '' && tip[settings.textProperty] !== undefined ? '-' : tip[settings.textProperty])}
                                        </a>`);
                    }else
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                }
            }

            if(tips_html.length > 0){
                tips_wrapper.show();
            }else{
                tips_wrapper.hide();
            }

            tips_wrapper.html('');
            var tips_element = jQuery('<div class="oxDropdownTipsContainer">'+tips_html.join()+'</div>').appendTo(tips_wrapper[0]);

            tips_element.on('click','a.oxDropdownTipsItem',function(e){
                var item = this;
                e.preventDefault();

                if(typeof settings.onSelect == 'function')
                    settings.onSelect(e,item,origin_input);

                tips_wrapper.hide();

                if(typeof settings.onCloseDropdownList == 'function')
                    settings.onCloseDropdownList(e,tips_wrapper[0]);

                return false;
            });

        }

        if(typeof options != 'object')
            options = {};

        var settings = jQuery.extend({
            source : [],
            textProperty:'',
            valueProperty:'',
            minToSearch:3,
            maxToSearch:30,
            maxTipsCount:10,
            method:'GET',
            termProperty:'term',
            data:{},
            highlight:false,
            onStartSearch : function(tips,term){},
            onEndSearch : function(tips){},
            onSelect : function(e,item,origin_input){
                var value = jQuery(item).attr('data-value');
                var text = jQuery(item).text().trim();
                var term_input = origin_input.data('term_input');

                if(value != '-'){
                    origin_input.val(value);
                }else{
                    origin_input.val(text);
                }

                term_input.val(text);
            },
            onCloseDropdownList:function(){},
            onOpenDropdownList:function(){},
            onError : function(err){
                throw err;
            }
        },options);
 
        this.each(() => {
            var origin_input = jQuery(this);
            var term_input = jQuery('<input type="text" class="oxDropdownTipsInput" />').insertAfter(origin_input[0]);
            var tips_wrapper = jQuery('<div class="oxDropdownTipsWrapper"></div>').insertAfter(term_input[0]);
            	origin_input.data('term_input',term_input);
            	origin_input.data('tips_wrapper',tips_wrapper);
            	term_input.data('tips_wrapper',tips_wrapper);

                origin_input.hide();

            	term_input.on('keyup',function() {
                    var term = jQuery(this).val();

                    if(term.length < settings.minToSearch)
                        return;

                    oxDropdownTipsSearch(term,function(tips){
                        oxDrawDropDownTipsList(tips,origin_input);
                    });
            	});

                term_input.on('focusin',function(e) {
                    var oxDropdownTipsContainer = tips_wrapper.find('.oxDropdownTipsContainer');
                    if(oxDropdownTipsContainer.length > 0){
                        tips_wrapper.show();
                        if(typeof settings.onCloseDropdownList == 'function')
                            settings.onOpenDropdownList(e,tips_wrapper[0]);
                    }
                });

                term_input.on('focusout',function(e) {
                    var oxDropdownTipsContainer = tips_wrapper.find('.oxDropdownTipsContainer');
                    if(oxDropdownTipsContainer.length > 0)
                        setTimeout(function(){                            
                            tips_wrapper.hide();
                            if(typeof settings.onCloseDropdownList == 'function')
                                settings.onCloseDropdownList(e,tips_wrapper[0]);
                        },400);
                });

                tips_wrapper.hide();
        });
 
        return this;
 
    };
 
}(jQuery));