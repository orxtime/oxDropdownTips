# oxDropdownTips
jQuery plugin like typeahead

![Image of Ox](https://www.goodfreephotos.com/albums/people/man-leading-woman-riding-an-ox.jpg)

```
jQuery(document).ready(function(){
	jQuery('.input').oxDropdownTips({
		source : '/autocomplete?format=json',
		textProperty : 'text',
		valueProperty : 'value',
		termProperty : 'query',
		imgProperty : 'img',
		maxTipsCount : 0,
		multiselect : true,
		showImages : true,
		required : true,
		locale:'ru-RU',
		language:{
			'ru-RU' : {
				DROP_DOWN_NO_RESULTS_LABEL : 'Пользователь не найден',
				TERM_INPUT_PLACEHOLDER : 'Выберите получателей',
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
	});
});
```
