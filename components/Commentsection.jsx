"use client";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const Commentsection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetchComments();
    getSession().then(setSession);
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>

        {session ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-3">
              <div className="grid w-full min-h-12 h-14">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows="3"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-3 max-h-14 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              Please sign in to leave a comment.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <div className="flex-shrink-0">
                  <div className="ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={
                        comment.author?.image ||
                        "https://imgs.search.brave.com/CFBTYPNRel95sDw00APELv5D4Ghs73sYYcN0-tLpV5U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vZ0pseTAv/TUFHRGtNZ0pseTAv/MS90bC9jYW52YS11/c2VyLXByb2ZpbGUt/aWNvbi12ZWN0b3Iu/LWF2YXRhci1vci1w/ZXJzb24taWNvbi4t/cHJvZmlsZS1waWN0/dXJlLC1wb3J0cmFp/dC1zeW1ib2wuLU1B/R0RrTWdKbHkwLnBu/Zw"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comment.author?.name || "Anonymous"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Commentsection;
