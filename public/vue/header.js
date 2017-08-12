var vHeader =  new Vue({
        el: 'header',
        mixins: [jwtMixin],
        data: {
            loggedIn: true
        },
        created: function () {
            console.log('tokenNotExpired', this.tokenValid());
            this.loggedIn = this.tokenValid();
        },
        methods: {}
    });
