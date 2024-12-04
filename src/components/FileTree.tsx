import React, { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";

interface FileProps {
  id: string;
  name: string;
  type: "file" | "directory";
  children?: FileProps[];
}

interface FileTreeProps {
  files: FileProps[];
  onDelete: (id: string) => void;
  onCreate: (
    name: string,
    parentId: string | null,
    type: "file" | "directory"
  ) => void;
  onSelect: (id: string) => void;
  selectedFolder: string | null;
  onSelectFolder: (id: string | null) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  files,
  onDelete,
  onCreate,
  onSelect,
  selectedFolder,
  onSelectFolder,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [newItemName, setNewItemName] = useState("");
  const [creatingItemType, setCreatingItemType] = useState<
    "file" | "directory" | null
  >(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleCreate = (
    parentId: string | null,
    type: "file" | "directory"
  ) => {
    if (newItemName) {
      onCreate(newItemName, parentId, type);
      setNewItemName("");
      setCreatingItemType(null);
    }
  };

  const renderFile = (file: FileProps, level: number = 0) => {
    const isExpanded = expandedFolders.has(file.id);
    const isSelected = selectedFolder === file.id;

    return (
      <div key={file.id} style={{ marginLeft: `${level * 20}px` }}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`flex items-center space-x-2 py-1 ${
                isSelected ? "bg-primary/10" : ""
              }`}
              onClick={() =>
                file.type === "directory" && onSelectFolder(file.id)
              }
            >
              {file.type === "directory" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(file.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
              )}
              {file.type === "directory" ? (
                <Folder size={16} />
              ) : (
                <File size={16} />
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (file.type === "file") {
                    onSelect(file.id);
                  }
                }}
                className={file.type === "file" ? "cursor-pointer" : ""}
              >
                {file.name}
              </span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onDelete(file.id)}>
              删除
            </ContextMenuItem>
            {file.type === "directory" && (
              <>
                <ContextMenuItem
                  onClick={() => {
                    onSelectFolder(file.id);
                    setCreatingItemType("file");
                  }}
                >
                  新建文件
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    onSelectFolder(file.id);
                    setCreatingItemType("directory");
                  }}
                >
                  新建文件夹
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
        {isSelected && creatingItemType && (
          <div className="flex items-center mt-2 ml-6 space-x-2">
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={
                creatingItemType === "file" ? "新文件名" : "新文件夹名"
              }
              onKeyPress={(e) =>
                e.key === "Enter" && handleCreate(file.id, creatingItemType)
              }
            />
            <Button onClick={() => handleCreate(file.id, creatingItemType)}>
              创建
            </Button>
          </div>
        )}
        {file.type === "directory" &&
          isExpanded &&
          file.children?.map((child) => renderFile(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {files.map((file) => renderFile(file))}
      {selectedFolder === null && (
        <div className="flex items-center mt-4 space-x-2">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="新文件/文件夹名"
            onKeyPress={(e) =>
              e.key === "Enter" &&
              handleCreate(null, creatingItemType || "file")
            }
          />
          <Button onClick={() => setCreatingItemType("file")}>新建文件</Button>
          <Button onClick={() => setCreatingItemType("directory")}>
            新建文件夹
          </Button>
        </div>
      )}
      {selectedFolder === null && creatingItemType && (
        <div className="flex items-center mt-2 space-x-2">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={
              creatingItemType === "file" ? "新文件名" : "新文件夹名"
            }
            onKeyPress={(e) =>
              e.key === "Enter" && handleCreate(null, creatingItemType)
            }
          />
          <Button onClick={() => handleCreate(null, creatingItemType)}>
            创建
          </Button>
        </div>
      )}
    </div>
  );
};
