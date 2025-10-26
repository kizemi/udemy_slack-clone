import { User } from "../users/user.entity";

export class Message {
  id!: string;
  content?: string;
  imageUrl?: string;
  user!: User;
  createdAt!: Date;

  constructor(data: Message) {
    Object.assign(this, data);
    // apiから返ってきた時は文字列型なので、Date型に変換する
    this.createdAt = new Date(data.createdAt);
    // ただのobject型なので、User型に変換する
    if (data.user != null) {
      this.user = new User(data.user);
    }
  }

  /**
   * メッセージの日付を日本語表記に変換するゲッター
   * @return {string} 日本語表記の日付
   */
  get dateString() {
    // 日付を日本語表記に変換
    // toLocaleString()は指定されたロケールの日付を文字列で返す関数
    return this.createdAt.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  get datetimeString() {
    return this.createdAt.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
