
// 「このユーザーIDの人が、このワークスペースIDに招待されていて参加している」という情報を表す
export class WorkspaceUser {
    id!: string;
    userId!: string;
    workspaceId!: string;

    constructor(data: WorkspaceUser) {
      Object.assign(this, data);
    }
}