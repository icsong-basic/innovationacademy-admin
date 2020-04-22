import moment from "moment";

export default {
    getNavigatorLanguage: () => {
        if (navigator.languages && navigator.languages.length) {
            return navigator.languages[0];
        } else {
            return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
        }
    },
    getErrorMessage: (error, defaultMessage) => {
        if (error?.response?.status === 413) {
            return '파일이 너무 큽니다. (최대20mb)';
        }

        return `${defaultMessage ? defaultMessage + '\n' : ''}${(error && error.response && error.response.data && error.response.data.message !== "No message available") ? error.response.data.message : (error.message ? error.message : '')}`
    },
    timeToString: (time) => {
        if (!time) return '';
        const date = new moment(time);
        return date.format('YYYY/MM/DD HH:mm:ss');
    },
    getCurrentLanguageCode: () => {
        let currentLangCode = window.navigator.userLanguage || window.navigator.language;
        if (currentLangCode.length > 2) {
            currentLangCode = currentLangCode.substr(0, 2);
        }
        if (currentLangCode !== 'ko') {
            currentLangCode = 'en';
        }
        return currentLangCode;
    },
    isIe: () => (/*@cc_on!@*/false || !!window.document.documentMode),
    isProduction() {
        return window.location.hostname === 'admin.innovationacademy.kr' ||
            window.location.hostname === 'admin.42seoul.kr'
    }
}