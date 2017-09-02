var vFundraiser = new Vue({
    el: '#funraiserController',
    data: {
        messages: []
    },
    created: function () {
        $(".loader").fadeOut(200);
    },
    computed: {},
    methods: {
        scrollTop: function () {
            $('html, body').animate({
                scrollTop: 200
            }, 700);

        },
        isAuthorLogin: function () {
            if (Vue.isLoggedIn()) {
                return $("meta[name='author-sid']").attr("content") == Vue.loggedInUserSid();
            }
            else {
                return false
            }
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


