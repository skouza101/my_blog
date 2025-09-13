"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import Createpost from "./Createpost";

function Navbar() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoading = status === "loading";
  const isLogin = !!session;

  return (
    <nav className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-white/20 dark:border-gray-800/50 sticky top-0 z-40">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="self-center text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            My Blog
          </span>
        </Link>

        {!isLoading ? 
        isLogin ? (
          <div className="flex gap-x-3 md:order-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 overflow-hidden"
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative flex items-center gap-x-2">
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create Post</span>
              </div>
            </button>

            {isModalOpen && (
              <Createpost setIsModalOpen={setIsModalOpen} />
              
            )}

            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar hover:scale-110 transition-transform duration-200"
                >
                  <div className="ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={
                        session?.user?.image ||
                        "https://imgs.search.brave.com/CFBTYPNRel95sDw00APELv5D4Ghs73sYYcN0-tLpV5U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vZ0pseTAv/TUFHRGtNZ0pseTAv/MS90bC9jYW52YS11/c2VyLXByb2ZpbGUt/aWNvbi12ZWN0b3Iu/LWF2YXRhci1vci1w/ZXJzb24taWNvbi4t/cHJvZmlsZS1waWN0/dXJlLC1wb3J0cmFp/dC1zeW1ib2wuLU1B/R0RrTWdKbHkwLnBu/Zw"

                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl w-56 border border-white/20 dark:border-gray-700/50"
                >
                  <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col space-y-1 items-center">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {session?.user?.name || "User"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {session?.user?.email || "user@example.com"}
                      </div>
                    </div>
                  </div>
                  <li className="hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl mx-1 my-1">
                    <a
                      href={`/profile/${session?.user?.id}`}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile
                    </a>
                  </li>
                  <li className="hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl mx-1 my-1">
                    <a
                      onClick={() => signOut()}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 cursor-pointer"
                    >
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            Login
          </button>
        ): <button
        className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 transform hover:scale-105"
      >
        Loading
      </button>}
      </div>
    </nav>
  );
}

export default Navbar;
