import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - 页面未找到</h1>
      <p>很抱歉，您访问的页面不存在或已被删除。请检查网址或返回首页。</p>
      <button onClick={() => navigate("/")}>返回首页</button>
      <br />
    </div>
  );
};

export default NotFoundPage;
