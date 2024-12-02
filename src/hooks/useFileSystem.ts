import { useState } from "react";
import { User, File } from "../types/fileSystem";

export function useFileSystem() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const createUser = (username: string) => {
    if (users.some((user) => user.username === username)) {
      throw new Error("User already exists");
    }
    const newUser: User = {
      id: users.length + 1,
      username,
      files: [],
      openedFiles: [],
    };
    setUsers([...users, newUser]);
  };

  const selectUser = (userId: number) => {
    setCurrentUserId(userId);
  };

  const getCurrentUser = () => {
    return currentUserId
      ? users.find((user) => user.id === currentUserId)
      : null;
  };

  const createFile = (fileName: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    const newFile: File = {
      name: fileName,
      pointer: 0,
      permissions: { read: true, write: true, execute: false },
      password: null,
    };
    user.files.push(newFile);
    setUsers([...users]);
  };

  const deleteFile = (fileIndex: number) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    user.files = user.files.filter((_, index) => index !== fileIndex);
    setUsers([...users]);
  };

  const renameFile = (fileIndex: number, newName: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    user.files[fileIndex].name = newName;
    setUsers([...users]);
  };

  const setFilePassword = (fileIndex: number, password: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    user.files[fileIndex].password = password;
    setUsers([...users]);
  };

  const openFile = (fileIndex: number, password?: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    const file = user.files[fileIndex];
    if (file.password && file.password !== password) {
      throw new Error("Incorrect password");
    }
    if (!file.permissions.read) {
      throw new Error("No read permission");
    }
    if (user.openedFiles.length >= 5) {
      throw new Error("Maximum open files reached");
    }
    user.openedFiles.push(file);
    setUsers([...users]);
  };

  const closeFile = (fileIndex: number) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    user.openedFiles = user.openedFiles.filter(
      (_, index) => index !== fileIndex
    );
    setUsers([...users]);
  };

  const readWriteFile = (fileIndex: number, password?: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error("No user selected");

    const file = user.openedFiles[fileIndex];
    if (file.password && file.password !== password) {
      throw new Error("Incorrect password");
    }
    if (!file.permissions.write) {
      throw new Error("No write permission");
    }
    file.pointer += 1;
    setUsers([...users]);
  };

  return {
    users,
    currentUserId,
    createUser,
    selectUser,
    getCurrentUser,
    createFile,
    deleteFile,
    renameFile,
    setFilePassword,
    openFile,
    closeFile,
    readWriteFile,
  };
}
