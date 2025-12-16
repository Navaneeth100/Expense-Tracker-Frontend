import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../mainurl";

export default function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [incometypes, setIncometypes] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access");

    // Transaction form state
    const [form, setForm] = useState({
        transaction: "",
        income_type: "",
        category: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "",
        description: "",
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch transaction list + dropdown data

    const fetchData = async () => {
        try {
            const [expenseRes, categoryRes, incometypeRes, paymentRes] = await Promise.all([
                axios.get(`${url}/api/expense/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${url}/api/categories/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${url}/api/income-type/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${url}/api/payment-method/`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setTransactions(expenseRes.data?.results || expenseRes.data);
            setCategories(categoryRes.data?.results || categoryRes.data);
            setIncometypes(incometypeRes.data?.results || incometypeRes.data);
            setPaymentMethods(paymentRes.data?.results || paymentRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // CREATE or UPDATE

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            transaction_type: form.transaction,
            income_type: form.income_type,
            category: form.category,
            amount: parseFloat(form.amount),
            date: form.date,
            payment_method: form.payment_method,
            description: form.description,
        };

        try {
            if (editingId) {
                await axios.put(
                    `${url}/api/expense/${editingId}/`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${url}/api/expense/`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            resetForm();
            fetchData();

        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (exp) => {
        setEditingId(exp.id);
        setForm({
            transaction: exp.transaction_type,
            income_type: exp?.income_type_data?.id,
            category: exp?.category_data?.id,
            amount: exp.amount,
            date: exp.date,
            payment_method: exp?.payment_method_data?.id,
            description: exp.description,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this transaction?")) return;

        try {
            await axios.delete(`${url}/api/expense/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setForm({
            category: "",
            amount: "",
            date: "",
            payment_method: "",
            description: "",
        });
        setEditingId(null);
    };

    return (
        <div className="container px-4 py-8">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Transactions</h2>
            </div>

            {/* FORM */}

            <form
                onSubmit={handleSubmit}
                className="p-5 mb-6 bg-white rounded-xl shadow border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >

                {/* Transaction */}

                <select
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.transaction}
                    onChange={(e) => setForm({ ...form, transaction: e.target.value })}
                >
                    <option value="" disabled >Select Transaction</option>
                    <option value="Income" >Income</option>
                    <option value="Expense" >Expense</option>
                </select>

                {/* Income Type */}

                {form.transaction == "Income" && <>
                    <select
                        required
                        className="border border-gray-300 rounded-lg px-4 py-2"
                        value={form.income_type}
                        onChange={(e) => setForm({ ...form, income_type: e.target.value })}
                    >
                        <option value="" disabled >Select Income Type</option>
                        {incometypes.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </>}

                {/* Expense Category */}

                {form.transaction == "Expense" && <>
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
                </>}

                {/* Payment Method */}

                <select
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.payment_method}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                >
                    <option value="" disabled>Select Payment Method</option>
                    {paymentMethods.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                            {pm.name}
                        </option>
                    ))}
                </select>

                {/* Date */}

                <input
                    type="date"
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />

                {/* Amount */}

                <input
                    type="number"
                    required
                    placeholder="Amount"
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />

                {/* Description */}

                <textarea
                    placeholder="Description (optional)"
                    className="border border-gray-300 rounded-lg px-4 py-2"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                ></textarea>

                {/* Submit */}

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 col-span-1 sm:col-span-3"
                >
                    {editingId ? "Update Transaction" : "Add Transaction"}
                </button>
            </form>

            {/* LOADING */}

            {loading && (
                <div className="flex justify-center py-16">
                    <div className="h-8 w-8 animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full" />
                </div>
            )}

            {/* TRANSACTION LIST */}

            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {transactions.map((exp) => (
                        <div
                            key={exp.id}
                            className="p-3 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition text-xs"
                        >
                            <div className="flex justify-between items-center">

                                <h3 className="text-sm font-semibold">{exp.category_data?.name || exp.income_type_data?.name}</h3>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(exp)}
                                        className="px-2 py-0.5 text-sm bg-green-500 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className="px-2 py-0.5 text-sm bg-red-600 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 mt-2">
                                <span className="font-bold text-lg">₹{exp.amount}</span><br/>
                                <span className="font-semibold text-sm">{exp.payment_method_data?.name} • {new Date(exp.date).toLocaleDateString("en-GB", {  day: "2-digit",  month: "short",   year: "numeric" }).replace(",", "")}</span><br/>
                                <span className="text-xs">{exp.description || ""}</span>
                            </p>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
