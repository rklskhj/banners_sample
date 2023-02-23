let api_product = {};
import * as helper from './api_helper'

/***
 상품
 */

/***
 * 상품 필드
 */
function productField() {
  let base = 'id,img,name,simple_desc,tags,form,order_conversion_type,payment_type';
  let category = ',category1,category2,category3';
  let count = ',rate,stock,input,like_count,reviews_count,visit';
  let price = ',price,sum_price,enable_day_price,is_expired';
  let partner = ',partner';
  let address = ',address,dong,distance';
  let params = ',params,imgs,info,operating_time,phone,rates,common_info,selectors,discount_time,maximum,minimum';

  return `fields=${base + category + count + price + partner + address + params }`;
}

/***
 * 위, 경도
 */
function location(vm) {
  return !vm.$store.getters.currentPosition ? '' :
    `location=${vm.$store.getters.currentPosition.lng},${vm.$store.getters.currentPosition.lat}`;
}

/***
 * 카테고리
 */
function category(params) {
  return params && category ? `category=${params.category}` : '';
}


/***
 * 상품 목록
 * @param {Object} params - page_length(Number): 페이지 길이, ordering(String): 정렬
 */
api_product.Product = function(vm, params) {
  return new Promise((resolve, reject) => {
    let url = `${helper.mapper_auth(vm)}/mapping/product?${productField()}&${category(params)}&${helper.pageLength(params)}&${helper.ordering(params)}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 목록 - 위치 정렬
 * @param {Object} params - page_length(Number): 페이지 길이, ordering(String): 정렬
 */
api_product.ProductLocation = function(vm, params) {
  return new Promise((resolve, reject) => {
    let url = `${helper.mapper_auth(vm)}/mapping/product?${productField()}&${helper.pageLength(params)}&${category(params)}&${helper.ordering({ordering: 'distance'})}&${location(vm)}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 상세
 * @param {Object} params - id(Number): 상품 id. 기본값 $route.query.id
 */
api_product.ProductDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    // id 기본값 $route.query.id, 옵션 params.id
    let id = params && params.id ? params.id : vm.$route.query.id;
    let resv = params && params.resv ? params.resv : {};
    let url = `${helper.mapper_auth(vm)}/mapping/product/${id}?${productField()}`;
    if (Object.keys(resv).length !== 0) {
      url += `&resv_start=${resv.resv_date}&resv_end=${resv.resv_end_date}`;
    }

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 태그 목록
 ***/
api_product.ProductTags = function(vm) {
  return new Promise((resolve, reject) => {

    let url = `public/product/tags`;

    vm.$axios.get(url).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 인기 태그 목록
 * @param {Object} params - num(Number): 태그 갯수. 기본값 10
 ***/
api_product.ProductPopluarTags = function(vm, params) {
  return new Promise((resolve, reject) => {

    let url = `public/product/tags/popular?num=${params && params.num ? params.num : 10}`;

    vm.$axios.get(url).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}


/***
 * 상품 태그 호출 로그 남기기
 * @param {Object} params - tag(String): 태그명
 */
api_product.CreateProductTag = function(vm, params) {
  return new Promise((resolve, reject) => {

    let url = `public/product/tag/log`;

    if(helper.validParams(reject, params, 'tag')) return;

    if(!params || !params.tag) {
      reject('parameter에 tag가 없습니다');
      return;
    }

    vm.$axios.post(url, {tag: params.tag}).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 문의 목록
 * @param {Object} params - id(Number): 상품 id
 */
api_product.ProductInquiry = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/product/${params.id}/inquiry`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 후기 목록
 * @param {Object} params - id(Number): 상품 id
 */
api_product.ProductReview = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/product/${params.id}/review`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 문의, 후기 갯수
 * @param {Object} params - id(Number): 상품 id
 */
api_product.ProductReviewInquiryCount = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/product/${params.id}/reviewinquiry/count`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 상품 후기 좋아요 수
 * @param {Object} params - id(Number): 상품 id, review_id(Number): 후기 id
 */
api_product.ProductReviewLikeCount = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    if(helper.validParams(reject, params, 'review_id')) return;

    let url = `${helper.auth(vm)}/product/${params.id}/review/${params.review_id}/like/count`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}



/***
 * 기획전 상품 목록
 * @param {Object} params - id : 기획전 id
 *
 ***/
api_product.ProductExhibition = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `${helper.auth(vm)}/exhibition/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve({data: res.data.product_list});
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

export default api_product;