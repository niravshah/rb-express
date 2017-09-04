var fundraiserDonateVue = new Vue({
    el: '#fundraiserDonateVue',
    data: {
        messages: [],
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        accountSid: $("meta[name='account-sid']").attr("content"),
        paymentForm: {amount: '50', name: 'Nirav Shah', email: 'nshah@email.com', message: 'Good Luck!'}
    },
    mounted: function () {

        try {

            var _this = this;
            var stripe = Stripe('pk_test_rsKIu2V1fmgDKrpy2yirvZxQ');
            var elements = stripe.elements();

            var style = {
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

            var card = elements.create('card', {style: style});
            card.mount('#card-element');
            card.addEventListener('change', function (event) {
                if (event.error) {
                    _this.addCardError(event.error.message);
                } else {
                    _this.addCardError('');
                }
            });

            document.querySelector('#donateForm').addEventListener('submit', function (e) {
                e.preventDefault();
                stripe.createToken(card, _this.paymentForm).then(_this.setOutcome);
            });

        } catch (ex) {
            if (ex instanceof ReferenceError) {
                this.addCardError("We are currently unable to process your donation as we could not load Stripe");
            }
        }

    },
    created: function () {
        $(".loader").fadeOut(200);
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
        setOutcome: function (result) {
            var successElement = document.querySelector('.success');
            var errorElement = document.querySelector('.error');
            successElement.classList.remove('visible');
            errorElement.classList.remove('visible');

            if (result.token) {
                successElement.querySelector('.token').textContent = result.token.id;
                successElement.classList.add('visible');
            } else if (result.error) {
                errorElement.textContent = result.error.message;
                errorElement.classList.add('visible');
            }
        }
    }
});
