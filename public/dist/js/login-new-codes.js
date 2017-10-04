var vLoginResetCodes = new Vue({
    el: '#login',
    data: {
        messages: [],
        username: '',
        phone: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.username != ''
                && this.phone != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                var url = '/api/auth/login-new-codes';
                var body = {email: this.username, mobile: this.phone};

                this.$http.post(url, body).then(function (res) {
                    // console.log(res);
                    document.location.href = '/first-login'
                }, function (err) {
                    // console.log('Error', err);
                    if (err.status == 404) {
                        this.messages.push({type: 'error', message: 'Page Not Found: ' + err.url});
                    } else {
                        this.messages.push({type: 'error', message: err.body.message});
                    }

                })
            }
        }
    }
});
