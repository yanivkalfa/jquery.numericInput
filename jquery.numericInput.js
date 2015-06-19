
//	Sets a keypress event for the selected element allowing only numbers. Typically this would only be bound to a textbox.
(function( $ ) {
    // Plugin defaults
    var defaults = {
        allowFloat: false,
        allowNegative: false,
        limitInput: false
    };

    // Plugin definition
    //	allowFloat: (boolean) Allows floating point (real) numbers. If set to false only integers will be allowed. Default: false.
    //	allowNegative: (boolean) Allows negative values. If set to false only positive number input will be allowed. Default: false.
    $.fn.numericInput = function( options ) {
        var settings = $.extend( {}, defaults, options );
        var allowFloat = settings.allowFloat;
        var allowNegative = settings.allowNegative;
        var limitInput = settings.limitInput;

        this.keypress(function (event) {
            var that, inputCode;
            that = this;
            inputCode = event.which || event.keyCode;

            if(inputCode == 8) {
                return true;
            }

            if(!validateKeypress(event, that)){
                $(that).addClass("error");
                return false;
            }
            if (!limitInputLength(that)){
                $(that).addClass("error");
                return false;
            }
            return true;
        });

        this.on("cut" + " paste", function(e) {
            var that = this;
            var prevalue = $(this).val();

            setTimeout(function(){
                var currvalue = $(that).val();
                if (!limitInputLength(that)){
                    $(that).val(prevalue);
                    $(that).addClass("error");
                    return false;
                }
                if (allowFloat == true) {
                    var pattern = /^\d+$|\.\d+$|\d+\.\d+$/;
                } else if (allowNegative == true) {
                    var pattern = /^\-?\d+$/;
                } else if (allowFloat == true && allowNegative == true) {
                    var pattern = /^\-?\d+$|\.\d+$|\d+\.\d+$/;
                } else {
                    // any number;
                    var pattern = /^\d+$/;
                }
                if (!pattern.test(currvalue)) {
                    $(that).val(prevalue);
                    $(that).addClass("error");
                    return false;
                }
                return true;
            });
        });

        function validateKeypress(event, element){
            var inputCode = event.which || event.keyCode;
            var currentValue = $(element).val();

            if(inputCode == 8) {
                return true;
            }

            if (inputCode > 0 && (inputCode < 48 || inputCode > 57))	// Checks the if the character code is not a digit
            {
                if (allowFloat == true && inputCode == 46)	// Conditions for a period (decimal point)
                {
                    //Disallows a period before a negative
                    if (allowNegative == true && getCaret(element) == 0 && currentValue.charAt(0) == '-')
                        return false;

                    //Disallows more than one decimal point.
                    if (currentValue.match(/[.]/))
                        return false;
                }

                else if (allowNegative == true && inputCode == 45)	// Conditions for a decimal point
                {
                    if(currentValue.charAt(0) == '-')
                        return false;

                    if(getCaret(element) != 0)
                        return false;
                }

                else if (inputCode == 8) 	// Allows backspace
                    return true;

                else								// Disallow non-numeric
                    return false;
            }

            else if(inputCode > 0 && (inputCode >= 48 && inputCode <= 57))	// Disallows numbers before a negative.
            {
                if (allowNegative == true && currentValue.charAt(0) == '-' && getCaret(element) == 0)
                    return false;
            }

            return true;
        }

        function limitInputLength(element){
            var currentValue = $(element).val();

            if (limitInput && currentValue){
                if (parseInt(currentValue.length)>=parseInt(limitInput)){
                    return false;
                }
            }
            return true;
        }

        return this;
    };




    // Private function for selecting cursor position. Makes IE play nice.
    //	http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
    function getCaret(element)
    {
        if (element.selectionStart)
            return element.selectionStart;

        else if (document.selection) //IE specific
        {
            element.focus();

            var r = document.selection.createRange();
            if (r == null)
                return 0;

            var re = element.createTextRange(),
                rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);
            return rc.text.length;
        }

        return 0;
    };
}( jQuery ));