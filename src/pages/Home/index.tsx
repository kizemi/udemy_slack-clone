import WorkspaceSelector from "./WorkspaceSelector";
import "./Home.css";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { useCurrentUserStore } from "../../modules/auth/current-user.state";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Workspace } from "../../modules/workspaces/workspace.entity";
import { workspaceRepository } from "../../modules/workspaces/workspace.repository";
import type { Channel } from "../../modules/channels/channel.entity";
import { channelRepository } from "../../modules/channels/channel.repository";
import type { Message } from "../../modules/messages/message.entity";
import { messageRepository } from "../../modules/messages/message.repository";
import { subscribe, unsubscribe } from "../../lib/socket";

function Home() {
  const { currentUser } = useCurrentUserStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const param = useParams();
  const { workspaceId, channelId } = param;
  // workspaces 配列の中から、workspace.id が workspaceId と一致する要素を探し、最初に見つかった1件を selectedWorkspace に代入する。
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === workspaceId
  );
  const selectedChannel = channels.find((channel) => channel.id == channelId);

  /**
   * ワークスペースの一覧をサーバーから取得し、state の workspaces に反映させる関数
   * ワークスペースの取得に失敗した場合は、エラーログをコンソールに出力する
   */
  const fetchWorkspaces = async () => {
    try {
      const workspaces = await workspaceRepository.find();
      setWorkspaces(workspaces);
    } catch (error) {
      console.error("ワークスペースの取得に失敗しました", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await messageRepository.find(workspaceId!, channelId!);
      setMessages(messages);
    } catch (error) {
      console.error("メッセージの取得に失敗しました", error);
    }
  };

  /**
   * 新しいメッセージを受信したときに実行されるコールバック
   */
  const handleNewMessage = (message: Message) => {
    setMessages((messages) => [message, ...messages]);
  };

/**
 * メッセージ削除のイベントを受け取ったときに実行されるコールバック
 * 削除されたメッセージ以外をフィルタリングしてmessagesにセットする関数
 */
  const handleDeleteMessage = (messageId: string) => {
    setMessages((messages) => messages.filter((msg) => msg.id !== messageId));
  };

  const fetchChannels = async () => {
    try {
      const channels = await channelRepository.find(workspaceId!);
      setChannels(channels);
    } catch (error) {
      console.error("チャンネルの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // workspaceId が変更された場合に、channels を取得する
  useEffect(() => {
    fetchChannels();
    subscribe(workspaceId!, handleNewMessage, handleDeleteMessage);
    return ()=> {
      unsubscribe(workspaceId!);
    };
  }, [workspaceId]);

  useEffect(() => {
    fetchMessages();
  }, [channelId]);

  // リダイレクトを実現するコード。ログインしていなければ/signinにリダイレクトをするというコード
  if (currentUser == null) return <Navigate to="/signin" />;

  /**
   homeを通してpropsを渡す設計。
   homeで状態を全て管理して、homeから子コンポーネントにpropsを渡すという設計。
   homeがWorkspaceSelector、Sidebar、MainContent の親コンポーネントということ。
   */

  return (
    <div className="slack-container">
      <WorkspaceSelector
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
        selectedWorkspaceId={workspaceId!}
      />

      {/* selectedWorkspace が null でなければ、正常なSidebarとMainContent を表示するという三項演算子のコード*/}
      {selectedWorkspace != null && selectedChannel != null ? (
        <>
          <Sidebar
            selectedWorkspace={selectedWorkspace}
            channels={channels}
            selectedChannelId={channelId!}
            setChannels={setChannels}
          />
          <MainContent
            selectedWorkspaceId={workspaceId!}
            channels={channels}
            setChannels={setChannels}
            selectedChannel={selectedChannel}
            messages={messages}
            setMessages={setMessages}
          />
        </>
      ) : (
        <div className="sidebar" />
      )}
    </div>
  );
}

export default Home;
