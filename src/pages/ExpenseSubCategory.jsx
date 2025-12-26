import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../mainurl";

export default function ExpenseSubCategory() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setsubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access");

    const [form, setForm] = useState({ category: "", name: "", icon: "" });
    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${url}/api/categories/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(res.data?.results || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const res = await axios.get(`${url}/api/sub-categories/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setsubCategories(res.data?.results || res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSubCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // UPDATE
                await axios.put(
                    `${url}/api/sub-categories/${editingId}/`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // CREATE
                await axios.post(
                    `${url}/api/sub-categories/`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            setForm({ category: "",name: "", icon: "" });
            setEditingId(null);
            fetchSubCategories();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error);
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ category: cat.category_data?.id, name: cat.name, icon: cat.icon });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await axios.delete(`${url}/api/sub-categories/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchSubCategories();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="container px-4 py-8">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Expense Sub Category</h2>

                {/* <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search category"
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm w-full sm:w-64"
                /> */}
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="p-5 mb-6 bg-white rounded-xl shadow border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >

                <select
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                    <option value="" disabled >Select Expense Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    required
                    placeholder="Sub Category Name"
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="text"
                    required
                    placeholder="Icon (fa-home, fa-user)"
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 col-span-1 sm:col-span-3"
                >
                    {editingId ? "Update" : "Add"}
                </button>
            </form>

            {/* LOADING */}

            {loading && (
                <div className="flex justify-center py-16">
                    <div className="h-8 w-8 animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full" />
                </div>
            )}

            {/* CATEGORY LIST */}

            {!loading && (
                <>
                    {subcategories?.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {subcategories
                                .filter((c) =>
                                    c.name.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="p-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition"
                                    >
                                        <div className="flex items-center justify-between">

                                            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-lg">
                                                {cat.icon ? (<i className={`fa-solid fa-${cat.icon.toLowerCase()} text-xl`}></i>) : ("?")}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg mt-3 font-semibold text-gray-900">{cat.name}</h3>
                                        <p className="mt-1 text-sm text-gray-600">{cat.category_data?.name}</p>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center min-h-[40vh]">
                            <p className="text-gray-600 text-lg">No Sub Categories found</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
