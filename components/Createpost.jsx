"use client";
import { useState } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";

const Createpost =  ({ setIsModalOpen }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  


  const handelSubmet = async (e) => {
    e.preventDefault();
    const session = await getSession();
    console.log(session);
    try {
      const response  = await axios.post('/api/posts', {
        title,
        content,
        tags: tags.split(' ').map(tag => tag.trim()).filter(tag => tag),
        userId: (session).user.id,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status >= 200 && response.status < 300) {
        setIsModalOpen(false);
        console.log("Post created successfully");
    } else {
        console.log("Error creating post:", response.data);
    }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  return (
    <div className="fixed top-0 h-screen left-0 right-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/20 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Create New Post
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 group"
          >
            <svg
              className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              id="title"
              required
              placeholder="Enter an engaging post title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Content (Markdown)
              </label>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium text-xs">
                Markdown
              </span>
            </div>
            <div className="relative">
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                rows="8"
                name="content"
                id="content"
                required
                placeholder="Start writing your amazing content..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none font-mono text-sm"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                Markdown supported
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <input
              onChange={(e) => setTags(e.target.value)}
              value={tags}
              type="text"
              name="tags"
              id="tags"
              placeholder="e.g. technology, programming, webdev"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={handelSubmet}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Publish Post
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createpost;