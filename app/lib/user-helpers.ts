import { USERS, User } from "../constants/users";

export function getUserById(id: string): User | undefined {
  return USERS.find((user) => user.id === id);
}

export function getAllUsers(): readonly User[] {
  return USERS;
}

export function userIdExists(id: string): boolean {
  return USERS.some((user) => user.id === id);
}
