var fundraiserDonateVue = new Vue({
    el: '#fundraiserDonateVue',
    data: {
        messages: [],
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        accountSid: $("meta[name='account-sid']").attr("content")
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
        }
    }
});
