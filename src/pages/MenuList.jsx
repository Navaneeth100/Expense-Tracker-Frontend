import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../mainurl";

export default function MenuList() {
    const [menuList, setMenuList] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access");

    const [form, setForm] = useState({
        menu_name: "",
        icon: "",
        path: "",
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMenuList();
    }, []);

    // FETCH
    const fetchMenuList = async () => {
        try {
            const res = await axios.get(`${url}/menu-list/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMenuList(res.data?.results || res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // UPDATE
                await axios.put(
                    `${url}/menu-list/${editingId}/`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // CREATE
                await axios.post(
                    `${url}/menu-list/`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            resetForm();
            fetchMenuList();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            menu_name: item.menu_name,
            icon: item.icon,
            path: item.path,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this menu item?")) return;

        try {
            await axios.delete(`${url}/menu-list/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchMenuList();
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setForm({
            menu_name: "",
            icon: "",
            path: "",
        });
        setEditingId(null);
    };

    return (
        <div className="container px-4 py-8">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Menu List</h2>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="p-5 mb-6 bg-white rounded-xl shadow border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                <input
                    type="text"
                    required
                    placeholder="Menu Name"
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.menu_name}
                    onChange={(e) => setForm({ ...form, menu_name: e.target.value })}
                />

                <input
                    type="text"
                    required
                    placeholder="Icon (fa-home, fa-user)"
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />

                <input
                    type="text"
                    required
                    placeholder="Path (/dashboard, /users)"
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.path}
                    onChange={(e) => setForm({ ...form, path: e.target.value })}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 col-span-1 sm:col-span-3"
                >
                    {editingId ? "Update Menu" : "Add Menu"}
                </button>
            </form>

            {/* LOADING */}
            {loading && (
                <div className="flex justify-center py-16">
                    <div className="h-8 w-8 animate-spin border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                </div>
            )}

            {/* MENU LIST */}
            {!loading && (
                <>
                    {menuList?.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {menuList.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition"
                                >
                                    <div className="flex items-center justify-between">
                                        <i className={`fa-solid ${item.icon} text-2xl text-blue-600`}></i>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg mt-3 font-semibold">{item.menu_name}</h3>
                                    <p className="text-gray-600">Path: {item.path}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[40vh]">
                            <p className="text-gray-600 text-lg">No menu items found</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
