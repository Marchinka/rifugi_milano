const TOKEN_KEY = "login-token";

export default {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getAuthenticationHeader() : { [id: string] : string; } {
        return {
            "token": this.getToken()
        };
    },

    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    isUserLogginIn() {
        let token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            return true;
        } else {
            return false;
        }
    }
};