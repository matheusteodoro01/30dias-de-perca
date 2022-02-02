var getKetoDietFormSubmit;

$(function () {

    $(document).ready(function () {
       $('input[type="checkbox"]').each(function () {
           if($(this).prop('checked')){
               $(this).parent().parent().addClass('checked');
           }else{
               $(this).parent().parent().removeClass('checked');
           }
       });

        $('input[type="radio"]').each(function () {
            if($(this).prop('checked')){
                $(this).parent().addClass('checked');
            }else{
                $(this).parent().removeClass('checked');
            }
        });

        $('#gender-select label').click(function () {
            $('#gender-select label').removeClass('checked');
            $(this).addClass('checked');
            $(this).find('input').prop('checked',true);
            //setTimeout("$('#navigation li:nth-child(' + (parseInt(" + current + ")+1) + ') a').click();", 1000);
        });
    });
    /*
    number of fieldsets
    */
    var fieldsetCount = $('#formElem').children().length;

    /*
    current position of fieldset / navigation link
    */
    var current = 1;

    /*
    sum and save the widths of each one of the fieldsets
    set the final sum as the total width of the steps element
    */
    var stepsWidth = 0;
    var widths = new Array();
    $('#steps .step').each(function (i) {
        var $step = $(this);
        widths[i] = stepsWidth;
        stepsWidth += $step.width();
    });
    $('#steps').width(stepsWidth);

    /*
    to avoid problems in IE, focus the first input of the form
    */
    $('#formElem').children(':first').find(':input:first').focus();

    /*
    show the navigation bar
    */
    $('#navigation').show();

    /*
    when clicking on a navigation link
    the form slides to the corresponding fieldset
    */
    $('#navigation a.nav').bind('click', function (e) {
        var $this = $(this);
        var prev = current;
        $this.closest('ul').find('li').removeClass('selected');
        $this.parent().addClass('selected');
        /*
        we store the position of the link
        in the current variable
        */
        current = $this.parent().index() + 1;
        /*
        animate / slide to the next or to the corresponding
        fieldset. The order of the links in the navigation
        is the order of the fieldsets.
        Also, after sliding, we trigger the focus on the first
        input element of the new fieldset
        If we clicked on the last link (confirmation), then we validate
        all the fieldsets, otherwise we validate the previous one
        before the form slided
        */
        $('#steps').stop().animate({
            marginLeft: '-' + widths[current - 1] + 'px'
        }, 500, function () {
            if (current == fieldsetCount){
                console.log('last');
                validateSteps();
                $('.cbtb').show();
            } else{
                validateSteps();
                $('.cbtb').hide();
            }

            $('#formElem').children(':nth-child(' + parseInt(current) + ')').find(':input:first').focus();
        });
        e.preventDefault();
    });

    $('#continue').bind('click', function (e) {

        current +=1;
        if(validateSteps()){
            alert(lajax.t('Pls fill all info'));
            current -=1;
            return;
        }
        //check if user created
        //submit form
        if(!$(this).prop('disabled')){
            getKetoDietFormSubmit();
        }
        return;

        var user_id = parseInt($('#user-id-input').val());

        if(user_id > 0){
            console.log('user already created');
            getKetoDietFormSubmit();
            return;
        }

        var $this = $(this);
        var prev = current;
        $('#navigation ul').find('li').removeClass('selected');
        $('#steps').stop().animate({
            marginLeft: '-' + widths[current - 1] + 'px'
        }, 500, function () {

            $('.cbtb').show();
            $('#formElem').children(':nth-child(' + parseInt(current) + ')').find(':input:first').focus();
        });
        e.preventDefault();
    });

    /*
    clicking on the tab (on the last input of each fieldset), makes the form
    slide to the next step
    */
    $('#formElem > fieldset').each(function () {
        var $fieldset = $(this);
        $fieldset.children(':last').find(':input').keydown(function (e) {
            if (e.which == 9) {
                $('#navigation li:nth-child(' + (parseInt(current) + 1) + ') a').click();
                /* force the blur for validation */
                $(this).blur();
                e.preventDefault();
            }
        });
    });

    /*
    clicking on the checkbox , makes the form
    slide to the next step
    */
    $('.click-to-next').mousedown(function (e) {

        if (e.which == 1 && validateStep(current) == 1) {
            setTimeout("$('#navigation li:nth-child(' + (parseInt(" + current + ")+1) + ') a').click();", 1000);
            /* force the blur for validation */
            $(this).blur();
            e.preventDefault();
        }
    });

    $('#gender-select input').click(function (e) {

        if (e.which == 1 && validateStep(current) == 1) {
            setTimeout("$('#navigation li:nth-child(' + (parseInt(" + current + ")+1) + ') a').click();", 1000);
            /* force the blur for validation */
            $(this).blur();
        }
    });

    $('#activity-select input').click(function (e) {
        console.log('current '+current);
        if (e.which == 1 && validateStep(current) == 1) {

            setTimeout("$('#navigation li:nth-child(' + (parseInt(" + current + ")+1) + ') a').click();", 1000);
            /* force the blur for validation */
            $(this).blur();
        }
    });

    $('.click-to-prev').mousedown(function (e) {
        console.log('current '+current);
        if (e.which == 1) {

            console.log('current '+current);
            setTimeout("$('#navigation li:nth-child(' + (parseInt(" + current + ")-1) + ') a').click();", 1000);
            /* force the blur for validation */
            $(this).blur();
            e.preventDefault();
        }
    });

    $('#activity-select label').click(function (e) {
        $('#activity-select label').removeClass('checked');
       //$(this).parent().find('label').
       $(this).addClass('checked');
    });

    $('.gradient-round-input-container label').click(function (e) {
        var input = $(this).find('input');
        if(input.prop('checked')){
            $(this).parent().addClass('checked');
        }else{
            $(this).parent().removeClass('checked');
        }

        //$(this).parent().find('label').

    });
    /*
    validates errors on all the fieldsets
    records if the Form has errors in $('#formElem').data()
    */
    function validateSteps() {
        var FormErrors = false;
        for (var i = 1; i <= (fieldsetCount -1 ); ++i) {
            console.log('i = ' + i);
            if(i >= current ){
                console.log('uncheck current = ' + current);
                var $link = $('#navigation li:nth-child(' + parseInt(i) + ') a');
                $link.removeClass('checked');
                return false;
            }else{
                if (validateStep(i) == -1){
                    console.log('error on '+i+' step');
                    FormErrors = true;
                }

            }


        }
        $('#formElem').data('errors', FormErrors);

        return FormErrors;
    }

    /*
    validates one fieldset
    and returns -1 if errors found, or 1 if not
    */
    function validateStep(step) {
        var $link = $('#navigation li:nth-child(' + parseInt(step) + ') a');

        if (step == fieldsetCount) return;
        console.log('validate step ' +  step);
        var error = 1;
        var hasError = false;
        if(step == 1 ||step == 2 ||step == 3 || step == 4 || step == 5){
            hasError = true;
            $('#formElem').children(':nth-child(' + (parseInt(step)+1) + ')').find(':input:not(button)').each(function () {
                if ($(this).prop('checked')) {
                    hasError = false;
                    console.log($(this).val()+ " is checked");
                }
            });
            if(hasError){
                console.log('step '+step+' has an error');
                $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find('.error-msg').html(lajax.t('You should select at least one.'))
            }else{
                console.log('step '+step+' has no error');
                $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find('.error-msg').html('')
            }
        }else if(step == 6){
            $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find(':input:not(button)').each(function () {
                var $this = $(this);

                    var value = parseInt($this.val());
                    var valueLength = jQuery.trim($this.val()).length;
                    var min = parseInt($this.attr('min'));
                    var max = parseInt($this.attr('max'));
                    if (valueLength == '' || value < min || value > max) {
                        console.log('form has error');
                        hasError = true;
                        $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find('.error-msg').html(lajax.t('Please enter correct values.'));
                    }else{
                        console.log('form has no error');
                        $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find('.error-msg').html('');
                    }

            });
        }else if(step == 7){
            $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find(':input:not(button)').each(function () {
                var $this = $(this);

                var value = $this.val();
                var skip = $this.hasClass('skip');
                var valueLength = jQuery.trim(value).length;
                if (valueLength == '' && !skip ) {
                    console.log('form has error');
                    hasError = true;
                    $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find('.error-msg').html(lajax.t('Please enter correct values.'));
                }else{
                    console.log('form has no error');
                    $('#formElem').children(':nth-child(' +  (parseInt(step)+1) + ')').find('.error-msg').html('');
                }

            });
        }


        $link.removeClass('checked');

        var valclass = 'checked';
        if (hasError) {
            error = -1;
            valclass = 'error';
        }
        $link.addClass(valclass);
        //$('<span class="'+valclass+'"></span>').insertAfter($link);

        return error;
    }


    /*
    if there are errors don't allow the user to submit
    */
    $('#registerButton').bind('click', function () {
        if ($('#formElem').data('errors')) {
            alert('Please correct the errors in the Form');
            return false;
        }else{
            $('#formElem').submit();
        }
    });


    $('#get-diet-button').on('click',function () {
        var error = validateStep(7);
        console.log('error = '+error);
        if(error == 1){

            subscribeUser();
        }
    });

    var subscribeUser = function () {
        var name = $('#name-input').val();
        var mail = $('#mail-input').val();
        $('#awf_field-name').val(name);
        $('#awf_field-email').val(mail);
        $.ajax({
            url: 'https://www.aweber.com/scripts/addlead.pl',
            data: $('#af-form').serialize(),
            type: 'post',
            complete: function () {
                getKetoDietFormSubmit();
            }
        });
    };
    getKetoDietFormSubmit = function() {

        $('.download-ebook-button').prop('disabled',true) ;
        $('#spinner').show(400);
        var formData = $('#formElem').serialize();


        $.ajax({
            url: createDietUserUrl,
            type: 'POST',
            dataType: 'json',
            data: formData,
            success: function (data) {
                if(data.success){
                    window.location.href = data.clickBankUrl;
                }else{

                }
            },
            complete: function () {
                $('.download-ebook-button').prop('disabled',false) ;
                $('#spinner').hide(400);
            }

        })
    }

    $('.metric-form input').change(function () {
        var name = $(this).attr('name');
        var value = $(this).val();
        //recalculate value
        switch (name){
            case 'age' :
                $('#input-age_i').val(value);
                break;
            case 'height':

                var ft = Math.floor(value/30.48);
                var inch = Math.floor((value - (ft*30.48))/2.54);

                $('#input-height_i_ft').val(ft);
                $('#input-height_i_inh').val(inch);
                break;
            case 'weight':
                value = Math.ceil(value/0.45);
                $('#input-weight_i').val(value);
                break;
            case 'target_weight':
                value = Math.ceil(value/0.45);
                $('#input-target_weight_i').val(value);
                break;
            case 'age_i' :
                $('#input-age').val(value);
                break;
            case 'height_i_ft':

                var inch = $('#input-height_i_inh').val();
                value = Math.ceil(value * 30.48 + inch * 2.54);
                $('#input-height').val(value);
                break;
            case 'height_i_inh':
                var ft = $('#input-height_i_ft').val();
                value = Math.ceil(ft * 30.48 + value * 2.54);
                $('#input-height').val(value);
                break;
            case 'current_i_weight':
                value = Math.ceil(value*0.45);
                $('#input-weight').val(value);
                break;
            case 'target_i_weight':
                value = Math.ceil(value*0.45);
                $('#input-target_weight').val(value);
                break;
        }
        return false;
    });


    $('#metric').change(function () {
        if($(this).prop('checked')){
            $('#metric-form').show();
            $('#imperial-form').hide();

        }else{
            $('#metric-form').hide();
            $('#imperial-form').show();
        }
    });

    $('.input-field-row input').on('change',function () {
        var value = $(this).val();
        var min = parseFloat($(this).attr('min'));
        var max = parseFloat($(this).attr('max'));
        var show_error = false;
        var err_txt = lajax.t('please enter value');
        if(value < min){
            err_txt += lajax.t(' greater than or equal to ')+min;
             show_error = true;
        }
        if(value > max){
            err_txt += lajax.t(' less than or equal to ')+max;
             show_error = true;
        }
        if(!show_error){
            $(this).parent().removeClass('input--error');
            $(this).parent().find('.a-input__input--error').hide();
            return
        }
        $(this).parent().addClass('input--error')
        $(this).parent().find('.a-input__input--error').html(err_txt);
        $(this).parent().find('.a-input__input--error').show();


    })

});