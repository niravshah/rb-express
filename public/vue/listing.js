var vListing = new Vue({
    el: '#property',
    data: {
        posts: []
    },
    created: function () {
        var headers = {'Authorization': 'JWT ' + localStorage.getItem('token')};
        var url = '/api/user/posts';


        this.$http.get(url, {headers: headers}).then(function (res) {
            this.posts = res.body;
            // console.log(res);
        }, function (err) {

            // console.log('Error', err);
            if (err.status == 404) {
                this.messages.push({type: 'error', message: 'Page Not Found: ' + err.url});
            } else {
                this.messages.push({type: 'error', message: err.body.message});
            }

        })
    },
    filters: {
        currency: function (value, currency) {
            if (currency == 'GBP') return '£' + value;
            else return currency + value;

        },
        titlecase: function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    },
    computed: {},
    methods: {}
});

Vue.directive('timeleft', function (el, bindings) {
    el.style.backgroundColor = 'yellow';
    var date1 = new Date().getTime();
    var date2 = Date.parse(bindings.value.date);
    var timeDiff = date1 - date2;
    var daysLeft = Math.ceil(30 - timeDiff / (1000 * 3600 * 24));
    if (daysLeft < 0) {
        daysLeft = 0
    }
    ;
    el.innerText = daysLeft + ' days left';
});
