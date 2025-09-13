
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";

const Postcard = ({ post }) => {
  const { data: session, status } = useSession();

  const truncateContent = (content, maxLength = 300) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-6 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-5">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
        {children}
      </blockquote>
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">

      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {post.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
              <div className="ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={
                        
                        post?.author?.image ||
                        session.user.image
                        ||

                        "https://imgs.search.brave.com/CFBTYPNRel95sDw00APELv5D4Ghs73sYYcN0-tLpV5U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vZ0pseTAv/TUFHRGtNZ0pseTAv/MS90bC9jYW52YS11/c2VyLXByb2ZpbGUt/aWNvbi12ZWN0b3Iu/LWF2YXRhci1vci1w/ZXJzb24taWNvbi4t/cHJvZmlsZS1waWN0/dXJlLC1wb3J0cmFp/dC1zeW1ib2wuLU1B/R0RrTWdKbHkwLnBu/Zw"

                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                <span className="font-medium">{post.author?.name||
                        session.user.name || "Anonymous"}</span>
              </div>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
            </div>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {truncateContent(post.content)}
          </ReactMarkdown>
        </div>

        {post.content && post.content.length > 300 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
            href={`/blog/${post.id}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 cursor-pointer"
            >
              Read More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Postcard;