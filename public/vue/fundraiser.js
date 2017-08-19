var vFundraiser = new Vue({
    el: '#property',
    data: {
        messages: []
    },
    created: function () {
    },
    computed: {},
    methods: {},
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
