$(document).ready(function(){
console.log('ready');
    $('#select-beast').selectize({
        create: true,
        sortField: 'text'
    });

    $('input').on('input', function(event) {
        const $self = $(event.currentTarget);
        const value = $self.val().trim();

        if (value) {
            $self.addClass('filled');
        } else {
            $self.removeClass('filled');
        }
    });
    $('option').on('option', (event) => {
        const $self = $(event.currentTarget);
        const value = $self.val().trim();

        if (value) {
            $self.addClass('filled');
        } else {
            $self.removeClass('filled');
        }
    });

    $('.tooltip').tooltipster({
        animation: 'fade',
        delay: 200,
        theme: ['tooltipster-borderless', 'tooltipster-borderless-customized']
    });

    /*Валидация форм*/
    function valideForms(form) {
        $(form).validate({
            rules: {
                cardNumber: {
                    required: true,
                    minlength: 16,
                    maxlength: 16,
                    creditcard: true
                },
                /*name: "required",*/
                year: {
                    required: true,
                    maxlength: 4,
                    date: true,
                    number: true
                },
                cvc: {
                    required: true,
                    maxlength: 3,
                    number: true
                }
            },
            messages: {
                /*name: "Пожалуйста введите свое имя",*/
                cardNumber: {
                    required: "Пожалуйста введите номер карты",
                    minlength: jQuery.validator.format("Введите не менее 16 символов!"),
                    maxlength: jQuery.validator.format("Введите не более 16 символов!")
                },
                year: "Укажите год",
                cvc: "Укажите CVC код",
                email: {
                    required: "Введите свою электронную почту",
                    email: "Ваш адрес электронной почты должен быть в формате name@domain.com"
                },
                message: "Пожалуйста задайте свой вопрос"
            }
        });
    }

    valideForms('#form-payment');

});
document.querySelector('#card-number').oninput = function () {
    let cardNum = this.value;
    if (cardNum.trim().length > 5) {
        let cardInfo = new CardInfo(cardNum.trim(), {
            banksLogosPath: 'assets/img/banks/',
            brandsLogosPath: './node_modules/card-info/dist/brands-logos'
        });
        console.log(cardInfo.bankName);
        console.log(cardInfo.bankLogo);
        console.log(cardInfo.brandLogo);
        console.log(cardInfo.backgroundColor);
        document.querySelector('.bank-logo__img').src = cardInfo.bankLogo;
        document.querySelector('.card-front').style.backgroundColor = cardInfo.backgroundColor;
    }
}

