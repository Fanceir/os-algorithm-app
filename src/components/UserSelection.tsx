import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserSelectionProps {
  users: { id: number; username: string }[];
  onCreateUser: (username: string) => void;
  onSelectUser: (userId: number) => void;
}

export const UserSelection: React.FC<UserSelectionProps> = ({
  users,
  onCreateUser,
  onSelectUser,
}) => {
  const [username, setUsername] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">用户管理</h2>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名"
        />
        <Button
          onClick={() => {
            onCreateUser(username);
            setUsername("");
          }}
        >
          创建用户
        </Button>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">选择用户</h3>
        {users.map((user) => (
          <Button key={user.id} onClick={() => onSelectUser(user.id)}>
            {user.username}
          </Button>
        ))}
      </div>
    </div>
  );
};
