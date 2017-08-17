var vCookieRibbon = new Vue({
    el: '#cookie-ribbon',
    data: {},
    computed: {},
    created: function () {
        var cookir = $.cookie('rb-cookie-home');
        if (cookir) {
            $('#cookie-ribbon').hide();
        }
    },
    methods: {
        close: function () {
            $('#cookie-ribbon').hide();
            $.cookie('rb-cookie-home', 'rb-cookie-home');
        }
    }
});
