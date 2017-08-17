var vLogin = new Vue({
    el: '#login',
    data: {
        messages: [],
        username: '',
        password: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.username != ''
                && this.password != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                const url = '/api/auth/login';
                const body = {username: this.username, password: this.password};

                this.$http.post(url, body).then(function (res) {
                    console.log(res);
                    const token = res.token;
                    if (token) {
                        const email = res.email;
                        localStorage.setItem('token', token);
                        localStorage.setItem('currentUser', JSON.stringify({
                            email: email,
                            username: this.username,
                            token: token,
                            sid: res.sid
                        }));
                        document.location.href = '/home'
                        // this.router.navigate(['reset-password']);
                    } else {
                        this.messages.push({type:'error',message:'Username or password incorrect'});
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
