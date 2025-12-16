import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { url } from "../../mainurl";

export default function PostDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${url}/posts/${id}`)
            .then((res) => setPost(res.data))
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-12 text-center text-gray-600">
                <h2 className="text-xl font-semibold mb-4">Post not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 rounded-lg border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <article className="container mx-auto px-4 py-10">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center rounded-lg border border-indigo-500 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
            >
                ← Back
            </button>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md">

            {post.image ? (
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-contain rounded-xl mb-6"
                />
            ) : (
                <img
                    src=""
                    alt=""
                    className="w-full h-64 object-cover rounded-xl mb-6"
                />
            )}
            
                <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                <p className="mt-2 text-sm text-gray-500">
                    {post.author?.name ? `${post.author.name} • ` : ""}
                    {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                </p>

                <div className="prose prose-indigo mt-6 max-w-none">
                    <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>
                </div>
            </div>
        </article>
    );
}
