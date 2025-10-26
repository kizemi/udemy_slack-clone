import type { InternalAxiosRequestConfig } from "axios";


// もしローカルストレージにトークン（token）があれば、HTTPヘッダーの Authorization にそれを自動で追加するというコード
export const addAuthorizationHeader = (config: InternalAxiosRequestConfig) => {
  // tokenをローカルストレージから取得
  const token = localStorage.getItem("token");
  if (token == null) return config;
  // tokenがあればInternalAxiosRequestConfigのheadersのAuthorizationにセットして、リターンする
  config.headers.Authorization = `Bearer ${token}`; // tokenの前にBarerという文字をつけて代入する
  return config;
};
