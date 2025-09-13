"use client";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import axios from "axios";

const Likebutton = ({ postId, initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/likes`);
        setLikes(response.data.likes);
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikeStatus();
    getSession().then(setSession);
  }, [postId]);

  const handleLike = async () => {
    if (!session || loading) return;

    setLoading(true);
    try {
      const action = liked ? "unlike" : "like";
      const response = await axios.post(`/api/posts/${postId}/likes`, {
        action,
      });

      setLikes(response.data.likes);
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={!session || loading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200
        ${liked
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:shadow-md'
        }
        ${!session ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${loading ? 'animate-pulse' : ''}
      `}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-200 ${liked ? 'scale-110' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-sm font-semibold">
        {likes} {likes === 1 ? 'Like' : 'Likes'}
      </span>
    </button>
  );
};

export default Likebutton;
