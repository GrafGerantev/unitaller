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

});

