// @flow

import axios from 'axios';
import querystring from 'querystring';
import type { PostingInput } from './apiModelTypesExtra'
import type { UserInput } from './apiModelTypes';
// TODO: 사용할일 있을때 주석제거
// import type {} from './apiResponseModel'

const contentTypeKey = 'Content-Type';
const contentTypeJson = 'application/json';
const instance = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 0,
    headers: {
        common: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            [contentTypeKey]: 'application/x-www-form-urlencoded charset=UTF-8'
        }
    },
    transformRequest: [(data, headers) => {
        if (headers[contentTypeKey] === contentTypeJson) {
            if (typeof (data) === 'string' || data instanceof String) {
                return data;
            }
            return JSON.stringify(data);
        }
        if (data && FormData && data instanceof FormData)
            return data

        return querystring.stringify(data)
    }]
})

instance.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response) {
        var status = error.response.status
        //var data = error.response.data
        if (status === 401) {
            //Todo: Unauthorized
            return
        }
    }
    return Promise.reject(error)
})

const jsonContentTypeConfig = {
    headers: { [contentTypeKey]: contentTypeJson }
};

export default {
    adminController: {
        searchUser(email, type) {
            return instance.get('/v1/admin/user', { params: { email, type } });
        },
        addUser(type = 'admin', email, password) {
            return instance.post(`/v1/admin/user?type=${type}`, { email, password }, jsonContentTypeConfig);
        },
        addRole(id, auth) {
            return instance.post(`/v1/admin/user/${id}/auth`, { auth })
        },
        resetRoles(id) {
            return instance.delete(`/v1/admin/user/${id}/auth`)
        },
        setBoardRole(userId, boardId, params) {
            return instance.post(`/v1/admin/user/${userId}/board/${boardId}/auth`, params, jsonContentTypeConfig)
        },
        getMailingList() {
            return instance.get('/v1/admin/mailing')
        },
        changePassword(id, password) {
            return instance.post(`/v1/admin/user/${id}/password`, password, jsonContentTypeConfig);
        }
    },
    accountController: {
        login: (email: string, password: string) => {
            return instance.post('/v1/account/login', { email, password }, jsonContentTypeConfig)
        },
        post: (user: UserInput) => {
            return instance.post('/v1/account', user, jsonContentTypeConfig);
        },
        get: () => {
            return instance.get('/v1/account');
        },
        logout: () => {
            return instance.get('/logout');
        }
    },
    dataController: {
        uploadData: (type: 'images', data: File) => {
            const formData = new FormData();
            formData.append('data', data);
            return instance.post(`/v1/data/s3/${type}`, formData);
        }
    },
    boardController: {
        getList: () => {
            return instance.get('/v1/board');
        },
        post: (id: number, postingInput: PostingInput) => {
            return instance.post(`/v1/board/${id}`, postingInput, { headers: { [contentTypeKey]: contentTypeJson } });
        },
        put: (id: number, postId: number, postingInput: PostingInput) => {
            return instance.put(`/v1/board/${id}/posts/${postId}`, postingInput, { headers: { [contentTypeKey]: contentTypeJson } });
        },
        getPosts: (id: number, page: ?number = 0, size: ?number = 15) => {
            const params = { page, size };
            return instance.get(`/v1/board/${id}/posts`, { params });
        },
        getPost: (id: number, postId: number) => {
            return instance.get(`/v1/board/${id}/posts/${postId}`);
        },
        publish: (id: number, postId: number) => {
            return instance.post(`/v1/board/${id}/posts/${postId}/publish`);
        },
        cancelPublish: (id: number, postId: number) => {
            return instance.delete(`/v1/board/${id}/posts/${postId}/publish`);
        },
        delete: (id: number, postId: number) => {
            return instance.delete(`/v1/board/${id}/posts/${postId}`);
        },
        getLabels(boardIds) {
            return instance.get(`/v1/board/labels?${querystring.stringify({ boardIds })}`)
        },
        addLabel(boardId, name) {
            return instance.post(`/v1/board/${boardId}/label/${name}`);
        },
        deleteLabel(boardId, labelId) {
            return instance.delete(`/v1/board/${boardId}/label/${labelId}`);
        },
        getPostsFromMultipleBoards(ids, page = 0, size = 15) {
            return instance.get(`/v1/board/posts?${querystring.stringify({ ids, page, size })}`)
        },
        getLabelPosts(labelIds, page = 0, size = 15) {
            return instance.get(`/v1/board/label/posts?${querystring.stringify({ labelIds, page, size })}`)
        },
        addLabelToPost(boardId, postId, labelId) {
            return instance.post(`/v1/board/${boardId}/posts/${postId}/label/${labelId}`)
        },
        removeLabelToPost(boardId, postId, labelId) {
            return instance.delete(`/v1/board/${boardId}/posts/${postId}/label/${labelId}`)
        }
    },
    studentAdminController: {
        getStudentList(page, size = 15) {
            return instance.get(`/v1/admin/student?${querystring.stringify({ page, size })}`);
        },
        getStudentInfo(id) {
            return instance.get(`/v1/admin/student/${id}`);
        },
        putStudentInfo(id, studentInfo) {
            return instance.put(`/v1/admin/student/${id}/info`, studentInfo, jsonContentTypeConfig);
        },
        getStudentEssay(id = 1) {
            return instance.get(`/v1/admin/student/${id}/essay`);
        },
        getStudentPhotos(id) {
            return instance.get(`/v1/admin/student/${id}/photo`);
        },
        uploadCsv(csvText) {
            return instance.post('/v1/admin/student/csv', csvText, {
                headers: { [contentTypeKey]: contentTypeJson },
                timeout: 120 * 1000
            })
        }
    },
    studentStatisticsController: {
        /*
        * 연령대 통계
        */
        getAgeStatistics() {
            return instance.get('/v1/admin/student/statistics/age');
        },
        /*
        * 지역 통계
        */
        getCityStatistics() {
            return instance.get('/v1/admin/student/statistics/city');
        },
        /*
        * 취업 상태 통계
        */
        getEmploymentStatusStatistics() {
            return instance.get('/v1/admin/student/statistics/employmentStatus');
        },
        /*
        * 최종학력 통계
        */
        getHighestLevelOfEducationStatistics() {
            return instance.get('/v1/admin/student/statistics/highestLevelOfEducation');
        },
        /*
        * 전공 통계
        */
        getMajorStatistics() {
            return instance.get('/v1/admin/student/statistics/major');
        },
        /*
        * 성별 통계
        */
        getSexStatistics() {
            return instance.get('/v1/admin/student/statistics/sex');
        },
        /*
        * 소프트웨어 경력 년 수 통계
        */
        getSoftwareCareerYearStatistics() {
            return instance.get('/v1/admin/student/statistics/softwareCareerYear');
        },
    },
    refreshFaq() {
        return axios.post('/refresh-faq');
    }
}