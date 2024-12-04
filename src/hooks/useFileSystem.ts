import { useState } from "react";

interface File {
  id: string;
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: File[];
}

export const useFileSystem = () => {
  const [files, setFiles] = useState<File[]>([
    {
      id: "1",
      name: "home",
      type: "directory",
      children: [
        { id: "2", name: "documents", type: "directory", children: [] },
        { id: "3", name: "pictures", type: "directory", children: [] },
        { id: "4", name: "hello.txt", type: "file", content: "Hello, World!" },
      ],
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const createFile = (
    name: string,
    parentId: string | null,
    type: "file" | "directory"
  ) => {
    const newFile: File = {
      id: Date.now().toString(),
      name,
      type,
      children: type === "directory" ? [] : undefined,
      content: type === "file" ? "" : undefined,
    };

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      if (parentId) {
        const addToParent = (files: File[]): File[] => {
          return files.map((file) => {
            if (file.id === parentId) {
              return { ...file, children: [...(file.children || []), newFile] };
            }
            if (file.children) {
              return { ...file, children: addToParent(file.children) };
            }
            return file;
          });
        };
        return addToParent(updatedFiles);
      }
      return [...updatedFiles, newFile];
    });
  };

  const deleteFile = (id: string) => {
    setFiles((prevFiles) => {
      const deleteFromArray = (files: File[]): File[] => {
        return files.filter((file) => {
          if (file.id === id) {
            return false;
          }
          if (file.children) {
            file.children = deleteFromArray(file.children);
          }
          return true;
        });
      };
      return deleteFromArray(prevFiles);
    });
  };

  const updateFileContent = (id: string, content: string) => {
    setFiles((prevFiles) => {
      const updateContent = (files: File[]): File[] => {
        return files.map((file) => {
          if (file.id === id) {
            return { ...file, content };
          }
          if (file.children) {
            return { ...file, children: updateContent(file.children) };
          }
          return file;
        });
      };
      return updateContent(prevFiles);
    });
  };

  const selectFolder = (id: string | null) => {
    setSelectedFolder(id);
  };

  return {
    files,
    createFile,
    deleteFile,
    updateFileContent,
    selectedFolder,
    selectFolder,
  };
};
