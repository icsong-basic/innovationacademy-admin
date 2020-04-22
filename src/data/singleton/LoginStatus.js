// @flow

import { observable, action, computed } from "mobx";
import apis from "../../apis";
import history from "../../history";
import constants from "../../constants";
import type { User } from "../../apiModelTypes"

class LoginStatus {
    @observable logined: boolean = false;
    @observable initialWaiting: boolean = true;
    @observable user: ?User = null;
    @observable authorities = [];
    @observable boardAuthorizations = [];
    @computed get isAdmin() {
        return this.authorities.findIndex(authority => authority.name === constants.roles.ROLE_ADMIN) >= 0 ||
            this.authorities.findIndex(authority => authority.name === constants.roles.ROLE_SYSTEM_ADMIN) >= 0
    }
    @computed get isStudentManager() {
        return this.authorities.findIndex(authority => authority.name === constants.roles.ROLE_STUDENT_MANAGER) >= 0
    }
    @computed get isFaqUpdater() {
        return this.authorities.findIndex(authority => authority.name === constants.roles.ROLE_FAQ_UPDATER) >= 0
    }
    @computed get isBoardManager() {
        return this.authorities.findIndex(authority => authority.name === constants.roles.ROLE_BOARD_MANAGER) >= 0
    }

    hasBoardAuthority = (boardId, boardAuthName) => {
        if (this.isAdmin) {
            return true;
        }
        const boardAuth = this.boardAuthorizations.find(ba => ba.board ?.id === boardId);
        if (!boardAuth) {
            return false;
        }
        if (!boardAuthName) {
            return boardAuth["create"] ||
                boardAuth["modify"] ||
                boardAuth["delete"] ||
                boardAuth["labelCreate"] ||
                boardAuth["labelModify"] ||
                boardAuth["labelDelete"]
        }
        return boardAuth[boardAuthName]
    }

    @action login = async (phoneNumber: string, password: string) => {
        try {
            const result = await apis.accountController.login(phoneNumber, password);
            if (result.data.type !== 'admin') {
                await this.logout();
                return { success: false, message: '관리자만 로그인 가능합니다.' };
            }
            this.user = result.data;
            this.authorities = result.data.authorities || [];
            this.boardAuthorizations = result.data.boardAuthorizations || [];
            return { success: true, ...result };
        } catch (error) {
            return { success: false, ...error };
        }
    }

    @action checkLoginStatus = async () => {
        try {
            const result = await apis.accountController.get();
            if (result.data.type !== 'admin') {
                await this.logout();
                alert('관리자만 로그인 가능합니다.')
                throw '권한 없음';
                return;
            }
            this.user = result.data;
            this.authorities = result.data.authorities || [];
            this.boardAuthorizations = result.data.boardAuthorizations || [];
        } catch (error) {
            this.user = null;
            if (history.location.pathname !== `${constants.basePath}/login` &&
                history.location.pathname !== `${constants.basePath}/signup`) {
                history.push(`${constants.basePath}/login`, { redirectionGoBack: true });
            }
        }
        this.initialWaiting = false;
    };

    @action logout = async () => {
        console.log('call logout');
        try {
            await apis.accountController.logout();
        } catch (error) {

        }
    };
}

LoginStatus = new LoginStatus();
export default LoginStatus;