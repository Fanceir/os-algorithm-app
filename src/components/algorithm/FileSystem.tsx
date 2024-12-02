import React, { useState } from "react";
import { Button } from "../ui/button";
// 定义文件和用户相关的类型
interface File {
  name: string;
  pointer: number; // 文件指针，简化为读取位置
}

interface User {
  id: number;
  files: File[];
  openedFiles: File[];
}

const FileSystem: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      files: Array.from({ length: 10 }, (_, j) => ({
        name: `File_${i + 1}_${j + 1}`,
        pointer: 0,
      })),
      openedFiles: [],
    }))
  );

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const handleSelectUser = (userId: number) => {
    setCurrentUserId(userId);
  };

  const handleOpenFile = (fileIndex: number) => {
    if (!currentUserId) return;
    const user = users[currentUserId - 1];
    if (user.openedFiles.length < 5) {
      const file = user.files[fileIndex];
      user.openedFiles.push(file);
      setUsers([...users]);
    } else {
      alert("只能同时打开5个文件！");
    }
  };

  const handleCloseFile = (fileIndex: number) => {
    if (!currentUserId) return;
    const user = users[currentUserId - 1];
    user.openedFiles = user.openedFiles.filter(
      (_, index) => index !== fileIndex
    );
    setUsers([...users]);
  };

  const handleReadWrite = (fileIndex: number) => {
    if (!currentUserId) return;
    const user = users[currentUserId - 1];
    const file = user.openedFiles[fileIndex];
    file.pointer += 1; // 模拟读写操作，更新文件指针
    setUsers([...users]);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">文件管理系统</h1>

      {!currentUserId && (
        <div>
          <h2 className="text-xl mb-4">请选择一个用户：</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <Button key={user.id} onClick={() => handleSelectUser(user.id)}>
                用户 {user.id}
              </Button>
            ))}
          </div>
        </div>
      )}

      {currentUserId && (
        <div>
          <h2 className="text-xl mb-4">用户 {currentUserId} 的文件操作</h2>
          <div className="space-y-4">
            <h3>文件目录（UED）:</h3>
            <div className="grid grid-cols-2 gap-4">
              {users[currentUserId - 1].files.map((file, index) => (
                <div key={index} className="p-2 border">
                  <span>{file.name}</span>
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => handleOpenFile(index)}>打开</Button>
                    <Button onClick={() => handleReadWrite(index)}>
                      读/写
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <h3>当前打开的文件（AFD）:</h3>
            <div className="grid grid-cols-2 gap-4">
              {users[currentUserId - 1].openedFiles.map((file, index) => (
                <div key={index} className="p-2 border">
                  <span>
                    {file.name} - 指针位置: {file.pointer}
                  </span>
                  <Button
                    onClick={() => handleCloseFile(index)}
                    className="mt-2"
                  >
                    关闭
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              {users[currentUserId - 1].openedFiles.length === 0 ? (
                <Button disabled>没有打开文件</Button>
              ) : (
                <Button onClick={() => handleReadWrite(0)}>执行读写操作</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileSystem;
