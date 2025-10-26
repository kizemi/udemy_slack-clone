import { Link, Navigate } from "react-router-dom";
import "../Signup/auth.css";
import { useState } from "react";
import { authRepository } from "../../modules/auth/auth.repository";
import { useCurrentUserStore } from "../../modules/auth/current-user.state";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // setCurrentUserだけを取り出すという意味の分割関数
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  const signin = async () => {
    if (email == "" || password == "") return; // バリデーション
    const { user, token } = await authRepository.signin(email, password);
    // ローカルストレージにトークンを保存（ログイン情報の維持のため）
    localStorage.setItem('token', token);
    // currentUserAtom（＝グローバルなユーザー状態）を更新している 処理。取得したユーザー情報 user をアプリ全体の状態に反映しているということ。
    setCurrentUser(user);
  };

  // currentUserというグローバルステートの中に現在ログインしているユーザーの情報があれば / にリダイレクトをするというコード.
  // ログインした瞬間に / に飛ばすという挙動を実現できる.
  if (currentUser != null) return <Navigate to="/" />;

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h1 className="signup-title">Sign in</h1>
        <p className="signup-subtitle">メールアドレスでログインしてください</p>

        <div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="continue-button"
            disabled={email == "" || password == ""} // バリデーション
            onClick={signin}
          >
            Continue
          </button>
        </div>
        <p className="signin-link">
          ユーザー登録は<Link to="/signup">こちら</Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
