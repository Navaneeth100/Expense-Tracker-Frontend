import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../mainurl";

export default function CategoryBudget() {
    const token = localStorage.getItem("access");

    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        category: "",
        monthly_limit: "",
    });

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
    }, []);

    // FETCH 

    const fetchBudgets = async () => {
        try {
            const res = await axios.get(`${url}/api/category-budget/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBudgets(res.data?.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    // SUBMIT

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            category: form.category,
            monthly_limit: Number(form.monthly_limit),
        };

        try {
            if (editingId) {
                await axios.put(
                    `${url}/api/category-budget/${editingId}/`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${url}/api/category-budget/`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            resetForm();
            fetchBudgets();
        } catch (err) {
            console.error(err);
        }
    };

    // EDIT

    const handleEdit = (b) => {
        setEditingId(b.id);
        setForm({
            category: b.category?.id,
            monthly_limit: b.budget,
        });
    };

    // DELETE

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this budget?")) return;

        try {
            await axios.delete(`${url}/api/category-budget/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBudgets();
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setForm({
            category: "",
            monthly_limit: "",
        });
        setEditingId(null);
    };


    return (
        <div className="container px-4 py-8">

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Category Budget
            </h2>

            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-xl p-5 mb-6 shadow flex flex-col sm:flex-row gap-4"
            >
                {/* Category */}

                <select
                    required
                    className="border rounded-lg px-4 py-2 flex-1"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: parseInt(e.target.value) })}
                >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                {/* Monthly Limit */}

                <input
                    type="number"
                    min="0"
                    required
                    placeholder="Monthly Limit"
                    className="border rounded-lg px-4 py-2 flex-1"
                    value={form.monthly_limit}
                    onChange={(e) =>
                        setForm({ ...form, monthly_limit: e.target.value })
                    }
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    {editingId ? "Update" : "Add"}
                </button>
            </form>

            {/* LIST */}

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : budgets.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {budgets.map((b) => (
                        <div className="bg-white border rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-center">

                                <h3 className="font-semibold text-gray-900">{b.category?.name}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(b)}
                                        className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(b.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 text-sm text-gray-700">
                                <div>Budget: <span className="font-semibold">₹{b.budget}</span></div>
                                <div>Spent: <span className="font-semibold text-red-600">₹{b.spent}</span></div>
                                <div>Remaining: <span className="font-semibold text-green-600">₹{b.remaining}</span></div>
                            </div>

                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>{b.percent_used}% used</span>
                                    <span>{b.percent_remains}% left</span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${b.over_budget ? "bg-red-600" : "bg-green-600"}`}
                                        style={{ width: `${Math.min(Number(b.percent_used), 100)}%` }}
                                    />
                                </div>

                                <div className="mt-3 flex justify-end">
                                    <span className={`text-xs font-semibold ${b.over_budget ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"} px-2 py-0.5 rounded`}>
                                        {b.over_budget ? "Over Budget" : "Within Budget"}
                                    </span>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center py-20">
                    No category budgets found
                </p>
            )}
        </div>
    );
}
