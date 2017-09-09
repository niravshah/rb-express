var vCalculator =
    new Vue({
        el: '#calculator',
        data: {
            amountRaised: 1500
        },
        created: function () {
        },
        computed: {
            rb_pf: function () {
                return Math.round(this.amountRaised * 0.02);
            },
            rb_cpf: function () {
                return Math.round(this.amountRaised * 0.014 + 0.20);
            },
            rb_total: function () {
                return this.amountRaised - (this.rb_pf + this.rb_cpf);
            },
            jg_pf: function () {
                return Math.round(this.amountRaised * 0.05);
            },
            jg_cpf: function () {
                return Math.round(this.amountRaised * 0.0125);
            },
            jg_total: function () {
                return this.amountRaised - (this.jg_pf + this.jg_cpf);
            },
            gfm_pf: function () {
                return Math.round(this.amountRaised * 0.05);
            },
            gfm_cpf: function () {
                return Math.round(this.amountRaised * 0.035 + 0.20);
            },
            gfm_total: function () {
                return this.amountRaised - (this.gfm_pf + this.gfm_cpf);
            },
            amountSaved: function () {
                return (this.rb_total - this.gfm_total);
            }
        },
        methods: {}
    });
