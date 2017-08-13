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
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.amount != ''
                && this.fname!=''
                && this.lname!=''
                && this.title != ''
                && this.email != ''
                && this.mobile!='';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {
            }
        }
    }
});
