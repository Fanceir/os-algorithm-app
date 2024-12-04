import React, { useState } from "react";
import { useFileSystem } from "@/hooks/useFileSystem";
import { FileTree } from "@/components/FileTree";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const FileSystem: React.FC = () => {
  const {
    files,
    createFile,
    deleteFile,
    updateFileContent,
    selectedFolder,
    selectFolder,
  } = useFileSystem();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");

  const handleSelectFile = (id: string) => {
    const findFile = (files: any[]): any => {
      for (const file of files) {
        if (file.id === id) return file;
        if (file.children) {
          const found = findFile(file.children);
          if (found) return found;
        }
      }
      return null;
    };

    const file = findFile(files);
    if (file && file.type === "file") {
      setSelectedFile(id);
      setFileContent(file.content || "");
    }
  };

  const handleSaveContent = () => {
    if (selectedFile) {
      updateFileContent(selectedFile, fileContent);
    }
  };

  return (
    <div className="container p-4 mx-auto space-y-8">
      <h1 className="mb-6 text-3xl font-bold text-center">文件管理系统</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>文件目录</CardTitle>
          </CardHeader>
          <CardContent>
            <FileTree
              files={files}
              onDelete={deleteFile}
              onCreate={createFile}
              onSelect={handleSelectFile}
              selectedFolder={selectedFolder}
              onSelectFolder={selectFolder}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>文件内容</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="选择一个文件来查看或编辑内容"
              rows={10}
              className="mb-4"
            />
            <Button onClick={handleSaveContent} disabled={!selectedFile}>
              保存内容
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileSystem;
