import api from "../../lib";
import { User } from "./user.entity";

export const userRepository = {
  async find(keyword: string): Promise<User[]> {
    const result = await api.get(`/users`, { params: { keyword } });
    return result.data.map((user: User) => new User(user));
  },
};
