import {currency, currencyWon, currencyNum, currencyKor, thousand } from '@/utils/helper/format-helper'

/**
 * 객체의 Deep copy를 위한 함수입니다.
 * @param {Object} obj - 복제할 자바스크립트 객체.
 * @returns {Object} Deep copy로 복제된 객체.
 */
function cloneItem(obj) {
  if (obj === null || typeof(obj) !== 'object')
    return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if(typeof(obj[attr]) === 'function' || attr.indexOf('_')===0 || attr === 'request' ||
      (attr.indexOf('$')===0 && attr !== '$selected'  && attr !== '$hover' && attr !== '$fill'))
      continue;

    if (obj.hasOwnProperty(attr) && obj[attr]!==undefined) {
      copy[attr] = cloneItem(obj[attr]);
    }
  }

  return copy;
}


function objectValue(target, value) {
  if(target === undefined || value === undefined)
    return value;

  value = value.replace('{','').replace('}','');

  // 연산이 있는 경우
  let calcs = ['add', 'sub'];
  for(let i=0; i<calcs.length; i++) {
    let calc = calcs[i];
    if(value.indexOf(`__${calc}__`)>-1) {
      let values = value.split(`__${calc}__`);
      let filter = '';
      if(values[1].indexOf('|')) {
        let filters = values[1].split('|');
        filter = filters[filters.length-1];
        if(filter.indexOf('.')>-1)
          filter = '';
        else {
          values[1] = values[1].replace('|'+filter, '');    // 필터 제거
        }
      }
      let val1 = this.objectValue(target, values[0]);
      let val2 = this.objectValue(target, values[1]);

      if(val1 === undefined) val1 = 0;
      if(val2 === undefined) val2 = 0;

      if(calc === 'add') {
        let result = val1 + val2;

        if(filter !== '') {
          return this[filter](result);
        }

        else {
          return val1 + val2;
        }
      }
      else if(calc === 'sub') {
        let result = val1 - val2;

        if(filter !== '') {
          return this[filter](result);
        }

        else {
          return val1 - val2;
        }
      }
    }
  }

  value = value.split('.');

  for(let i=0; i<value.length; i++) {
    let key = value[i];

    // target에 key로 없는 값. 건너뛰기
    if(['store', 'products.', 'product_list.'].indexOf(key)>-1) {
      continue;
    }

    // key에 필터 적용된 경우(ex> {product.price | currency}
    else if(key.indexOf('|')>-1) {
      let keys = key.split('|');

      // 필터가 목록인 경우 (ex> checkedList|list|sum.product.total_price|currency)
      if(keys[1] === 'list') {
        // 목록 내부에 해당 값에 대한 합계
        if(keys[2] === 'sum') {
          let targetValue = 0;
          let filter = '';
          target[keys[0]].forEach( item => {
            for(let idx=i+1; idx<value.length; idx++) {
              let childKey = value[idx];
              if(childKey.indexOf('|')>-1) {
                let childKeys = childKey.split('|');
                filter = childKeys[1];
                childKey = childKeys[0];
              }
              item = item[childKey];
            }
            targetValue += parseInt(item);
          });
          if(filter !== '') {
            target = this[filter](targetValue);
          }
          else {
            target = targetValue;
          }
          break;
        }
      }

      // 그외, 필터에 해당하는 함수 적용하여 결과 얻기
      else {
        switch(keys[1]) {
          case 'currency':
            target = currency(target[keys[0]]);
            break;
          case 'currencyNum':
            target = currencyNum(target[keys[0]]);
            break;
          case 'currencyWon':
            target = currencyWon(target[keys[0]]);
            break;
          case 'currencyKor':
            target = currencyKor(target[keys[0]]);
            break;
          case 'thousand':
            target = thousand(target[keys[0]]);
            break;
        }
      }
    }

    // 맞춤 디비 데이터 매핑 (ex> {param.이름})
    else if(key.indexOf('param')>-1) {
      if(key === 'param') key = 'params';
      if(target[key]) {
        let param_val = find(target[key], 'name', value[++i]).value;
        // 값이 array형식인 경우
        if(Array.isArray(param_val))
          return param_val[0].name;
        else
          return param_val;
      }
      else
        return undefined;
    }

    // {store.commonValue.filters}
    else if(key.indexOf('filters')>-1) {
      let filters = '';
      Object.keys(target).forEach(key => {
        if(key.indexOf('filter_')>-1) {
          if(filters !== '') filters += ', ';
          filters += target[key];
        }
      });
      target = filters;
    }

    else {
      target = target[key];     // this.$store.getters.backendData.product
    }

    if(target === undefined)
      return undefined;
  }
  return target;
}

/**
 * 빈 오브젝트인지 체크.
 * @param {Object} obj - 체크할 객체.
 * @returns {boolean}
 */
function isEmptyObj(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop))
      return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}



//목록에서 특정 키값을 문자열로 가져오기([{val:1},{val:2}] -> '1,2')
function getStringArray(arr, key) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    if (i > 0) str += ',';
    str += arr[i][key].toString();
  }
  return str;
}

/**
 * URL에 필터 값 추가
 */
function urlAppendFilter(filtered, sorted, url) {
  filtered = cloneItem(filtered);

  if (Array.isArray(filtered)) {
    if (filtered.length > 0) {
      // location 따로 처리
      for(let i=filtered.length-1; i>=0; i--) {
        let item = filtered[i];
        if(Object.keys(item).indexOf('location')>-1) {
          url += `&location=${item.location}`;
          filtered.remove(i);
          break;
        }
        if(item.set && item.set.length>0) {
          for(let j=item.set.length-1;j>=0; j--) {
            let setItem = item.set[j];
            if(setItem.value === '' || setItem.value && setItem.value.length === 0) {
              item.set.remove(j);
            }
          }
          if(item.set.length===0) {
            filtered.remove(i);
          }
        }
      }

      filtered = filtered.map(item => {
        return {
          is_active: item.is_active,
          is_param: item.is_param,
          keyword: item.keyword,
          set: item.set,
          param_id: item.param_id
        }
      });

      url += '&filtering=' + encodeURIComponent(JSON.stringify(filtered));
    }
  }

  else {
    let keys = Object.keys(filtered);
    if (keys.length > 0) {
      for (let idx = 0; idx < keys.length; idx++) {
        let key = keys[idx];
        let filter = filtered[key];
        // 카테고리(복수 선택)
        if (key === 'category') {
          url += `&${key}=${getStringArray(filter, 'value')}`;
        }
        // 금액 (최소 ~ 최대)
        else if (key === 'price_start' || key === 'price_end') {
          url += `&${key}=${filter.toString()}`;
        }
        // 지역
        else if (key === 'region') {
          url += `&${key}=${filter.sigungu.id}`;
        }
        // 좌표
        else if (key === 'location') {
          url += ',distance';
          if (filter !== undefined && filter !== 'undefined,undefined')
            url += `&${key}=${filter}`;
        }
      }
    }
  }

  if (sorted && sorted.value) {
    if(url.indexOf('?')>-1)
      url += '&ordering=' + sorted.value;
    else
      url += '?ordering=' + sorted.value;
  }

  return url;
}


/**
 * Convert Color object to hex string.
 * @param {Object} lpColor - Color 오브젝트
 * @param {function} brandHandler - 브랜드 컬러 가져오기 함수
 */
function colorToString(lpColor) {
  return `rgba(${lpColor.r},${lpColor.g},${lpColor.b},${lpColor.a})`;
}

export {
  cloneItem,
  objectValue,
  isEmptyObj,
  urlAppendFilter,
  colorToString
}
