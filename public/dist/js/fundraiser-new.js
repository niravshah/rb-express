var newFundraiserVue = new Vue({
    el: '#newFundraiserVue',
    data: {
        messages: [],
        amount: '',
        title: '',
        currency:'£'
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.amount != ''
                && this.title != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                var headers = {'Authorization': 'JWT ' + localStorage.getItem('token')};

                var url = '/api/posts/new';
                var body = {title: this.title, amount: this.amount, currency:this.currency};

                this.$http.post(url, body, {headers: headers}).then(function (res) {
                    // console.log(res);
                    document.location.href = '/home'
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
