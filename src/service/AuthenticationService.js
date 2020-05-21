import axios from 'axios'

const API_URL = 'http://localhost:8080';

export const SESSION_USER_NAME = 'authenticatedUser';
export const SESSION_USER_TOKEN = 'userToken';

class AuthenticationService {

    executeJwtAuthenticationService(username, password) {
        return axios.post(`${API_URL}/authenticate`, {
            username,
            password
        })
    }

    registerSuccessfulLoginForJwt(username, token) {
        sessionStorage.setItem(SESSION_USER_NAME, username);
        sessionStorage.setItem(SESSION_USER_TOKEN, token);
        this.setupAxiosInterceptorsFromToken(this.createJWTToken(token));
    }

    createJWTToken(token) {
        return 'Bearer ' + token
    }

    logout() {
        sessionStorage.removeItem(SESSION_USER_NAME);
        sessionStorage.removeItem(SESSION_USER_TOKEN);
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(SESSION_USER_NAME);
        if (user === null) return false
        return true
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(SESSION_USER_NAME);
        if (user === null) return ''
        return user
    }

    setupAxiosInterceptors() {
        this.setupAxiosInterceptorsFromToken(this.createJWTToken(sessionStorage.getItem(SESSION_USER_TOKEN)));
    }

    setupAxiosInterceptorsFromToken(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }

    tokenIsExpired() {
        const { exp } = this.parseJwt(sessionStorage.getItem(SESSION_USER_TOKEN));
        return (typeof exp !== 'undefined' && Date.now() >= exp * 1000);
    }

    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
}

export default new AuthenticationService()