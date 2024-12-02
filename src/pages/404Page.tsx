import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-gray-200">
          404
        </h1>
        <h2 className="mb-4 text-3xl font-semibold text-gray-700 dark:text-gray-300">
          页面未找到
        </h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          很抱歉，您访问的页面不存在或已被删除。
          <br />
          请检查网址或返回首页。
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回上一页
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> 返回首页
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          如果您认为这是一个错误，请联系作者Fanceir 。
        </p>
      </div>
    </div>
  );
}
