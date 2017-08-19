var vFundraiser = new Vue({
    el: '#property',
    data: {
        messages: []
    },
    created: function () {

        $(".loader").fadeOut(400);
    },
    computed: {},
    methods: {
        scrollTop: function () {
            $('html, body').animate({
                scrollTop: 200
            }, 700);

        }
    },
    filters: {
        percentcalc: function (value, total) {
            if (value !== 0 && total !== 0) {
                return Math.round((value / total) * 100);
            } else {
                return 0;
            }
        }
    }
});
