var vCookieRibbon = new Vue({
    el: '#cookie-ribbon',
    data: {},
    computed: {},
    created: function () {
        var cookir = $.cookie('rb-cookie-home');
        if (cookir) {
            $('#cookie-ribbon').hide();
        }
    },
    methods: {
        close: function () {
            $('#cookie-ribbon').hide();
            $.cookie('rb-cookie-home', 'rb-cookie-home');
        }
    }
});

var editAuthorVue = new Vue({
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
                var reader = new FileReader();
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

var vFirstLogin = new Vue({
    el: '#login',
    data: {
        messages: [],
        username: '',
        password: '',
        code: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.username != ''
                && this.password != ''
                && this.code != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                var url = '/api/auth/first-login';
                var body = {username: this.username, password: this.password, mobileCode: this.code};

                this.$http.post(url, body).then(function (res) {
                    // console.log(res);
                    var token = res.body.token;
                    if (token) {
                        var email = res.body.email;
                        localStorage.setItem('token', token);
                        localStorage.setItem('currentUser', JSON.stringify({
                            email: email,
                            username: this.username,
                            token: token,
                            sid: res.body.sid
                        }));
                        document.location.href = '/reset-password'
                        // this.router.navigate(['reset-password']);
                    } else {
                        this.messages.push({type:'error',message:'Username, password or code incorrect'});
                    }
                }, function (err) {
                    // console.log('Error', err);
                    if(err.status == 404){
                        this.messages.push({type:'error',message:'Page Not Found: ' + err.url});
                    }else{
                        this.messages.push({type:'error',message:err.message});
                    }

                })
            }
        }
    }
});


var vFundraiser = new Vue({
    el: '#funraiserController',
    data: {
        messages: []
    },
    created: function () {
        $(".loader").fadeOut(400);
    },
    computed: {},
    methods: {
        scrollTop: function () {
            $('html, body').animate({
                scrollTop: 200
            }, 700);

        },
        isAuthorLogin: function () {
            if (Vue.isLoggedIn()) {
                return $("meta[name='author-sid']").attr("content") == Vue.loggedInUserSid();
            }
            else {
                return false
            }
        }
    },
    filters: {
        percentcalc: function (value, total) {
            if (value !== 0 && total !== 0) {
                return Math.round((value / total) * 100);
            } else {
                return 0;
            }
        }
    }
});



var vHeader = new Vue({
    el: 'header',
    data: {
        loggedIn: false
    },
    created: function () {
        // console.log('Header',this.tokenValid());
        this.loggedIn = Vue.tokenValid();
    },
    methods: {
        openContactModal: function () {
            var modal = document.querySelector('#contact-modal');
            var modalOverlay = document.querySelector('#modal-overlay');
            modal.classList.toggle('closed');
            modalOverlay.classList.toggle('closed');
        },
        logout: function () {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            document.location.href = '/';
        }
    }
});

var vContactModal = new Vue({
    el: '#contactModalContainer',
    data: {
        loggedIn: false,
        messages: [],
        fname: '',
        lname: '',
        email: '',
        query: '',
        mobile: ''
    },
    created: function () {
        this.loggedIn = Vue.tokenValid();
    },
    methods: {
        close: function () {
            var modal = document.querySelector('#contact-modal');
            var modalOverlay = document.querySelector('#modal-overlay');
            modal.classList.toggle('closed');
            modalOverlay.classList.toggle('closed');
        }
    }
});

var vHome = new Vue({
    el: '#home',
    data: {},
    created: function () {
        $(".loader").fadeOut(400);
    }
});

var vSignupForm = new Vue({
    el: '#signupForm',
    data: {
        amount: '',
        title: '',
        fname: '',
        lname: '',
        email: '',
        mobile: ''
    },
    created: function () {
        $(".loader").fadeOut(400);
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.amount != ''
                && this.fname != ''
                && this.lname != ''
                && this.title != ''
                && this.email != ''
                && this.mobile != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {
                // console.log(this.$data);
                this.$http.post('/api/posts', this.$data).then(function (res) {
                    // console.log(res);
                    document.location.href = '/first-login'
                }, function (err) {
                    document.location.href = '/info?message=' + err.body.message;
                    // console.log('Error', err);
                })
            }
        }
    }
});

var vInfo = new Vue({
    el: '#info',
    data: {
        messages: []
    },
    computed: {},
    methods: {}
});

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

var vLogin = new Vue({
    el: '#login',
    data: {
        messages: [],
        username: '',
        password: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.username != ''
                && this.password != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                var url = '/api/auth/login';
                var body = {username: this.username, password: this.password};

                this.$http.post(url, body).then(function (res) {
                    // console.log(res);
                    var token = res.body.token;
                    if (token) {
                        var email = res.email;
                        localStorage.setItem('token', token);
                        localStorage.setItem('currentUser', JSON.stringify({
                            email: email,
                            username: this.username,
                            token: token,
                            sid: res.body.sid
                        }));
                        document.location.href = '/home'
                        // this.router.navigate(['reset-password']);
                    } else {
                        this.messages.push({type:'error',message:'Username or password incorrect'});
                    }
                }, function (err) {
                    // console.log('Error', err);
                    if(err.status == 404){
                        this.messages.push({type:'error',message:'Page Not Found: ' + err.url});
                    }else{
                        this.messages.push({type:'error',message:err.body.message});
                    }

                })
            }
        }
    }
});

var vResetPassword = new Vue({
    el: '#login',
    data: {
        messages: [],
        password: '',
        repeatPassword: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.password != ''
                && this.repeatPassword != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {

                var headers = {'Authorization': 'JWT ' + localStorage.getItem('token')};
                var url = '/api/auth/reset-password';

                var body = {password: this.password, repeatPassword: this.repeatPassword};

                this.$http.post(url, body, {headers: headers}).then(function (res) {
                    console.log(res);
                    var token = res.body.token;
                    if (token) {
                        localStorage.setItem('token', token);
                        document.location.href = '/home'
                        // this.router.navigate(['reset-password']);
                    } else {
                        this.messages.push({type: 'error', message: 'Username, password or code incorrect'});
                    }
                }, function (err) {
                    // console.log('Error', err);
                    if (err.status == 404) {
                        this.messages.push({type: 'error', message: 'Page Not Found: ' + err.url});
                    } else {
                        this.messages.push({type: 'error', message: err.body.message});
                    }

                })
            }
        }
    }
});

var vSignup = new Vue({
    el: '#login',
    data: {
        messages: [],
        amount: '',
        title: '',
        lname: '',
        fname: '',
        email: '',
        mobile: ''
    },
    computed: {
        isValid: function () {
            return !this.errors.any()
                && this.amount != ''
                && this.title != ''
                && this.lname != ''
                && this.fname != ''
                && this.email != ''
                && this.mobile != '';
        }
    },
    methods: {
        onSubmit: function () {
            if (!this.errors.any()) {


                var url = '/api/posts';

                this.$http.post(url, this.$data).then(function (res) {
                    // console.log(res);
                    document.location.href = '/first-login'
                }, function (err) {
                    // console.log('Error', err);
                    if(err.status == 404){
                        this.messages.push({type:'error',message:'Page Not Found: ' + err.url});
                    }else{
                        this.messages.push({type:'error',message:err.message});
                    }

                })
            }
        }
    }
});
