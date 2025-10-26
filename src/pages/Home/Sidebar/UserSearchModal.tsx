import { useEffect, useState } from "react";
import { useUiStore } from "../../../modules/ui/ui.state";
import type { User } from "../../../modules/users/user.entity";
import { userRepository } from "../../../modules/users/user.repository";
import { useDebouncedCallback } from "use-debounce";
import { workspaceUserRepository } from "../../../modules/workspace-users/workspace-user.repository";

interface Props {
  workspaceId: string;
}

function UserSearchModal(props: Props) {
  const { workspaceId } = props;
  const { setShowUserSearchModal } = useUiStore();
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addUser = (user: User) => {
    // 既に選択済みのユーザーを選択しない
    if (!selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setKeyword("");
    setSearchResults([]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const inviteUsers = async () => {
    try {
      await workspaceUserRepository.create(
        workspaceId,
        selectedUsers.map((user) => user.id)
      );
      setShowUserSearchModal(false);
    } catch (error) {
      console.error("ユーザーの招待に失敗しました", error);
    }
  };

  const searchUsers = async () => {
    // キーワードが空白の場合は何も返さない
    if (keyword.trim() === "") {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const users = await userRepository.find(keyword);
      setSearchResults(users);
    } catch (error) {
      console.error("ユーザーの検索中にエラーが発生しました", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // use-debounceライブラリのuseDebouncedCallback関数を使ってデバウンスを実現する
  const debouncedSearch = useDebouncedCallback(searchUsers, 500);

  // デバウンスで検索する
  useEffect(() => {
    debouncedSearch();
  }, [keyword]);

  return (
    <div
      className="modal-overlay"
      onClick={() => setShowUserSearchModal(false)}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>メンバーを招待する</h2>
          <button
            className="close-button"
            onClick={() => setShowUserSearchModal(false)}
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="invite-form">
            <label htmlFor="invite-input">招待するメンバー：</label>
            <div className="selected-users-container">
              {selectedUsers.map((user) => (
                <div key={user.id} className="selected-user-chip">
                  <img
                    src={user.iconUrl}
                    alt={user.name}
                    className="user-avatar small"
                  />
                  <span>{user.name}</span>
                  <button
                    className="remove-user-button"
                    onClick={() => removeUser(user.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                id="invite-input"
                className="invite-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="user-suggestions">
            {isLoading && <div className="loading-indicator">検索中...</div>}
            {searchResults.map((user) => {
              // 既に招待済みのユーザーかどうかチェック
              const isInWorkspace = user.workspaceUsers?.some(
                (workspaceUser) =>
                  workspaceUser.workspaceId === props.workspaceId
              );
              return (
                <div
                  key={user.id}
                  className={`user-suggestion-item ${
                    isInWorkspace ? "already-invited" : ""
                  }`}
                  // 既に招待済みのユーザーはクリックできないようにする
                  onClick={isInWorkspace ? undefined :() => addUser(user)}
                >
                  <img
                    src={user.iconUrl}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    {isInWorkspace && (<div className="already-invited-tag">既に招待済み</div>)}
                  </div>
                </div>
                
              );
            })}
          </div>

          <div className="modal-footer">
            <button
              className="invite-button"
              onClick={inviteUsers}
              disabled={selectedUsers.length === 0}
            >
              招待する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSearchModal;
