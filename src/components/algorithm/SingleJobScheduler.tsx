import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// 文件数据接口
interface File {
  name: string;
  pointer: number; // 指针位置
}

interface User {
  id: number;
  username: string;
  files: File[]; // 用户拥有的文件
  openedFiles: File[]; // 当前打开的文件
}

const FileSystem: React.FC = () => {
  // 初始化用户和文件数据
  const initialUsers: User[] = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    username: `用户${index + 1}`,
    files: Array.from({ length: 10 }, (_, fileIndex) => ({
      name: `文件${fileIndex + 1}`,
      pointer: 0,
    })),
    openedFiles: [],
  }));

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const handleSelectUser = (userId: number) => {
    setCurrentUserId(userId);
  };

  const handleOpenFile = (fileIndex: number) => {
    if (!currentUserId) return;
    const userIndex = currentUserId - 1;
    const user = users[userIndex];
    const file = user.files[fileIndex];

    if (user.openedFiles.length < 5) {
      const updatedUser = {
        ...user,
        openedFiles: [...user.openedFiles, file],
      };
      const updatedUsers = [...users];
      updatedUsers[userIndex] = updatedUser;
      setUsers(updatedUsers);
    }
  };

  // 关闭文件
  const handleCloseFile = (fileIndex: number) => {
    if (!currentUserId) return;
    const user = users[currentUserId - 1];
    user.openedFiles.splice(fileIndex, 1);
    setUsers([...users]);
  };

  // 执行读/写操作（模拟）
  const handleReadWrite = (fileIndex: number) => {
    if (!currentUserId) return;
    const user = users[currentUserId - 1];
    const file = user.openedFiles[fileIndex];

    // 模拟读写操作，更新文件指针
    if (file.pointer < 10) {
      file.pointer += 1; // 每次读写操作指针移动1
      setUsers([...users]);
    } else {
      alert(`${file.name} 已经读取/写完了!`);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">文件管理系统</h1>

      {/* 选择用户 */}
      <Card>
        <CardHeader>
          <CardTitle>选择用户</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {initialUsers.map((user) => (
              <Button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="w-full"
              >
                {user.username}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentUserId && (
        <div>
          {/* 用户的文件 */}
          <Card>
            <CardHeader>
              <CardTitle>{`用户${currentUserId}的文件`}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>文件名</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users[currentUserId - 1].files.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleOpenFile(index)}
                          className="mr-2"
                        >
                          打开
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 打开的文件 */}
          <Card>
            <CardHeader>
              <CardTitle>{`当前打开的文件（AFD）`}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {users[currentUserId - 1].openedFiles.map((file, index) => (
                  <div key={index} className="p-2 border">
                    <span>
                      {file.name} - 指针位置: {file.pointer}
                    </span>
                    <Button
                      onClick={() => handleReadWrite(index)}
                      className="mt-2"
                    >
                      读/写
                    </Button>
                    <Button
                      onClick={() => handleCloseFile(index)}
                      className="mt-2 ml-2"
                    >
                      关闭
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FileSystem;
