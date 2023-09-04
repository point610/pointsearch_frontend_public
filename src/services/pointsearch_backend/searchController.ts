// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** searchAll POST /api/search/all */
export async function searchAllUsingPOST(
  body: API.SearchRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseSearchVO_>('/api/search/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
