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
            const modal = document.querySelector('#contact-modal');
            const modalOverlay = document.querySelector('#modal-overlay');
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
            const modal = document.querySelector('#contact-modal');
            const modalOverlay = document.querySelector('#modal-overlay');
            modal.classList.toggle('closed');
            modalOverlay.classList.toggle('closed');
        }
    }
});
