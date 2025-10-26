import "../Signup/auth.css";
import CreateWorkspaceModal from "../Home/WorkspaceSelector/CreateWorkspaceModal";
import { useCurrentUserStore } from "../../modules/auth/current-user.state";
import { Navigate, useNavigate } from "react-router-dom";
import { workspaceRepository } from "../../modules/workspaces/workspace.repository";
import { useEffect, useState } from "react";
import type { Workspace } from "../../modules/workspaces/workspace.entity";

/**
データの流れ： 親 → 子
イベントの流れ： 子 → 親（ただし「関数」を介して）

子が親に「値」を渡してるように見えるが、実は親の関数を実行してるだけ！

🖱️ ユーザーがボタンをクリック
       ↓
子：onClick が発火
       ↓
子：props.onSubmit(workspaceName) を実行
       ↓
親：createWorkspace(name) が呼ばれる
       ↓
親：APIを叩いてワークスペース作成
 */

// ワークスペースを作成する「親」のロジックコンポーネント
function CreateWorkspace() {
  const { currentUser } = useCurrentUserStore();
  const navigate = useNavigate();
  const [homeWorkspaces, setHomeWorkspaces] = useState<Workspace>();
  const [isLoading, setIsLoading] = useState(true);

  // ワークスペースの取得
  const fetchWorkspaces = async () => {
    try {
      const workspaces = await workspaceRepository.find();
      setHomeWorkspaces(workspaces[0]);
    } catch (error) {
      console.error("ワークスペースの取得に失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const createWorkspace = async (name: string) => {
    try {
      const newWorkspace = await workspaceRepository.create(name);
      // ワークスペース作成後にそのワークスペースのメインチャンネルにリダイレクト
      navigate(`/${newWorkspace.id}/${newWorkspace.channels[0].id}`);
    } catch (error) {
      console.error("ワークスペースの作成に失敗しました", error);
    }
  };


  if (isLoading) return <div />;
  // リダイレクトを実現するコード。ログインしていなければ/signinにリダイレクトをするというコード
  if (currentUser == null) return <Navigate to="/signin" />;
  // ホームワークスペースがあればそのワークスペースのメインチャンネルにリダイレクト
  if (homeWorkspaces != null)
    return (
      <Navigate to={`/${homeWorkspaces.id}/${homeWorkspaces.channels[0].id}`} />
    );

  return (
    <div>
      {/* createWorkspaceという関数をonSubmitという名前でCreateWorkspaceModalに渡している */}
      <CreateWorkspaceModal onSubmit={createWorkspace} allowCancel={false} />
    </div>
  );
}

export default CreateWorkspace;
