requirejs.config({
    "baseUrl": "js",
    "paths": {
        "vue": "/js/vue.min",
        "jwt": "/vue/mixins/jwt"
    }
});

requirejs(['../vue/r-header']);
