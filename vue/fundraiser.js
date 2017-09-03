var vFundraiser = new Vue({
    el: '#funraiserController',
    data: {
        messages: [],
        activities: [],
        connected: false,
        chargesEnabled: false,
        detailsSubmitted: false,
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        accountSid: $("meta[name='account-sid']").attr("content")
    },
    created: function () {
        $(".loader").fadeOut(200);
        //console.log(this.postSid, this.authorSid, this.accountSid);

        if (this.accountSid != "none") {
            this.connected = true;
            this.getAccountStatus(this.accountSid);
            this.getPostActivity(this.postSid);
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
            if (this.isAuthorLogin()) {
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
        getPostActivity: function (sid) {
            var headers = {'Authorization': 'JWT ' + localStorage.getItem('token')};
            var url = '/api/posts/' + sid + '/activities';
            this.$http.get(url, {headers: headers}).then(function (res) {
                if (res.ok) {
                    //console.log(res);
                    this.activities = res.body.activities;
                }
            })
        }
    }
});


