import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../mainurl";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchtext, setsearchtext] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${url}/posts/?page=${currentPage}&search=${searchtext}`)
      .then((res) => {
        setPosts(res.data?.results || []);
        setTotalPages(res.data?.pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [currentPage, searchtext]);

  const handleFirst = () => setcurrentPage(1);
  const handlePrev = () => setcurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setcurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLast = () => setcurrentPage(totalPages);

  return (
    <div className="bg-gray-50 py-10 sm:py-14 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header and Search */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {user ? `Welcome ${user.name}` : "Latest Posts"}
            </h2>
            {user ? (
              <p className="mt-3 text-lg text-gray-600">
                Explore your posts, stay updated with the latest content, and share your thoughts with the community.
              </p>
            ) : (
              <p className="mt-3 text-lg text-gray-600">
                Join our community today—sign up or log in to stay ahead with our latest content.
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0">
            <input
              type="text"
              value={searchtext}
              onChange={(e) => setsearchtext(e.target.value)}
              placeholder="Search by Title"
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Posts */}

        <div
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 
          sm:mt-0 sm:pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3 min-h-[50vh]"
        >
          {loading ? (
            <p className="col-span-full text-center text-gray-500 text-lg font-medium">
              Loading posts...
            </p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post._id}
                className="flex flex-col justify-between shadow-md hover:shadow-md transition-shadow duration-300 p-6 rounded-xl bg-white border border-gray-100"
              >

                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <img
                    src=""
                    alt=""
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <div className="flex items-center gap-x-4 text-xs text-gray-500">
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <div className="group relative grow mt-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {post.content}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <p className="font-semibold text-gray-900">
                    {post.author?.name || ""}{" "}
                    <span className="text-gray-500">
                      | {post.author?.email || ""}
                    </span>
                  </p>
                  <button
                    onClick={() => navigate(`/posts/${post._id}`)}
                    className="rounded-lg border border-transparent bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-200 transition"
                  >
                    View
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center w-full min-h-[50vh]">
              <p className="text-gray-500 text-lg font-medium">
                No posts found
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}

        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={handleFirst}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
          >
            First
          </button>
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
          >
            Next
          </button>
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
