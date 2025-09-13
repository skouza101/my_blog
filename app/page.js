"use client";
import { useState, useEffect } from "react";
import Postcard from "../components/Postcard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex gap-y-8 py-12 flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="space-y-6">
            <div className="rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="skeleton h-20 w-20 rounded-full"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="skeleton h-4 w-1/3"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              </div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-5/6"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
            <div className="rounded-2xl p-6">
              <div className="skeleton h-32 w-full rounded-lg"></div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-3xl mx-auto px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="space-y-6">
            <div className="rounded-2xl  p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="skeleton h-20 w-20 rounded-full"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="skeleton h-4 w-1/3"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              </div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-5/6"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
            <div className="rounded-2xl  p-6">
              <div className="skeleton h-32 w-full rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Posts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto ">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to My Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover amazing stories and insights
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Posts Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to create a post!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Postcard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
