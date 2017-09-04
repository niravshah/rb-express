var fundraiserShareVue = new Vue({
    el: '#fundraiserShareVue',
    data: {
        messages: [],
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        authorName: $("meta[name='author-name']").attr("content"),
        accountSid: $("meta[name='account-sid']").attr("content"),
        shareMessage: ''
    },
    mounted: function () {
    },
    created: function () {
        $(".loader").fadeOut(200);
        this.shareMessage = 'Help ' + this.authorName + ' Raise Better!';
    },
    computed: {},
    methods: {
        closeBtn: function (command) {
            console.log('Close Button Clicked!', command);
            if (command == 'close') {
                document.location.href = '/fundraisers/' + this.postSid;
            }
        },
        share: function () {
            FB.ui({
                method: 'share',
                href: 'https://raisebetter.uk/fundraisers/' + this.postSid
            }, function (response) {
                console.log('FB Share dialog response: ', response);
            });
        }
    }
});
