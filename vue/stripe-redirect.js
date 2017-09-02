var stripeRedirectVue = new Vue({
    el: '#stripeRedirectVue',
    data: {
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content")
    },
    created: function () {
        $(".loader").fadeOut(200);
    },
    computed: {},
    methods: {}
});
