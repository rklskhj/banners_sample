let api_board = {};
import * as helper from './api_helper'

/***
 게시판
 */

/***
 * 게시판 목록
 * @param {Object} params - cat1(Number): 카테고리1 id, cat2(Number): 카테고리2 id, cat3(Number): 카테고리3 id
 */
api_board.Board = function(vm, params) {
  return new Promise((resolve, reject) => {
    let url = `${helper.auth(vm)}/board`;
    if(params) {
      if(params.cat1) {
        url += `?cat1=${params.cat1}`;
      }
      if(params.cat2) {
        url += url.indexOf('?')>-1 ? '&' : '?';
        url += `cat2=${params.cat2}`;
      }
      if(params.cat3) {
        url += url.indexOf('?')>-1 ? '&' : '?';
        url += `cat3=${params.cat3}`;
      }
    }

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 상세
 * @param {Object} params - id(Number): 게시판 id
 */
api_board.BoardDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth(vm)}/board/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 게시물 목록
 * @param {Object} params - id(Number): 게시판 id
 */
api_board.BoardPost = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth(vm)}/board/${params.id}/post`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 즐겨찾기한 게시물 목록
 * @param {Object} params - id(Number): 게시판 id
 */
api_board.BoardPostLiked = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth_user(vm)}/board/${params.id}/post/liked`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판에 내 게시물 목록
 * @param {Object} params - id(Number): 게시판 id
 */
api_board.BoardMyPost = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth_user(vm)}/board/${params.id}/my-post`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 게시물 상세
 * @param {Object} params - id(Number): 게시판 id, post_id(Number): 게시물 id
 */
api_board.BoardPostDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    if(helper.validParams(reject, params, 'post_id')) return;

    let url = `${helper.auth(vm)}/board/${params.id}/post/${params.post_id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 게시물 댓글 목록
 * @param {Object} params - id(Number): 게시판 id, post_id(Number): 게시물 id
 */
api_board.BoardPostComment = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    if(helper.validParams(reject, params, 'post_id')) return;

    let url = `${helper.auth(vm)}/board/${params.id}/post/${params.post_id}/comment`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 게시물 댓글 생성
 * @param {Object} params - id(Number): 게시판 id, post_id(Number): 게시물 id, data(Object): 댓글 내용('content(String)', 'is_secret(Boolean)', 'parent_id(Number)')
 */
api_board.CreateBoardPostComment = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    if(helper.validParams(reject, params, 'post_id')) return;

    let url = `${helper.auth(vm)}/board/${params.id}/post/${params.post_id}/comment`;

    vm.$axios.post(url, params.data).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 게시물 댓글 수정
 * @param {Object} params - id(Number): 게시판 id, post_id(Number): 게시물 id, comment_id(Number): 댓글 id, data(Object): 댓글 내용('content(String)', 'is_secret(Boolean)', 'parent_id(Number)')
 */
api_board.UpdateBoardPostComment = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    if(helper.validParams(reject, params, 'post_id')) return;

    let url = `${helper.auth(vm)}/board/${params.id}/post/${params.post_id}/comment/${params.comment_id}`;

    vm.$axios.patch(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 게시판 게시물 댓글 삭제
 * @param {Object} params - id(Number): 게시판 id, post_id(Number): 게시물 id, comment_id(Number): 댓글 id
 */
api_board.UpdateBoardPostComment = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    if(helper.validParams(reject, params, 'post_id')) return;

    let url = `${helper.auth(vm)}/board/${params.id}/post/${params.post_id}/comment/${params.comment_id}`;

    vm.$axios.delete(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}


/***
 * 공지사항 게시물 목록
 */
api_board.Notice = function(vm) {
  return new Promise((resolve, reject) => {
    let url = `${helper.auth(vm)}/board/notice`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 공지사항 게시물 상세
 * @param {Object} params - id(Number): 공지사항 id
 */
api_board.NoticeDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth(vm)}/board/notice/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 공지사항 게시물 상세
 * @param {Object} params - id(Number): 공지사항 id
 */
api_board.NoticeDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth(vm)}/board/notice/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 자주 묻는 질문 게시물
 */
api_board.Faq = function(vm) {
  return new Promise((resolve, reject) => {
    let url = `${helper.auth(vm)}/board/faq`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 자주 묻는 질문 게시물 상세
 * @param {Object} params - id(Number): 자주 묻는 질문 id
 */
api_board.FaqDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth(vm)}/board/faq/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 이벤트 게시물
 */
api_board.Event = function(vm) {
  return new Promise((resolve, reject) => {
    let url = `${helper.auth(vm)}/board/event`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

/***
 * 이벤트 게시물 상세
 * @param {Object} params - id(Number): 이벤트 id
 */
api_board.EventDetail = function(vm, params) {
  return new Promise((resolve, reject) => {
    if(helper.validParams(reject, params, 'id')) return;
    let url = `${helper.auth(vm)}/board/event/${params.id}`;

    vm.$axios.get(url).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}

export default api_board;