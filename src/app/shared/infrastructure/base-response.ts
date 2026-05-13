export interface BaseResource {
  id?: number | string | null;
}

export interface BaseResponse {
  [key: string]: unknown;
}
