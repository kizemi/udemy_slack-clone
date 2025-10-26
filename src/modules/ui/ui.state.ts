import { atom, useAtom } from "jotai";

// 初期値はfalse（モーダルを表示しない）
const showCreateWorkspaceModalAtom = atom<boolean>(false);
const showCreateChannelModalAtom = atom<boolean>(false);
const showUserSearchModalAtom = atom<boolean>(false);
const showProfileModalAtom = atom<boolean>(false);


export const useUiStore = () => {
  // クリエイトワークスペースモーダルの表示・非表示の状態を管理するカスタムフック
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useAtom(
    showCreateWorkspaceModalAtom
  );

  // クリエイトチャンネルモーダルの表示・非表示の状態を管理するカスタムフック
  const [showCreateChannelModal, setShowCreateChannelModal] = useAtom(
    showCreateChannelModalAtom
  );

  // ユーザー招待モーダルの表示・非表示の状態を管理するカスタムフック
  const [showUserSearchModal, setShowUserSearchModal] = useAtom(
    showUserSearchModalAtom
  )

  const [showProfileModal, setShowProfileModal] = useAtom(
    showProfileModalAtom
  )

  return {
    showCreateWorkspaceModal,
    setShowCreateWorkspaceModal,
    showCreateChannelModal,
    setShowCreateChannelModal,
    showUserSearchModal,
    setShowUserSearchModal,
    showProfileModal,
    setShowProfileModal
  };
};
