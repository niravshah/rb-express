var vInfo = new Vue({
    el: '#editAuthorVue',
    data: {
        messages: [],
        author: {
            fname: '',
            lname: '',
            bio: '',
            avatar: ''
        },
        postSid: $("meta[name='post-sid']").attr("content"),
        authorSid: $("meta[name='author-sid']").attr("content"),
        url: ''
    },
    created: function () {
        $(".loader").fadeOut(400);
        console.log(this.postSid, this.authorSid);
        this.$http.get('/api/posts/' + this.postSid).then(function (res) {
            console.log('Post', res.body);
            this.author = res.body.author;
        }, function (error) {
            console.log('Error', error)
        })
    },
    computed: {},
    methods: {
        previewImage: function (event) {
            var _this = this;
            if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (event2) {
                    this.target = event2.target;
                    _this.url = this.target.result;
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        },
        closeBtn: function (command) {
            console.log('Close Button Clicked!', command);
        }
    }
});
