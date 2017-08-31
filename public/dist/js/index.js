var vSignupForm = new Vue({
    el: '#signupForm',
    data: {
        amount: '',
        title: '',
        fname: '',
        lname: '',
        email: '',
        mobile: ''
    },
    created: function () {
        $(".loader").fadeOut(400);
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.amount != ''
                && this.fname != ''
                && this.lname != ''
                && this.title != ''
                && this.email != ''
                && this.mobile != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {
                // console.log(this.$data);
                this.$http.post('/api/posts', this.$data).then(function (res) {
                    // console.log(res);
                    document.location.href = '/first-login'
                }, function (err) {
                    document.location.href = '/info?message=' + err.body.message;
                    // console.log('Error', err);
                })
            }
        }
    }
});
