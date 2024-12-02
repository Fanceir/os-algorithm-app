import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileSystem } from "@/hooks/useFileSystem";
import { UserSelection } from "@/components/UserSelection";
import { FileList } from "@/components/FileList";
import { OpenedFiles } from "@/components/OpenedFiles";
import { TopBar } from "@/components/TopBar";

const FileSystem: React.FC = () => {
  const {
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
  } = useFileSystem();

  const [newFileName, setNewFileName] = useState("");

  const currentUser = getCurrentUser();

  return (
    <div className="container mx-auto p-4 space-y-8">
      <TopBar />
      <h1 className="text-3xl font-bold text-center mb-6">文件管理系统</h1>

      {!currentUserId ? (
        <UserSelection
          users={users}
          onCreateUser={createUser}
          onSelectUser={selectUser}
        />
      ) : (
        <div className="space-y-6">
          <Button onClick={() => selectUser(null)}>返回选择用户</Button>
          <h2 className="text-2xl font-bold">用户： {currentUser!.username}</h2>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">创建新文件</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="输入文件名"
              />
              <Button
                onClick={() => {
                  createFile(newFileName);
                  setNewFileName("");
                }}
              >
                创建文件
              </Button>
            </div>
          </div>

          <FileList
            files={currentUser!.files}
            onOpenFile={openFile}
            onDeleteFile={deleteFile}
            onRenameFile={renameFile}
            onSetFilePassword={setFilePassword}
          />

          <OpenedFiles
            files={currentUser!.openedFiles}
            onCloseFile={closeFile}
            onReadWrite={readWriteFile}
          />
        </div>
      )}
    </div>
  );
};

export default FileSystem;
