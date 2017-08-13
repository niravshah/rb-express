var vSignupForm = new Vue({
    el: '#signupForm',
    data: {
        amount: '500',
        title: 'Test',
        fname: 'Nirav',
        lname: 'Shah',
        email: 'n@n.co',
        mobile: '07596162765'
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
                console.log(this.$data);
                this.$http.post('/api/posts', this.$data).then(function(res){
                    console.log(res);
                },function (err) {
                    console.log('Error',err);
                })
            }
        }
    }
});
