import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File } from "../types/fileSystem";

interface FileListProps {
  files: File[];
  onOpenFile: (index: number, password?: string) => void;
  onDeleteFile: (index: number) => void;
  onRenameFile: (index: number, newName: string) => void;
  onSetFilePassword: (index: number, password: string) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onOpenFile,
  onDeleteFile,
  onRenameFile,
  onSetFilePassword,
}) => {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openPassword, setOpenPassword] = useState("");

  const handleOpenFile = (index: number) => {
    onOpenFile(index, openPassword);
    setOpenPassword("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">文件列表</h3>
      {files.map((file, index) => (
        <div key={index} className="p-4 border rounded-md space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{file.name}</span>
            <div className="space-x-2">
              {file.password ? (
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    value={openPassword}
                    onChange={(e) => setOpenPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <Button onClick={() => handleOpenFile(index)}>打开</Button>
                </div>
              ) : (
                <Button onClick={() => onOpenFile(index)}>打开</Button>
              )}
              <Button onClick={() => onDeleteFile(index)}>删除</Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="输入新文件名"
            />
            <Button
              onClick={() => {
                onRenameFile(index, newName);
                setNewName("");
              }}
            >
              重命名
            </Button>
          </div>
          <div className="flex space-x-2">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="输入密码"
            />
            <Button
              onClick={() => {
                onSetFilePassword(index, newPassword);
                setNewPassword("");
              }}
            >
              设置密码
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
