(function ($) {
	$.keypad.regionalOptions['fa'] = {
		buttonText: '...', buttonStatus: '...!',
		closeText: 'بستن', closeStatus: 'بستن',
		clearText: 'حذف', clearStatus: 'حذف',
		backText: 'ويرايش', backStatus: 'ويرايش',
		shiftText: 'Shift', shiftStatus: 'Shift!',
		spacebarText: '&nbsp;', spacebarStatus: '',
		enterText: 'Entrar', enterStatus: '',
		tabText: '→', tabStatus: '',
		alphabeticLayout: $.keypad.qwertyAlphabetic,
		fullLayout: $.keypad.qwertyLayout,
		isAlphabetic: $.keypad.isAlphabetic,
		isNumeric: $.keypad.isNumeric,
		toUpper: $.keypad.toUpper,
		isRTL: true,
	};
	$.keypad.setDefaults($.keypad.regionalOptions['fa']);
})(jQuery);
