

// checks if input contains only numeric values and doesnt go above limit if limit is specified
(function( $ ) {
    // Plugin defaults
    var defaults = {
        limitInput: false,
        errorClass: 'error',
        errorDataName : 'input-error'
    };

    $.fn.numericInput = function( options ) {
        var self, settings,limitInput, errorClass, errorDataName, errorTypes, timeOut;
        self = this;
        settings = $.extend( {}, defaults, options );
        limitInput = settings.limitInput;
        errorClass = settings.errorClass;
        errorDataName = settings.errorDataName;
        errorTypes = {
            lengthLimit : 'lengthLimit',
            noneNumeric : 'noneNumeric',
            notAllowed : 'notAllowed'
        };

        this.setValidity = function(isValid, type){
            type = type || errorTypes.notAllowed;
            if(isValid) {
                $(self).removeClass(errorClass);
                $(self).data(errorDataName, '');
            } else {
                $(self).addClass(errorClass);
                $(self).data(errorDataName, type);
            }
        };

        this.isNumericValue = function(){
            if(!$(self).val()) return true;
            return $.isNumeric($(self).val());
        };

        this.limitInputLength = function (){
            var currentValue = $(self).val();

            if (limitInput && currentValue){
                if (parseInt(currentValue.length) > parseInt(limitInput)){
                    return false;
                }
            }
            return true;
        };

        this.validateInput = function(e){

            if(!self.isNumericValue()){
                self.setValidity(false, errorTypes.noneNumeric);
                return true;
            }


            if(!self.limitInputLength()){
                self.setValidity(false , errorTypes.lengthLimit);
                return true;
            }

            self.setValidity(true);
            return true;
        };

        this.on("cut paste, keypress", function(e){
            if(timeOut)clearTimeout(timeOut);

            timeOut = setTimeout(function(){
                self.validateInput(e);
                clearTimeout(timeOut);
            },0);

            return true;
        });

        return this;
    };
}( jQuery ));