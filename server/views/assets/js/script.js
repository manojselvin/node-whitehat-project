/**
 * NETWORK CALLS
 * @author Manoj Selvin
 */

$(document).ready(function() {
     /**
     * Login API
     */

    $('#login-form, #register-form').on('submit', function(e) {
        e.preventDefault();
        
        let $elStatusMsg = $('.status-msg-block');
        $.ajax({
            url: '/users',
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res.data);
                if(res.status == 'success') {
                    $elStatusMsg.text(res.msg);
                    $elStatusMsg.addClass('alert-success').show();
                    window.location.href = res.data.redirectUrl;
                }
            },
            error: function(res) {
                console.log("in error");
                if (res.status == 'error') {
                    $elStatusMsg.text(res.msg);
                    $elStatusMsg.addClass('alert-danger').show();
                } 
            }
        });
    });
    
    /**
     * Fetch Weather Information
     */
    $(document).on('keypress', '#weather-search-input', function(e) {
        if (e.which == 13) {
            $('#weather-search-btn').click();
        }
    });

    $(document).on('click', '#weather-search-btn', function(e) {
        console.log("called api weather");
        $elListing = $('#weather-results-listing');

        // Show Loading Animation
        $elListing.html(`<div class="loading-element text-center"><i class="fa fa-spinner fa-spin text-info fa-5x"></i><h3>Fetching Results</h3></div>`);
    
        let cityName = $('#weather-search-input').val();
    
        if (!cityName) {
            return false;
        }
    
        $.ajax({
            url: '/weather',
            type: 'POST',
            dataType: 'json',
            data: { cityName },
            success: function(res) {
                if(res.status == 'success') {
                    let html = '';
                    html += loadTemplate("#weather-card-template", res.data.weatherData);
                    $elListing.html(html);
                }
            },
            error: function(res) {
                let ress = res.responseJSON;
                let html = '';
                html += loadTemplate("#weather-not-found-template", ress.data.weatherData);
                $elListing.html(html);
            }
        });
    });
    
    
    /**
     * Weather Card Templating
     */
    const loadTemplate = (templateSelector, data) => {
        var template = $(templateSelector).html();
        return eval('`' + template + '`');
    };

    /**
     * Climate - Temperature toggles
     * @description: Changes temperature into degree, kelvin, fahrenheit
     */
    $(document).on('click', '.climate-toggle', function() {
        let $el = $(this);
        $('.climate-temp').addClass('hidden');
        $('.climate-toggle').removeClass('active');
        
        let tempType = $el.data('temp-type');
        $el.addClass('active');
        $(`.${tempType}`).removeClass('hidden');
    });

    $(document).on('click', '.check-weather-again-btn', function() {
        let cityName = $(this).data('city-name');
        
        // Assigning City Name from history
        $('#weather-search-input').val(cityName);

        $('#historyModal').modal('toggle');

        $('#weather-search-btn').click();

        
    });
 
});
  
