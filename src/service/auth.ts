import { UserRequestBody } from '../models/User';

const userSessionMap = new Map();

function setUser(id: string, user: UserRequestBody) {
  userSessionMap.set(id, user);
}

function getUser(id: string) {
  return userSessionMap.get(id);
}

export { setUser, getUser };
