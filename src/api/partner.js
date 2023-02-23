let api_partner = {};
import * as helper from './api_helper'

/***
 파트너
 */

function partnerField() {
  return 'fields=id,name,first_img,img,simple_desc,address,rate,rate_count,'+
    'product_count,like_count,tags,distance,reviews_count,visit,phone,email,'+
    'products.id,products.category1,products.is_delete,location,product_common_info';
}


/***
 * 파트너 목록
 * @param {Object} params - page_length(Number): 페이지 길이, ordering(String): 정렬
 */
api_partner.Partner = function(vm, params) {
  return new Promise((resolve, reject) => {
    let url = `${helper.mapper_auth(vm)}/mapping/partner?${partnerField()}&${helper.pageLength(params)}&${helper.ordering(params)}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 파트너 상세
 * @param {Object} params - id(Number): 파트너 id. 기본값 $route.query.id
 */
api_partner.PartnerDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    // id 기본값 $route.query.id, 옵션 params.id
    let id = params && params.id ? params.id : vm.$route.query.id;
    let url = `${helper.mapper_auth(vm)}/mapping/partner/${id}?${partnerField()}`;
    url += `,imgs,info,operating_time,enable_homepage,homepage,enable_kakao,kakao,enable_instagram,instagram,enable_naver,naver,booking_policy`;
    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 파트너 문의 목록
 * @param {Object} params - id(Number): 파트너 id
 */
api_partner.PartnerInquiry = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/partner/${params.id}/inquiry`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 파트너 후기 목록
 * @param {Object} params - id(Number): 파트너 id
 */
api_partner.PartnerReview = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/partner/${params.id}/review`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 파트너 문의, 후기 갯수
 * @param {Object} params - id(Number): 파트너 id
 */
api_partner.PartnerReviewInquiryCount = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/partner/${params.id}/reviewinquiry/count`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}


export default api_partner;
