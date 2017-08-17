var vResetPassword = new Vue({
    el: '#login',
    data: {
        messages: [],
        password: '',
        repeatPassword: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.password != ''
                && this.repeatPassword != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                const headers = {'Authorization': 'JWT ' + localStorage.getItem('token')};
                const url = '/api/auth/reset-password';

                const body = {password: this.password, repeatPassword: this.repeatPassword};

                this.$http.post(url, body, headers).then(function (res) {
                    console.log(res);
                    const token = res.token;
                    if (token) {
                        localStorage.setItem('token', token);
                        document.location.href = '/home'
                        // this.router.navigate(['reset-password']);
                    } else {
                        this.messages.push({type: 'error', message: 'Username, password or code incorrect'});
                    }
                }, function (err) {
                    // console.log('Error', err);
                    if(err.status == 404){
                        this.messages.push({type:'error',message:'Page Not Found: ' + err.url});
                    }else{
                        this.messages.push({type:'error',message:err.message});
                    }

                })
            }
        }
    }
});
