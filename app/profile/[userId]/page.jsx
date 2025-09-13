"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Postcard from "../../../components/Postcard";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [userPosts, setUserPosts] = useState([]);
  const params = useParams();
  const userId = params.userId;
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        if (response.status === 200) {
          const userData = response.data;
          setUser({
            id: userId,
            name:  session.user.name  || "Anonymous",
            email:session.user.email || "",
            bio: session.user.bio || "Passionate blogger sharing thoughts and ideas.",
            avatar: session.user.image || null,
            joinedDate: userData.createdAt,
            location: userData.location || "San Francisco, CA",
            website: userData.website || "https://example.com",
            verified: userData.verified || Math.random() > 0.5
          });
          setStats({
            posts: userData.postsCount || Math.floor(Math.random() * 50) + 10,
            followers: userData.followersCount || Math.floor(Math.random() * 500) + 50,
            following: userData.followingCount || Math.floor(Math.random() * 200) + 20
          });
          const postsResponse = await axios.get(`/api/users/${userId}`);
          setUserPosts(postsResponse.data.posts || []);
        } else {
          console.error("API Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Network or API error:", error);
        if (session?.user && session.user.id === userId) {
          setUser({
            id: userId,
            name: session.user.name || `User ${userId}`,
            email: session.user.email || `user${userId}@example.com`,
            bio: session.user.bio || "Passionate blogger sharing thoughts and ideas.",
            avatar: session.user.image || null,
            joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
            location: "San Francisco, CA",
            website: "https://example.com",
            verified: Math.random() > 0.5
          });
          setUserPosts([]);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId && status !== "loading") {
      fetchUserData();
    }
  }, [userId, session, status]);

  if (loading) {
    return (
      <div className="min-h-screen flex gap-y-8 py-12 flex-col items-center justify-center">
        <div className="w-full max-w-3xl mx-auto px-4  rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300  overflow-hidden">
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
        
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-900 flex items-center justify-center">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The user you're looking for doesn't exist.</p>
          <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl ">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full p-1">
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-700 dark:text-gray-300">
                      {user?.name}
                    </span>
                  )}
                </div>
              </div>
              
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{user.email}</p>
                </div>
                
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 max-w-2xl">
                {user.bio}
              </p>

              <div className="flex justify-center md:justify-start space-x-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.posts}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.followers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.following}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
                {user.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a href={user.website} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {user.website.replace('https://', '')}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            {session?.user?.id === userId ? "My Posts" : `Posts by ${user.name}`}
          </h2>
          {userPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              No posts yet.
            </div>
          ) : (
            <div className="space-y-8">
              {userPosts.map((post) => (
                <Postcard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;