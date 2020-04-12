(function($) {
 
 	//Выпадающие подсказки
    $.fn.oxDropdownTips = function(options) {

        function sortKeys(obj_1) { 
            var key = Object.keys(obj_1) 
            .sort(function order(key1, key2) { 
                if (key1 < key2) return -1; 
                else if (key1 > key2) return +1; 
                else return 0; 
            });  
              
            // Taking the object in 'temp' object 
            // and deleting the original object. 
            var temp = {}; 
              
            for (var i = 0; i < key.length; i++) { 
                temp[key[i]] = obj_1[key[i]]; 
                delete obj_1[key[i]]; 
            }  

            for (var i = 0; i < key.length; i++) { 
                obj_1[key[i]] = temp[key[i]]; 
            }  
            return obj_1; 
        } 

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

            if(settings.maxTipsCount != 0 && tips.length > settings.maxTipsCount)
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

            tips = tips.filter(function(tip){
                var search_object = {};
                if(typeof tip == 'object'){
                    if(settings.textProperty.trim() == '')
                        search_object.text = tip[settings.textProperty.trim()];
                    else
                        search_object.text = tip['text'];
                    if(settings.valueProperty.trim() == '')
                        search_object.value = tip[settings.valueProperty.trim()];
                    else
                        search_object.value = tip['value'];
                }else{
                    search_object.text = tip;
                    search_object.value = tip;
                }

                var founded = states.selected.filter(function(i){
                    return i.value == search_object.value && i.text == search_object.text;
                });

                return founded.length <= 0;
            });

            

            if(settings.textProperty.trim() == ''){
                for (var i = 0; i < tips.length; i++) {
                    var tip = tips[i];
                    if(typeof tip == 'string'){
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                    }else if(typeof tip == 'object'){
                        var img = '';
                        if(settings.showImages){
                            img = '<div class="oxDropdownTipsItemImgHolder"></div>';
                            if(settings.imgProperty.trim() != '' && tip[settings.imgProperty] !== undefined){
                                img = '<div class="oxDropdownTipsItemImg"><img src="'+tip[settings.imgProperty]+'" alt="" /></div>';
                            }
                        }

                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${(settings.valueProperty.trim() == '' && tip[settings.valueProperty] !== undefined ? '-' : tip[settings.valueProperty])}">
                                            ${img}
                                            <span class="oxDropdownTipsItemText">-</span>
                                        </a>`);
                    }else
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                }
            }else{
                for (var i = 0; i < tips.length; i++) {
                    var tip = tips[i];
                    if(typeof tip == 'string'){
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                    }else if(typeof tip == 'object'){
                        var img = '';
                        if(settings.showImages){
                            img = '<div class="oxDropdownTipsItemImgHolder"></div>';
                            if(settings.imgProperty.trim() != '' && tip[settings.imgProperty] !== undefined){
                                img = '<div class="oxDropdownTipsItemImg"><img src="'+tip[settings.imgProperty]+'" alt="" /></div>';
                            }
                        }

                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${(settings.valueProperty.trim() == '' && tip[settings.valueProperty] !== undefined ? '-' : tip[settings.valueProperty])}">
                                            ${img}
                                            <span class="oxDropdownTipsItemText">
                                                ${(settings.textProperty.trim() == '' && tip[settings.textProperty] !== undefined ? '-' : tip[settings.textProperty])}
                                            </span>
                                        </a>`);
                    }else
                        tips_html.push(`<a href="#" class="oxDropdownTipsItem" data-value="${tip}">${tip}</a>`);
                }
            }

            if(tips_html.length > 0){
                tips_wrapper.show();
            }else{
                tips_html.push(`<span class="oxDropdownTipsItemNoResult">${(settings.language[settings.locale].NO_RESULTS_LABEL || 'NO_RESULTS_LABEL')}</a>`);
                tips_wrapper.show();
            }

            tips_wrapper.html('');
            var tips_element = jQuery('<div class="oxDropdownTipsContainer">'+tips_html.join('')+'</div>').appendTo(tips_wrapper[0]);

            tips_element.on('click','a.oxDropdownTipsItem',function(e){
                var item = this;
                e.preventDefault();

                var value = jQuery(item).attr('data-value');
                var text = jQuery(item).find('.oxDropdownTipsItemText').text().trim();
                var term_input = origin_input.data('term_input');
                var multiselect_wrapper = origin_input.data('multiselect_wrapper');

                if(!settings.multiselect)
                    states.selected = [{value:value,text:text}];
                else
                    states.selected.push({value:value,text:text});

                if(!settings.multiselect){
                    term_input.val(text);

                    states.selected = states.selected.map(function(i){return JSON.stringify(i)}).filter(function(value, index, self) { 
                        return self.indexOf(value) === index;
                    }).map(function(i){return JSON.parse(i)});

                    origin_input.val(states.selected.map(function(i){
                        if(i.value != '-')
                            return i.value;
                        else
                            return i.text;
                    }).join());
                }else{
                    oxDrawMultiselect(origin_input);
                }

                tips_wrapper.html('');

                if(typeof settings.onSelect == 'function')
                    settings.onSelect(e,item,origin_input);

                if(typeof settings.onChange == 'function')
                    settings.onChange();

                tips_wrapper.hide();

                if(typeof settings.onCloseDropdownList == 'function')
                    settings.onCloseDropdownList(e,tips_wrapper[0]);

                return false;
            });
        }

        function oxDrawMultiselect(origin_input){
            var term_input = origin_input.data('term_input');
            var multiselect_wrapper = origin_input.data('multiselect_wrapper');

            states.selected = states.selected.map(function(i){return JSON.stringify(sortKeys(i))}).filter(function(value, index, self) { 
                   return self.indexOf(value) === index;
            }).map(function(i){return JSON.parse(i)});
            
            multiselect_wrapper.html('');
            var multiselect_tags = [];
            for (var i = 0; i < states.selected.length; i++) {
                var selected_item = states.selected[i];
                multiselect_tags.push(`<span class="oxDropdownTipsMultiselectTag" data-value="${selected_item.value}">${selected_item.text}<span class="oxDropdownTipsMultiselectTagClose">&times;</span></span>`);
            }

            if(multiselect_tags.length > 0)
                multiselect_tags.push(`<span class="oxDropdownTipsMultiselectTagAdd">${(settings.language[settings.locale].TERM_INPUT_MULTISELECT_ADD_BUTTON_LABEL || 'TERM_INPUT_MULTISELECT_ADD_BUTTON_LABEL')} <span class="oxDropdownTipsMultiselectTagAddIcon">+</span></span>`);

            var multiselect_tags_element = jQuery('<div class="oxDropdownTipsMultiselectTagsContainer">'+multiselect_tags.join('')+'</div>').appendTo(multiselect_wrapper[0]);

            multiselect_tags_element.on('click','.oxDropdownTipsMultiselectTagAdd',function(){
                term_input.focus();
            });

            multiselect_tags_element.on('click','.oxDropdownTipsMultiselectTagClose',function(){
                var multiselect_tag = jQuery(this).closest('.oxDropdownTipsMultiselectTag');
                var multiselect_tags_container = multiselect_tag.closest('.oxDropdownTipsMultiselectTagsContainer');
                var value = multiselect_tag.attr('data-value');
                var text = multiselect_tag.text().trim();
                states.selected = states.selected.filter(function(i){
                    return i.value != value && i.text != text;
                })
                multiselect_tag.remove();

                if(multiselect_tags_container.find('.oxDropdownTipsMultiselectTag').length <= 0){
                    multiselect_wrapper.find('.oxDropdownTipsMultiselectTagsContainer').remove();
                }

                if(typeof settings.onChange == 'function')
                    settings.onChange();

                origin_input.val(states.selected.map(function(i){
                    if(i.value != '-')
                        return i.value;
                    else
                        return i.text;
                }).join());
            });

            term_input.val('');

            origin_input.val(states.selected.map(function(i){
                if(i.value != '-')
                    return i.value;
                else
                    return i.text;
            }).join());
        }

        if(typeof options != 'object')
            options = {};

        var states = {
            selected : [],
            requiredCheck : true
        };

        var settings = jQuery.extend({
            source : [],
            textProperty:'',
            valueProperty:'',
            imgProperty:'',
            minToSearch:0,
            maxToSearch:30,
            maxTipsCount:10,
            method:'GET',
            termProperty:'term',
            data:{},
            highlight:false,
            multiselect:false,
            showImages:false,
            required:false,
            locale:'ru-RU',
            language:{
                'ru-RU' : {
                    DROP_DOWN_NO_RESULTS_LABEL : 'Ничего не найдено',
                    TERM_INPUT_PLACEHOLDER : 'Выберите значение',
                    TERM_INPUT_REQUIRED_ERROR_MESSAGE : 'Это поле обязательно для заполнения',
                    TERM_INPUT_MULTISELECT_ADD_BUTTON_LABEL : 'Добавить'
                }
            },
            onInit : function(){},
            onStartSearch : function(tips,term){},
            onEndSearch : function(tips){},
            onSelect : function(e,item,origin_input){},
            onChange : function(){},
            onCloseDropdownList:function(){},
            onOpenDropdownList:function(){},
            onRequiredCheck:function(result){},
            onError : function(err){
                throw err;
            },
            getSelected : function(){
                return states.selected;
            },
            setSelected : function(s){
                states.selected = s;
                return;
            }
        },options);
 
        this.each(() => {
            var origin_input = jQuery(this);
            var term_block = jQuery(`<div class="oxDropdownTipsContainer${(settings.multiselect ? ' multiselect-on' : ' multiselect-off')}">
                                        <div class="oxDropdownTipsMultiselectContainer"></div>
                                        <div class="oxDropdownTipsInputContainer">
                                            <input type="text" class="oxDropdownTipsInput" placeholder="${(settings.language[settings.locale].TERM_INPUT_PLACEHOLDER || 'TERM_INPUT_PLACEHOLDER')}" />
                                        </div>
                                        <div class="oxDropdownTipsDropdownOpener">
                                            <svg version="1.1" class="oxDropdownTipsDropdownOpenerIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 240.811 240.811" style="enable-background:new 0 0 240.811 240.811;" xml:space="preserve">
                                                <path d="M220.088,57.667l-99.671,99.695L20.746,57.655c-4.752-4.752-12.439-4.752-17.191,0 c-4.74,4.752-4.74,12.451,0,17.203l108.261,108.297l0,0l0,0c4.74,4.752,12.439,4.752,17.179,0L237.256,74.859 c4.74-4.752,4.74-12.463,0-17.215C232.528,52.915,224.828,52.915,220.088,57.667z" fill="#999999"/>
                                            </svg>
                                        </div>
                                        <div class="oxDropdownTipsMessages"></div>
                                    </div>`).insertAfter(origin_input[0]);
            var term_input = term_block.find('.oxDropdownTipsInput');
            var multiselect_wrapper = term_block.find('.oxDropdownTipsMultiselectContainer');
            var tips_wrapper = jQuery('<div class="oxDropdownTipsWrapper"></div>').insertAfter(term_input[0]);
            	origin_input.data('term_input',term_input);
            	origin_input.data('tips_wrapper',tips_wrapper);
                origin_input.data('multiselect_wrapper',multiselect_wrapper);

                origin_input.hide();

            	term_input.on('keyup',function() {
                    var term = jQuery(this).val();

                    if(term.length < settings.minToSearch)
                        return;

                    var run_timer = term_input.data('run_timer') || setTimeout(function(){});
                    clearTimeout(run_timer);
                    
                    run_timer = setTimeout(function(){
                        oxDropdownTipsSearch(term,function(tips){
                            oxDrawDropDownTipsList(tips,origin_input);
                        });
                    },300)

                    term_input.data('run_timer',run_timer);
            	});

                term_block.find('.oxDropdownTipsDropdownOpener').on('click',function(){
                    multiselect_wrapper.find('.oxDropdownTipsMultiselectTagAdd').hide();
                    term_input.focus();
                });


                term_input.on('focusin',function(e) {
                    var term = jQuery(this).val();
                    var hide_timer = term_input.data('hide_timer') || setTimeout(function(){});
                        clearTimeout(hide_timer);
                    oxDropdownTipsSearch(term,function(tips){
                        oxDrawDropDownTipsList(tips,origin_input);
                        if(typeof settings.onOpenDropdownList == 'function')
                            settings.onOpenDropdownList(e,tips_wrapper[0]);
                    });
                    term_block.find('.oxDropdownTipsMessages').html('');
                });

                term_input.on('focusout',function(e) {
                    var oxDropdownTipsContainer = tips_wrapper.find('.oxDropdownTipsContainer');
                    if(oxDropdownTipsContainer.length > 0){
                        var hide_timer = term_input.data('hide_timer') || setTimeout(function(){});
                        clearTimeout(hide_timer);
                        
                        hide_timer = setTimeout(function(){ 
                            multiselect_wrapper.find('.oxDropdownTipsMultiselectTagAdd').show();                           
                            tips_wrapper.hide();
                            if(typeof settings.onCloseDropdownList == 'function')
                                settings.onCloseDropdownList(e,tips_wrapper[0]);
                        },400);

                        term_input.data('hide_timer',hide_timer);
                    }
                });

                tips_wrapper.hide();

                if(typeof settings.onInit == 'function')
                    settings.onInit();

                if(settings.multiselect)
                    oxDrawMultiselect(origin_input);

                if(settings.required){
                    origin_input.addClass('required');
                    origin_input.closest('form').on('submit',function(e) {
                        if(origin_input.val() == ''){
                            e.preventDefault();
                            
                            term_block.find('.oxDropdownTipsMessages').html(`<div class="oxDropdownTipsMessage oxDropdownTipsMessageError">${(settings.language[settings.locale].TERM_INPUT_REQUIRED_ERROR_MESSAGE || 'TERM_INPUT_REQUIRED_ERROR_MESSAGE')}</div>`);

                            states.requiredCheck = false;

                            if(typeof settings.onRequiredCheck == 'function')
                                settings.onRequiredCheck(states.requiredCheck);

                            return false;
                        }else{
                            states.requiredCheck = true;

                            if(typeof settings.onRequiredCheck == 'function')
                                settings.onRequiredCheck(states.requiredCheck);
                        }
                    });
                }else{
                    states.requiredCheck = true;

                    if(typeof settings.onRequiredCheck == 'function')
                        settings.onRequiredCheck(states.requiredCheck);
                }
        });
 
        return this;
 
    };
 
}(jQuery));