var vFirstLogin = new Vue({
    el: '#login',
    data: {
        messages: [],
        username: '',
        password: '',
        code: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.username != ''
                && this.password != ''
                && this.code != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                const url = '/api/auth/first-login';
                const body = {username: this.username, password: this.password, mobileCode: this.code};

                this.$http.post(url, body).then(function (res) {
                    // console.log(res);
                    const token = res.body.token;
                    if (token) {
                        const email = res.body.email;
                        localStorage.setItem('token', token);
                        localStorage.setItem('currentUser', JSON.stringify({
                            email: email,
                            username: this.username,
                            token: token,
                            sid: res.body.sid
                        }));
                        document.location.href = '/reset-password'
                        // this.router.navigate(['reset-password']);
                    } else {
                        this.messages.push({type:'error',message:'Username, password or code incorrect'});
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
