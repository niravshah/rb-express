var vSignup = new Vue({
    el: '#login',
    data: {
        messages: [],
        amount: '',
        title: '',
        lname: '',
        fname: '',
        email: '',
        mobile: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.amount != ''
                && this.title != ''
                && this.lname != ''
                && this.fname != ''
                && this.email != ''
                && this.mobile != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {


                const url = '/api/posts';

                this.$http.post(url, this.$data).then(function (res) {
                    // console.log(res);
                    document.location.href = '/first-login'
                }, function (err) {
                    // console.log('Error', err);
                    this.messages.push({type: 'error', message: err.message});
                })
            }
        }
    }
});
