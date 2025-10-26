// Socket.io クライアントライブラリをインポート（サーバーとのリアルタイム通信に使用）
import { io } from "socket.io-client";
import { Message } from "../modules/messages/message.entity";

// 環境変数からAPIのベースURLを取得（例: http://localhost:8888）
const baseURL = import.meta.env.VITE_API_URL;

// Socket.io の接続を初期化
// サーバー側で `io()` に対応する Socket.io サーバーが待ち受けている必要がある
const socket = io(baseURL);

// ✅ 新しいメッセージ受信・削除イベントを購読する関数
// 特定のワークスペースに参加し、サーバーから送られてくる「新規メッセージ」「削除メッセージ」を監視する
export const subscribe = (
  workspaceId: string, // どのワークスペース（チャットルーム）に接続するかを指定
  onNewMessage: (message: Message) => void, // 新しいメッセージ受信時のコールバック
  onDeleteMessage: (messageId: string) => void // メッセージ削除時のコールバック
) => {
  // 指定したワークスペースに「参加」するイベントをサーバーへ送信
  // サーバー側で `socket.on("join-workspace")` を受け取ってルームに追加する
  socket.emit("join-workspace", workspaceId);

  // サーバーから "new-message" イベント（新規メッセージの通知）を受け取ったときに実行される
  // 受け取った message はただのプレーンなオブジェクト（JSON）なので、
  // Message クラスのインスタンスとして復元してから onNewMessage に渡す
  socket.on("new-message", (message: Message) => {
    onNewMessage(new Message(message));
  });

  // サーバーから「delete-message」イベントを受け取ったときに呼ばれる
  // メッセージIDを受け取り、onDeleteMessageコールバックに渡す
  socket.on("delete-message", onDeleteMessage);
};

// ✅ イベント購読を解除（切断）する関数
//
export const unsubscribe = (workspaceId: string) => {
  // 指定したワークスペースから「退出」するイベントをサーバーに送信
  // サーバー側ではこのイベントを受け取って `socket.leave(room)` などを実行
  socket.emit("leave-workspace", workspaceId);

  // クライアント側で「new-message」イベントのリスナーを解除
  socket.off("new-message");

  // クライアント側で「delete-message」イベントのリスナーを解除
  socket.off("delete-message");
};
