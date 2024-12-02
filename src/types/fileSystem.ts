export interface File {
  name: string;
  pointer: number;
  permissions: { read: boolean; write: boolean; execute: boolean };
  password: string | null;
}

export interface User {
  id: number;
  username: string;
  files: File[];
  openedFiles: File[];
}
