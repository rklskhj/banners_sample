let api_inquiry = {};
import * as helper from './api_helper'

/***
 1:1문의
 */


/***
 * 내 1:1 문의 목록
 */
api_inquiry.Inquiry = function(vm) {
  return new Promise((resolve, reject) => {
    let url = `${helper.auth_user(vm)}/inquiry/personal`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 내 1:1 문의 상세
 */
api_inquiry.InquiryDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth_user(vm)}/inquiry/personal/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 1:1 문의 등록
 * @param {Object} params - data(Object): 등록 내용
 */
api_inquiry.CreateInquiry = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'data')) return;
    let url = `${helper.auth(vm)}/inquiry/personal`;

    vm.$axios.post(url, params.data).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}


/***
 * 1:1 문의 카테고리
 */
api_inquiry.InquiryCategory = function(vm) {
  return new Promise((resolve, reject) => {
    let url = 'public/inquiry/personal/category';

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 1:1 문의 폼데이터
 */
api_inquiry.InquiryFormdata = function(vm) {
  return new Promise((resolve, reject) => {
    let url = 'public/inquiry/personal/formdata';

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}



/***
 * 업체 등록 신청
 * @param {Object} params - data(Object): 등록 내용
 */
api_inquiry.CreateInquiryPartner = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'data')) return;

    let url = 'public/inquiry/partner';

    vm.$axios.post(url, params.data).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 내 업체 등록 신청 목록
 */
api_inquiry.InquiryPartner = function(vm) {
  return new Promise((resolve, reject) => {

    let url = `${helper.auth_user(vm)}/inquiry/partner`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 내 업체 등록 신청 상세
 */
api_inquiry.InquiryPartnerDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth_user(vm)}/inquiry/partner/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

export default api_inquiry;