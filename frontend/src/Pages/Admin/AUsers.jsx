import React, { useEffect, useState } from "react";
import API from "../../api/axios"; // ✅ use your configured Axios instance

const AUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await API.get("/users", config);
        console.log("Users API response:", res.data); // 👈 log actual structure

        // ✅ Handle different response formats safely
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else if (Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else {
          console.warn("⚠️ Unexpected API response format:", res.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        Users
      </h1>

      {/* ✅ Responsive wrapper for table */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
        <table className="w-full border border-gray-200 text-sm min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.name || user.username}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.isAdmin ? "Admin" : "User"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Optional mobile hint */}
      <div className="mt-6 text-center text-gray-500 text-xs md:hidden">
        Swipe → to view full table
      </div>
    </div>
  );
};

export default AUsers;
