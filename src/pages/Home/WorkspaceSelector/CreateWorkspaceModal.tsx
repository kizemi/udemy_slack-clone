import { useState } from "react";
import { useUiStore } from "../../../modules/ui/ui.state";

/**
 * 子が親にワークスペースの名前という「値」を渡してるように見えるが、実は親の関数を実行してるだけ！
 */

// propsの型を宣言（子コンポーネントが勝手に定義してしまうのがReactのやり方）
interface Props {
  // 受け取ったワークスペース名をサーバーに送信してワークスペースを作成する関数
  onSubmit: (name: string) => void;
  // キャンセルボタンを表示するかどうかのフラグ
  allowCancel?: boolean;
}

// propsを受け取ってワークスペースを作成する「子」のUIコンポーネント
function CreateWorkspaceModal(props: Props) {
  const { setShowCreateWorkspaceModal } = useUiStore();
  const [workspaceName, setWorkspaceName] = useState("");

  return (
    <div
      className="profile-modal-overlay"
      onClick={() => setShowCreateWorkspaceModal(false)}
    >
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>新しいワークスペースを作成</h2>
        </div>

        <div className="profile-modal-content">
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="workspaceName">ワークスペース名</label>
              <input
                type="text"
                id="workspaceName"
                name="workspaceName"
                className="profile-input"
                placeholder="新しいワークスペース名を入力してください"
                autoFocus
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <div className="help-text">
                チームやプロジェクトの名前など、ワークスペースの用途がわかりやすい名前を設定してください。
              </div>
            </div>
          </div>
        </div>

        <div className="profile-modal-footer">
          {/* allowCancelがtrueの時はキャンセルを表示 */}
          {props.allowCancel && (
            <button
              className="cancel-button"
              onClick={() => setShowCreateWorkspaceModal(false)}
            >
              キャンセル
            </button>
          )}
          <button
            className="save-button"
            onClick={() => props.onSubmit(workspaceName)}
          >
            作成
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateWorkspaceModal;
