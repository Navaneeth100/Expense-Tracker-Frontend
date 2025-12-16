import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { url } from "../../mainurl";

const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  const [searchtext, setsearchtext] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/users/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data?.results || res.data);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container px-4 py-8">
      {/* TOP BAR */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Users List</h2>

        {/* <input
          type="text"
          value={searchtext}
          onChange={(e) => setsearchtext(e.target.value)}
          placeholder="Search user by name"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full sm:w-64"
        /> */}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full" />
        </div>
      )}

      {!loading && (
        <>
          {users?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[10vh]">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white text-lg font-bold">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{u.username}</h3>
                  <p className="mt-1 text-sm text-gray-600">{u.email}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-gray-600 text-lg">No users found</div>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default Users;
