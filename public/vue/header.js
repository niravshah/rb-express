var vHeader = new Vue({
    el: 'header',
    mixins: [jwtMixin],
    data: {
        loggedIn: false
    },
    created: function () {
        // console.log('Header',this.tokenValid());
        this.loggedIn = this.tokenValid();
    },
    methods: {}
});
