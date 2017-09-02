var vFundraiser = new Vue({
    el: '#funraiserController',
    data: {
        messages: [],
        connected: false,
        chargesEnabled: false,
        detailsSubmitted: false,
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        accountSid: $("meta[name='account-sid']").attr("content")
    },
    created: function () {
        $(".loader").fadeOut(200);
        console.log(this.postSid, this.authorSid, this.accountSid);

        if (this.accountSid != undefined) {
            this.connected = true;
            this.getAccountStatus(this.accountSid);
        }
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
        },
        getAccountStatus: function (sid) {
            var headers = {'Authorization': 'JWT ' + localStorage.getItem('token')};
            var url = '/api/stripe/account/' + sid + '/status';
            this.$http.get(url, {headers: headers}).then(function (res) {
                if (res.ok) {
                    this.chargesEnabled = res.body.charges_enabled;
                    this.detailsSubmitted = res.body.details_submitted;
                }

            })

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


