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


                var url = '/api/posts';

                this.$http.post(url, this.$data).then(function (res) {
                    // console.log(res);
                    document.location.href = '/first-login'
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
