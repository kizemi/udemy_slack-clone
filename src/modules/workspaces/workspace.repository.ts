import api from "../../lib";
import { Workspace } from "./workspace.entity";

export const workspaceRepository = {
  async find(): Promise<Workspace[]> {
    const result = await api.get("/workspaces");
    return result.data.map((workspace: Workspace) => new Workspace(workspace));
  },

  /**
   * 新しいワークスペースをサーバーにpostして作成してもらい、その結果（URLなどを含む情報）をworkspace型をつけてから返す関数
   */
  async create(name: string): Promise<Workspace> {
    const result = await api.post("/workspaces", { name });
    return new Workspace(result.data);
  },
};
