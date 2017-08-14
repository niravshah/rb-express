var vHeader = new Vue({
    el: 'header',
    mixins: [jwtMixin],
    data: {},
    computed: {
        loggedIn: this.tokenValid()
    },
    methods: {}
});
