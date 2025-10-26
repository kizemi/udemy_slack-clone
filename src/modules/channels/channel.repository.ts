import api from "../../lib";
import { Channel } from "./channel.entity";

// チャンネル関係の処理をまとめたもの
export const channelRepository = {
  async find(workspaceId: string): Promise<Channel[]> {
    const result = await api.get(`/channels/${workspaceId}`);
    return result.data.map((channel: Channel) => new Channel(channel));
  },

  /**
   * チャンネルを作成する関数
   */
  async create(workspaceId: string, name: string): Promise<Channel> {
    const result = await api.post("/channels", { workspaceId, name });
    console.log(result.data);
    return new Channel(result.data);
  },

  async delete(channelId: string): Promise<boolean> {
    await api.delete(`/channels/${channelId}`);
    return true;
  },
};
