import axios from "axios";
import { addAuthorizationHeader } from "./api/interceptors/request";

// API通信（HTTP通信）」の設定をまとめた初期化ファイル
// 「Axios（HTTP通信ライブラリ）を使って、APIにリクエストを送る準備をしている」コード

// この2行で「.env に書かれているAPIサーバーのURLを使って、共通設定済みのAxiosクライアント api を作っている」
// 環境変数からAPIのベースURLを取得（例: http://localhost:8888）
const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL });

api.defaults.headers.common["Content-Type"] = "application/json";
// 「リクエストが送信される直前に addAuthorizationHeader を自動実行する」設定
// トークンを渡すことでログイン情報を保持する
api.interceptors.request.use(addAuthorizationHeader); // Interceptor＝リクエストを送る前に処理を挟み込む仕組み

export default api; // 共通のAPIクライアントに設定
