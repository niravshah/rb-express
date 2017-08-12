var jwtMixin = {
    methods: {
        tokenValid: function (tokenName, jwt) {
            if (tokenName === void 0) {
                tokenName = 'token';
            }
            var token = jwt || localStorage.getItem(tokenName);
            var jwtHelper = new JwtHelper();
            return token != null && !jwtHelper.isTokenExpired(token);
        }
    }
};
