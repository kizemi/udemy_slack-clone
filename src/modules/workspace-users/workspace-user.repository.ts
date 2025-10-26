import api from "../../lib";
import { WorkspaceUser } from "./workspace-user.entity";

export const workspaceUserRepository = {
  /**
   * 新しいワークスペースユーザー情報を作成する
   * @param {string} workspaceId - ワークスペースID
   * @param {string[]} userIds - ユーザーIDの配列
   * @returns {Promise<WorkspaceUser[]>} - 作成したワークスペースユーザー情報の配列
   */

  async create(
    workspaceId: string,
    userIds: string[]
  ): Promise<WorkspaceUser[]> {
    const result = await api.post(`/workspace-users/${workspaceId}`, {
      userIds,
    });
    return result.data.workspaceUsers.map(
      (workspaceUser: WorkspaceUser) => new WorkspaceUser(workspaceUser)
    );
  },
};
