var getKetoDietFormSubmit;

$(function () {

});

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });

}


var vm = new Vue({
    el: '#wrapper',
    data: {
        step: 1,
        error_msg: '',
        metric_valid: true,
        rules: {
            weight: {
                min: 39,
                max: 181
            },
            age: {
                min: 13,
                max: 101
            },
            height: {
                min: 129,
                max: 243
            },
            target_weight: {
                min: 39,
                max: 181
            },
            weight_i: {
                min: 87,
                max: 401
            },
            height_i_ft: {
                min: 3,
                max: 8
            },
            height_i_inh: {
                min: -1,
                max: 12
            },
            target_weight_i: {
                min: 87,
                max: 401
            },
        },
        form: {
            gender: null,
            activity_level: null,
            meal_tag_meat: [],
            meal_tag_veg: [],
            meal_tag_other: [],
            weight: null,
            age: null,
            height: null,
            target_weight: null,
            current_i_weight: null,
            height_i_ft: null,
            height_i_inh: null,
            target_i_weight: null,
            metric: false,
            imperial_metric: true,
            _csrf: '',
            meal: [],
            optin_email: '',
            first_name: '',
        }
    },
    methods: {
        goToNext: function (i) {
            //  console.log('go to step ' + i + " " + (this.step + 1));
            if (this.step < 6 && this.validateStep(this.step)) {
                window.setTimeout("vm.step++;", 600)
            }
        },
        goToPrev: function () {
            if (this.step > 1) this.step--;
        },
        getNavPointStyle: function (n) {
            if (n < this.step) {
                return 'checked'
            } else {
                return ''
            }
        },
        getCheckboxClass: function (val, field) {
            if (this.form[field] === val) {
                return 'checked';
            }
            return '';
        },
        checkMeat: function () {
            if (this.form.meal_tag_meat.includes('no-meat')) {
                this.form.meal_tag_meat = ['no-meat']
            }
        },
        resetNoMeat: function () {
            this.form.meal_tag_meat = arrayRemove(this.form.meal_tag_meat, 'no-meat')
        },
        getCheckboxArrClass: function (val, field) {
            if (this.form[field].includes(val)) {
                return 'checked';
            }
            return '';
        },
        validateStep: function (step) {
            if (step == 7) return;
            console.log('validate step ' + step);
            var error = 1;
            var err_msg = '';
            var valid = false;
            if (step == 1) {
                valid = true;
            } else if (step == 2) {
                valid = true;
                err_msg = lajax.t('Você deve selecionar pelo menos um..');
            } else if (step == 3) {
                valid = this.form.meal_tag_meat.length > 0;
                err_msg = lajax.t('Você deve selecionar pelo menos um..');
            } else if (step == 4) {
                valid = this.form.meal_tag_veg.length > 0;
                err_msg = lajax.t('Você deve selecionar pelo menos um..');
            } else if (step == 5) {
                valid = this.form.meal_tag_other.length > 0;
                err_msg = lajax.t('Você deve selecionar pelo menos um..');
            } else if (step == 6) {
                var valid = this.validateForm();
                if (valid) {
                    step = 6;
                    console.log('ready create user');
                    valid = true;
                } else {
                    valid = false;
                    err_msg = lajax.t('Por favor, insira os valores corretos');
                }
            } else if (step == 7) {
                valid = true;
            }

            if (valid) {
                this.error_msg = ''
            } else {
                this.error_msg = err_msg
            }

            return valid;
        },
        validateForm: function () {
            var valid = true;
            var rules = this.rules;
            var form = this.form;
            if (!this.form.imperial_metric) {
                valid = form.weight > rules.weight.min &&
                    form.weight < rules.weight.max &&
                    form.age > rules.age.min &&
                    form.age < rules.age.max &&
                    form.target_weight > rules.target_weight.min &&
                    form.target_weight < rules.target_weight.max &&
                    form.height > rules.height.min &&
                    form.height < rules.height.max;
            } else {
                valid = form.current_i_weight > rules.weight_i.min &&
                    form.current_i_weight < rules.weight_i.max &&
                    form.age > rules.age.min &&
                    form.age < rules.age.max &&
                    form.target_i_weight > rules.target_weight_i.min &&
                    form.target_i_weight < rules.target_weight_i.max &&
                    form.height_i_ft > rules.height_i_ft.min &&
                    form.height_i_ft < rules.height_i_ft.max &&
                    form.height_i_inh > rules.height_i_inh.min &&
                    form.height_i_inh < rules.height_i_inh.max;
            }
            return valid;
        },
        validateInput: function (event) {
            var el = event.target
            var value = $(el).val();
            var min = parseFloat($(el).attr('min'));
            var max = parseFloat($(el).attr('max'));
            var show_error = false;
            var err_txt = lajax.t('por favor insira o valor');
            if (value < min) {
                err_txt += lajax.t(' Maior ou igual a ') + min;
                show_error = true;

            }
            if (value > max) {
                err_txt += lajax.t(' Menor ou igual  a ') + max;
                show_error = true;
            }
            this.metric_valid = !show_error;
            if (!show_error) {
                $(el).parent().removeClass('input--error');
                $(el).parent().find('.a-input__input--error').hide();
                this.convertValue(event);
                return
            }
            $(el).parent().addClass('input--error')
            $(el).parent().find('.a-input__input--error').html(err_txt);
            $(el).parent().find('.a-input__input--error').show();
        },
        createUser: function () {
            console.log('create user');
            if (this.validateForm()) {
                $('.download-ebook-button').prop('disabled', true);
                $('#spinner').show(400);
                this.form._csrf = $('input [name="crf"]').val();
                this.form.meal = this.form.meal_tag_meat.concat(this.form.meal_tag_veg).concat(this.form.meal_tag_other);
                  

                var sendInfo = {
                    gender: this.form.gender,
                    activity_level: this.form.activity_level,
                    weight: this.form. weight,
                    age: this.form.age,
                    height: this.form.height,
                    target_weight: this.form.target_weight,
                    current_i_weight: this.form.current_i_weight,
                    height_i_ft: this.form.height_i_ft,
                    height_i_inh: this.form.height_i_inh,
                    target_i_weight: this.form.target_i_weight,
                    metric: this.form.metric,
                    imperial_metric: this.form.imperial_metric,
                    optin_email: this.form.optin_email,
                    first_name: this.form. first_name,

                };
              

                $.ajax({
                    type: "POST",
                    url: "https://sheetdb.io/api/v1/l7hdhy3masloa",
                    dataType: "json",
                    success: function (msg) {
                        if (msg) {
                            window.location.href = 'signup.html'
                        } else {
                            window.location.href = 'signup.html'
                        }
                    },
                    data: sendInfo
                });




            } else {

                this.validateStep(this.step);
            }

        },
        convertValue: function (event) {
            var name = $(event.target).attr('name');
            var value = $(event.target).val();
            var ft;
            var inch;
            //recalculate value
            switch (name) {
                case 'age':
                    break;
                case 'height':
                    ft = Math.floor(value / 30.48);
                    inch = Math.floor((value - (ft * 30.48)) / 2.54);
                    this.form.height_i_inh = inch;
                    this.form.height_i_ft = ft;
                    break;
                case 'weight':
                    value = Math.ceil(value / 0.45);
                    this.form.current_i_weight = value;
                    break;
                case 'target_weight':
                    value = Math.ceil(value / 0.45);
                    this.form.target_i_weight = value;
                    break;
                case 'age_i':
                    break;
                case 'height_i_ft':
                    inch = this.form.height_i_inh;
                    value = Math.ceil(value * 30.48 + inch * 2.54);
                    this.form.height = value;
                    break;
                case 'height_i_inh':
                    ft = this.form.height_i_ft;
                    value = Math.ceil(ft * 30.48 + value * 2.54);
                    this.form.height = value;
                    break;
                case 'current_i_weight':
                    value = Math.ceil(value * 0.45);
                    this.form.weight = value;
                    break;
                case 'target_i_weight':
                    value = Math.ceil(value * 0.45);
                    $this.form.target_weight = value;
                    break;
            }
            return false;
        }
    }
});

$(document).ready(function () {

    $('input[type="radio"]').each(function () {
        if ($(this).prop('checked')) {
            $(this).parent().addClass('checked');
        } else {
            $(this).parent().removeClass('checked');
        }
    });


    $('#activity-select label').click(function (e) {
        $('#activity-select label').removeClass('checked');
        //$(this).parent().find('label').
        $(this).addClass('checked');
    });

    $('.gradient-round-input-container label').click(function (e) {
        var input = $(this).find('input');
        if (input.prop('checked')) {
            $(this).parent().addClass('checked');
        } else {
            $(this).parent().removeClass('checked');
        }

        //$(this).parent().find('label').

    });

    getKetoDietFormSubmit = function () {

        $('.download-ebook-button').prop('disabled', true);
        $('#spinner').show(400);
        var formData = $('#formElem').serialize();


        $.ajax({
            url: createDietUserUrl,
            type: 'POST',
            dataType: 'json',
            data: formData,
            success: function (data) {
                if (data.success) {
                    window.location.href = data.clickBankUrl;
                } else {

                }
            },
            complete: function () {
                $('.download-ebook-button').prop('disabled', false);
                $('#spinner').hide(400);
            }

        })
    }


    $('.metric-form input').change(function () {
        var name = $(this).attr('name');
        var value = $(this).val();
        //recalculate value
        switch (name) {
            case 'age':
                $('#input-age_i').val(value);
                break;
            case 'height':

                var ft = Math.floor(value / 30.48);
                var inch = Math.floor((value - (ft * 30.48)) / 2.54);

                $('#input-height_i_ft').val(ft);
                $('#input-height_i_inh').val(inch);
                break;
            case 'weight':
                value = Math.ceil(value / 0.45);
                $('#input-weight_i').val(value);
                break;
            case 'target_weight':
                value = Math.ceil(value / 0.45);
                $('#input-target_weight_i').val(value);
                break;
            case 'age_i':
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
                value = Math.ceil(value * 0.45);
                $('#input-weight').val(value);
                break;
            case 'target_i_weight':
                value = Math.ceil(value * 0.45);
                $('#input-target_weight').val(value);
                break;
        }
        return false;
    });

    $('#spinner').hide(400);

    $("#wrapper").show(400);

});