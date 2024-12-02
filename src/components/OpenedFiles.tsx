import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File } from "../types/fileSystem";

interface OpenedFilesProps {
  files: File[];
  onCloseFile: (index: number) => void;
  onReadWrite: (index: number, password?: string) => void;
}

export const OpenedFiles: React.FC<OpenedFilesProps> = ({
  files,
  onCloseFile,
  onReadWrite,
}) => {
  const [readWritePassword, setReadWritePassword] = useState("");

  const handleReadWrite = (index: number) => {
    onReadWrite(index, readWritePassword);
    setReadWritePassword("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">打开文件:</h3>
      {files.map((file, index) => (
        <div
          key={index}
          className="p-4 border rounded-md flex justify-between items-center"
        >
          <span>
            {file.name} - 指针 {file.pointer}
          </span>
          <div className="space-x-2">
            {file.password ? (
              <div className="flex space-x-2">
                <Input
                  type="password"
                  value={readWritePassword}
                  onChange={(e) => setReadWritePassword(e.target.value)}
                  placeholder="Enter password"
                />
                <Button onClick={() => handleReadWrite(index)}>读/写</Button>
              </div>
            ) : (
              <Button onClick={() => onReadWrite(index)}>读/写</Button>
            )}
            <Button onClick={() => onCloseFile(index)}>关闭</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
