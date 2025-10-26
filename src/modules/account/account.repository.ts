import api from "../../lib";
import { User } from "../users/user.entity";

export const accountRepository = {
  /**
   * ユーザーのプロフィール情報を更新する
   * @param {string} name - ユーザーの名前
   * @param {File} file - プロフィール画像（任意）
   * @returns {Promise<User>} - 更新されたユーザー情報
   */
  async updateProfile(name: string, file?: File) {
    const result = await api.putForm("/account/profile", { name, file });
    return new User(result.data);
  },
};
