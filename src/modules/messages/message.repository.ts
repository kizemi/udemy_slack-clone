import api from "../../lib";
import { Message } from "./message.entity";

export const messageRepository = {
  /**
   * メッセージをサーバーから取得する関数
   */
  async find(workspaceId: string, channelId: string): Promise<Message[]> {
    const result = await api.get(`/messages/${workspaceId}/${channelId}`);
    return result.data.map((message: Message) => new Message(message));
  },

  /**
   * メッセージをサーバーにpostして作成する関数
   * @param {string} workspaceId - ワークスペースID
   * @param {string} channelId - チャンネルID
   * @param {string} content - メッセージの内容
   * @returns {Promise<Message>} - 作成したメッセージ
   */
  async create(
    workspaceId: string,
    channelId: string,
    content: string
  ): Promise<Message> {
    const result = await api.post(`/messages/${workspaceId}/${channelId}`, {
      content,
    });
    return new Message(result.data);
  },

  async uploadImage(
    workspaceId: string,
    channelId: string,
    file: File
  ): Promise<Message> {
    const result = await api.postForm(
      `/messages/${workspaceId}/${channelId}/image`,
      { file }
    );
    return new Message(result.data);
  },

  async delete(messageId: string): Promise<boolean> {
    await api.delete(`/messages/${messageId}`);
    return true;
  },
};
