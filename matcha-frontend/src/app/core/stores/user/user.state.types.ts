export interface User {
  UserUUID: string;
  DisplayName: string;
  EmailAddress?: string;
  LastAlive: number;
  Admin: number;
  Avatar?: string;
}
