import { WorkspaceUser } from "../workspace-users/workspace-user.entity";

export class User {
  id!: string;
  name!: string;
  email!: string;
  thumbnailUrl?: string;
  workspaceUsers?: WorkspaceUser[];

  // constructorは「クラスが new されたときに一度だけ呼ばれる“初期設定関数”」

  // 受け取ったUserデータを型付きのこのデータモデルクラスとマージする.
  // JSONのような生データを、型付きで動作するクラスインスタンスに変換するコード
  constructor(data: User) {
    // 「data の中のプロパティを this にまとめてコピーする」という命令
    Object.assign(this, data); // thisはUserクラスそのものを指してる
    // data.workspaceUsersの配列を、WorkspaceUserクラスの配列に変換
    this.workspaceUsers = data.workspaceUsers?.map(
      (workspaceUser) => new WorkspaceUser(workspaceUser)
    );
  }

  /**
   * ユーザーのアイコンURLを取得するゲッター
   * @return {string} アイコンURL
   */
  get iconUrl() {
    return (
      this.thumbnailUrl ||
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
    );
  }
}
