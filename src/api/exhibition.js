let api_exhibition = {};
import * as helper from './api_helper'

/***
 기획전
 */

/***
 * 기획전 목록
 */
api_exhibition.Exhibition = function(vm) {
  return new Promise((resolve, reject) => {
    let url = 'public/exhibition';

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 기획전 상세
 */
api_exhibition.ExhibitionDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;

    let url = `public/exhibition/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}


export default api_exhibition;