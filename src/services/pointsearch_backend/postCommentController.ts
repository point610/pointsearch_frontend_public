// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addPostComment POST /api/postcomment/add */
export async function addPostCommentUsingPOST(
  body: API.PostCommentAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/postcomment/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deletePostComment POST /api/postcomment/delete */
export async function deletePostCommentUsingPOST(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/postcomment/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getPostCommentById GET /api/postcomment/get */
export async function getPostCommentByIdUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPostCommentByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePostComment_>('/api/postcomment/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** deletePostComments POST /api/postcomment/list/delete */
export async function deletePostCommentsUsingPOST(
  body: API.DeleteRequest[],
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/postcomment/list/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listPostCommentVOByPage POST /api/postcomment/list/page/vo */
export async function listPostCommentVOByPageUsingPOST(
  body: API.PostCommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePagePostCommentVO_>('/api/postcomment/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyPostCommentByPage POST /api/postcomment/my/list/page */
export async function listMyPostCommentByPageUsingPOST(
  body: API.PostCommentQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePagePostComment_>('/api/postcomment/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updatePostComment POST /api/postcomment/update */
export async function updatePostCommentUsingPOST(
  body: API.PostCommentUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/postcomment/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
