import api from "../../lib";
import { User } from "../users/user.entity";

// 認証（Authentication）関係の処理をまとめたもの
export const authRepository = {
  // サインアップ用の非同期関数
  // このコードは「サインアップ情報をサーバーに送り、戻ってきたユーザー情報とトークンを `Promise` として返す」関数
  async signup(
    name: string,
    email: string,
    password: string
  ): // <{}>は返すデータのプロパティとその型
  Promise<{ user: User; token: string }> {
    // Promise は「非同期処理の結果を将来返すオブジェクト
    const result = await api.post("/auth/signup", {
      // クライアント側からサーバー側への送信データ
      name,
      email,
      password,
    });
    const { user, token } = result.data;
    return { user: new User(user), token }; // 呼び出し元へ返すデータ
  },

  // サインイン用の非同期関数
  async signin(email: string, password: string) {
    const result = await api.post("/auth/signin", {
      email,
      password,
    });
    const { user, token } = result.data;
    return { user: new User(user), token };
  },

  // サーバーからcurrentUser情報を取得する関数？？
  //「今ログインしているユーザーをサーバーから取得して、型付きの User クラスとして返す」関数
  // tokenを取得するコードはこの中に入れないで、それは別のファイルに書いて、apiファイルでinterceptorsで使う形式にすることで共通化を図り、個別に書く手間をなくす。
  async getCurrentUser(): Promise<User | undefined> {
    const result = await api.get("/auth/me");
    if (result.data == null) return undefined;

    return new User(result.data);
  },
};
