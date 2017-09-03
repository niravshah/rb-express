var fundraiserDonateVue = new Vue({
    el: '#fundraiserDonateVue',
    data: {
        messages: [],
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        accountSid: $("meta[name='account-sid']").attr("content"),
        paymentForm: {amount: '50', name: 'Nirav Shah', email: 'nshah@email.com', message: 'Good Luck!'}
    },
    created: function () {
        $(".loader").fadeOut(200);

        this.stripe = Stripe('pk_test_rsKIu2V1fmgDKrpy2yirvZxQ');

        const elements = this.stripe.elements();

        const style = {
            base: {
                color: '#32325d',
                lineHeight: '24px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        Vue.card = elements.create('card', {style: style});
        Vue.card.mount('#card-element');
        const _this = this;
        Vue.card.addEventListener('change', function (event) {
            if (event.error) {
                _this.addCardError(event.error.message);
            } else {
                _this.addCardError('');
            }
        });


    },
    computed: {},
    methods: {
        closeBtn: function (command) {
            console.log('Close Button Clicked!', command);
            if (command == 'close') {
                document.location.href = '/fundraisers/' + this.postSid;
            }
        },
        addCardError: function (message) {
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = message;
        },
        toggleOverlay: function () {
            $('#overlay').toggle();
        },
        createToken:function(){
            this.toggleOverlay();
            this.stripe.createToken(Vue.card).then(function(result){
                console.log(result);
            })
        }
    }
});
