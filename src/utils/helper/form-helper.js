// Valdation check
import josa from "josa-js";
import { isEmptyObj } from '@/utils/helper/object-helper'

function isValid(properties, label) {
  if (label === undefined || label === '')
    label = '항목';

  let msg = '';
  let patternNum = /[0-9]/;       // 숫자
  let patternC = /[a-zA-Z]/;      // 문자(대소문자)
  let patternS = /[a-z]/;         // 소문자
  let patternB = /[A-Z]/;         // 대문자
  let patternSpecial = /[~!@#$%^&*()_+|<>?:{}]/;    // 특수문자
  let patternEmail = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;    //이메일

  // 빈문자 일 경우
  if (properties.value === '') {
    msg = label + josa.c(label, '을/를') + ' 입력해주세요.';
  }

  // 숫자인 경우
  else if (properties.type === 'number') {
    properties.value = Number(properties.value);
    if (properties.value === 0)
      msg = label + josa.c(label, '을/를') + ' 입력해주세요.';

    else if (properties.value < properties.validate.min_length)
      msg = label + josa.c(label, '을/를') + ' 최소 %d 이상 입력해주세요.'.format(properties.validate.min_length);

    else if (properties.value > properties.validate.max_length)
      msg = label + josa.c(label, '을/를') + ' 최대 %d 이하로 입력해주세요.'.format(properties.validate.max_length);

    else if (properties.value < properties.validate.min)
      msg = label + josa.c(label, '을/를') + ' 최소 %d 이상 입력해주세요.'.format(properties.validate.min);

    else if (properties.value > properties.validate.max)
      msg = label + josa.c(label, '을/를') + ' 최대 %d 이하로 입력해주세요.'.format(properties.validate.max);
  }

  // 텍스트인 경우
  else if (properties.type.search('text') > -1 &&
    typeof (properties.value) === 'string') {
    // if(properties.value === '')
    //   msg = label + josa.c(label, '을/를') + ' 입력해주세요.';

    if (properties.value.length < properties.validate.min_length)
      msg = `(${properties.value.length}/${properties.validate.max_length}) ${label + josa.c(label, '을/를')} 최소 ${properties.validate.min_length}자 이상 입력해주세요.`;

    else if (properties.value.length > properties.validate.max_length)
      msg = `(${properties.value.length}/${properties.validate.max_length}) ${label + josa.c(label, '을/를')} 최대 ${properties.validate.max_length}자 이하로 입력해주세요.`;

    if (msg === '') {
      let msgVal = '';
      // 소문자 사용 안함
      if (properties.validate.alpha_s === false && patternS.test(properties.value))
        msgVal = '알파벳 소문자';

      // 대문자 사용 안함
      if (properties.validate.alpha_g === false && patternB.test(properties.value)) {
        if (msgVal !== '') msgVal += ', ';
        msgVal += '알파벳 대문자';
      }
      // 특수문자 사용 안함
      if (properties.validate.special === false && patternSpecial.test(properties.value)) {
        if (msgVal !== '') msgVal += ', ';
        msgVal += '특수문자';
      }

      // 숫자 사용 안함
      if (properties.validate.num === false && patternNum.test(properties.value)) {
        if (msgVal !== '') msgVal += ', ';
        msgVal += '숫자';
      }
      if (msgVal !== '' && msgVal !== undefined)
        msg = msgVal + '는 사용할 수 없습니다.';
    }
  }

  // email
  else if (properties.type === 'email' && !patternEmail.test(properties.value)) {
    msg = '올바른 이메일 형식이 아닙니다.';
  }

  // 휴대폰번호
  else if (properties.type === 'phone' && properties.value.length < 11) {
    msg = label + josa.c(label, '을/를') + ' 정확히 입력해주세요.';
  }

  else if (properties.type === 'password') {
    if (!patternC.test(properties.value) || !patternNum.test(properties.value) ||
      properties.value.length < 4) {
      msg = '비밀번호는 4자리 이상 문자, 숫자로 구성되어야 합니다.';
    }
  }

  else if (properties.type === 'password_new') {
    if (!patternC.test(properties.new_password) || !patternNum.test(properties.new_password) ||
      properties.new_password.length < 4) {
      msg = '비밀번호는 4자리 이상 문자, 숫자로 구성되어야 합니다.';
    }
  }

  return msg;
}

function formValidate(data, toast) {
  /*//dataSet
  if (data.value.format && data.value.format === 'dataSet') {
    if(typeof(data.value.data) === 'string' && data.value.data.indexOf('{') > -1) {

      let val = data.value.data;

      if (typeof(val) === 'string' && val.indexOf('{') > -1) {
        if (val.indexOf('user.') > -1)
          data.value.data = userSet[val.replace('user.', '').replace('{', '').replace('}', '')];
        else if (val.indexOf('query.') > -1)
          data.value.data = querySet[val.replace('query.', '').replace('{', '').replace('}', '')];
        else
          data.value.data = objectValue(dataSet, val);
      }
      return data.value.data;
    }
    else if(typeof(data.value.data) === 'string')  {
      return data.value.data;
    }

    //dataSet, value가 object(내부에 데이터 매핑해서 가져오는 경우) ex> 결제
    else {
      return mappingFormDataSet(data.value);
    }
  }*/

  // c-input-text, email, textarea, number, phone, password
  if (['text', 'email', 'textarea', 'number', 'phone', 'password', 'editor']
    .indexOf(data.elType.replace('c-input-', '')) > -1) {

    if (data.elType === 'c-input-number') {
      if (data.enable_option) {
        if (data.min > Number(data.value)) {
          toast(`'${data.name}'에 ${data.min} 이상의 숫자를 입력해주세요`);
          return '_!valid_false';
        }
      }
    }

    // validation 필수 아님
    if (!data.validate.valid_required) {
      // 빈값 체크
      if (data.validate.required &&
        data.value === '') {
        toastEmptyError(toast, data);
        return '_!valid_false';
      }
      else {
        return data.value;
      }
    }
    // validation 필수
    else {
      // 빈값 체크
      if (data.value === '') {
        toastEmptyError(toast, data);
        return '_!valid_false';
      }
      // validation 체크
      else {
        let errMsg = isValid(data, data.name);
        if (errMsg !== '' && errMsg !== undefined) {
          if (toast)
            toast(errMsg);
          return '_!valid_false';
        }
        else if (!errMsg) {
          return data.value;
        }
      }
    }
    if (data.format.indexOf('number') > -1)
      return parseInt(data.value);
    else {
      // 인풋텍스트로 태그 처리시 예외처리
      if (data.field === 'tags') {
        let tags = [];
        data.value.split(',').forEach(item => {
          tags.push(item.trim());
        });
        return tags;
      } else {
        return data.value;
      }

    }
  }

  else if (data.elType === 'c-input-email-select') {
    if (data.value === '' || data.value === undefined) {
      toast('이메일 주소를 정확히 입력해주세요.');
      return '_!valid_false';
    }
    return data.value;
  }
  // c-input-address
  else if (data.elType === 'c-input-address') {
    let address = data.value;
    if (data.validate.required) {
      // 빈 값 체크
      if (address.detail === null || address.detail.trim() === '') {
        if (toast)
          toast('상세 주소를 입력해주세요.');
        return '_!valid_false';
      }
      // validation 체크
      else if (address.sido === '' ||
        address.sigungu === '' ||
        address.dong === '' ||
        address.old === '' ||
        address.new === '') {
        toastErrorMessage(toast, data);
        return '_!valid_false';
      }
    }
    return data.value;
  }

  // c-input-bank-account
  else if (data.elType === 'c-input-bank-account') {
    let bank = data.value.bank;
    if (data.validate.required) {
      if (bank.bank === '' || bank.name === '' || bank.account_num === '') {
        toastErrorMessage(toast, data);
        return '_!valid_false';
      }
    }
    return bank;
  }

  // c-input-img-uploader
  else if (data.elType === 'c-input-imgUploader') {
    let profile = data.value;
    if (data.validate.required &&
      profile === '') {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  // c-input-img-uploader
  else if (data.elType === 'c-input-imgUploaderArray') {
    if (data.validate.required &&
      data.value.length === 0) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  else if (data.elType === 'c-input-fileUploader') {
    if (data.validate.required &&
      data.value.length === 0) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    let files = [];
    for (let i = 0; i < data.value.length; i++)
      files.push(data.value[i].file);

    return files;
  }

  // c-input-radiobuttonGroup
  else if (data.elType === 'c-input-radiobuttonGroup') {
    if (data.validate.required &&
      (data.value === undefined || data.value === '')) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }

    // 맞춤 DB
    if (data.is_param) {
      return [data.value];
    }
    // 아닐 경우
    else return data.value;
  }

  // c-input-date
  else if (data.elType === 'c-input-date') {
    if (data.validate.required &&
      data.value === '') {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  // c-input-time
  else if (data.elType === 'c-input-time') {
    if (data.validate.required &&
      data.value === '') {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  // c-input-dropdown
  else if (data.elType === 'c-input-dropdown') {
    if (data.validate.required &&
      (isEmptyObj(data.value) || data.value === '')) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  // c-input-checkbox
  else if (data.elType === 'c-input-checkbox' ||
    data.elType === 'c-input-checkboxArray' ||
    data.elType === 'c-input-checkbox-textarea') {
    if (data.validate !== undefined && data.validate.valid_required &&
      data.value === false) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }

    return data.value;
  }

  else if (data.elType === 'c-input-rating') {
    if (data.validate.required &&
      data.value === '') {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  else if (data.elType === 'c-input-checkboxGroup' ||
    data.elType === 'c-input-checkbox-group') {
    /*let values = [];
    for (let i = 0; i < data.value.properties.data.length; i++) {
      let item = data.value.properties.data[i];
      if (item.checked)
        values.push(item.id);
    }*/
    if (data.validate.required && data.value.length === 0) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  else if (data.elType === 'c-input-regionForm') {
    let region = data.value;
    if (data.validate.required &&
      (region === undefined ||
        region.sido === undefined ||
        region.sigungu === undefined)) {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return {
      sido: region.sido.name,
      sigungu: region.sigungu.name,
      sido_id: region.sido.id,
      sigungu_id: region.sigungu.id
    }
  }

  else if (data.elType === 'c-input-range') {
    return data.value;
  }

  else if (data.elType === 'c-input-editor') {
    if (data.validate.required &&
      data.value === '') {
      toastEmptyError(toast, data);
      return '_!valid_false';
    }
    return data.value;
  }

  else if (data.elType === 'c-input-verify') {
    return !data.value ? '_!valid_false' : true;
  }
  
  else {
    return data.value;
  }
}

function toastEmptyError(toast, data) {
  let error_msg = '';
  if (data.format.indexOf('Checkbox') > -1) {
    error_msg = data.name + '에 체크해주세요.';
  }
  else if (data.format === 'CImgUploader') {
    error_msg = data.name + josa.c(data.name, '을/를') + ' 첨부해주세요.';
  }
  else {
    error_msg = data.name + josa.c(data.name, '을/를') + ' 입력해주세요.';
  }
  if (toast)
    toast(error_msg);
}

function toastErrorMessage(toast, data) {
  let error_msg = '';
  if (data.format.indexOf('Checkbox') > -1) {
    error_msg = data.name + '에 체크해주세요.';
  }
  else if (data.format === 'CImgUploader') {
    error_msg = data.name + josa.c(data.name, '을/를') + ' 첨부해주세요.';
  }
  else {
    error_msg = data.name + josa.c(data.name, '을/를') + ' 정확하게 입력해주세요.';
  }

  toast(error_msg);
}

export {
  isValid,
  formValidate
}
