import { atom, useAtom } from "jotai";
import { User } from "../users/user.entity";

// Jotaiを使ったグローバルステートの管理
// このコードは「現在のユーザー情報をアプリ全体で共有・更新するための、Jotai＋TypeScriptによるシンプルな状態管理フック」


// Atom（状態の入れ物） を作っている
const currentUserAtom = atom<User>();

// useCurrentUserStore： currentUser と setCurrentUser を提供する便利なカスタムフック
// currentUser: 現在アプリを使っている＝ログイン中のユーザーの情報（読み取り用）
// setCurrentUser: ユーザー情報を更新する関数（書き込み用）

export const useCurrentUserStore = ()=>{
    // 「currentUserAtom に格納されている状態（データ）を読み書きできるようにする」行。
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom); 
    return {currentUser, setCurrentUser};
};

// pages側でsetCurrentUser(user); と書いたら取得したユーザー情報 user をアプリ全体の状態に反映できる
