// user, public 판별해서 return
export function auth(vm) {
  let user = vm.$store.getters.user;
  return user.user_id>0 ? `user/${user.user_id}` : 'public';
}
export function auth_user(vm) {
  let user = vm.$store.getters.user;
  return `user/${user.user_id}`;
}

// user/1, user/0 판별해서 return
export function mapper_auth(vm) {
  let user = vm.$store.getters.user;
  return user.user_id>0 ? `user/${user.user_id}` : 'user/0';
}

// 한번에 가져올 갯수 설정
export function pageLength(params) {
  // 갯수 기본값 10개
  return `page_num=1&page_length=${params && params.page_length ? params.page_length : 10}`;
}

// 정렬
export function ordering(params) {
  return params && params.ordering ? `ordering=${params.ordering}` : '';
}

// params 체크
export function validParams(reject, params, key) {
  if(!params || !params[key]) {
    reject(`parameter에 ${key}가 없습니다`);
    return true;
  }
  return false;
}