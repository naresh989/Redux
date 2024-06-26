import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPostById, updatePost, deletePost } from "./postSlice";
import { selectAllUsers } from "../users/usersSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdatePostMutation, useDeletePostMutation } from "./postSlice";
const EditPostForm = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [updatePost, { isLoading }] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()

    const post = useSelector(state => selectPostById(state, Number(postId)));
    const users = useSelector(selectAllUsers);

    const [title, setTitle] = useState(post?.title);
    const [content, setContent] = useState(post?.body);
    const [userId, setUserId] = useState(post?.userId);


    const isFormValid = [title, content, userId].every(Boolean) && !isLoading;

    const onChangeTitle = e => setTitle(e.target.value);
    const onChangeContent = e => setContent(e.target.value);
    const onChangeAuthor = e => setUserId(e.target.value);
    const onClickUpdateButton = async () => {
        if (isFormValid) {
            try {
                await updatePost({ id: post?.id, title, body: content, userId }).unwrap()

                setTitle("");
                setContent("");
                setUserId("");
                navigate(`/post/${postId}`);
            } catch (err) {
                console.error("failed to create the post", err);
            } 
        }
    };
    const onClickDeleteButton = async () => {
        try {
            await deletePost({ id: post?.id }).unwrap()

            setTitle("");
            setContent("");
            setUserId("");
            navigate("/");
        } catch (err) {
            console.error("failed to delete the post", err);
        }
    };

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        );
    } else {
        return (
            <section>
                <h2>Edit Post</h2>
                <form>
                    <label htmlFor="postTitle">Post Title:</label>
                    <input
                        type="text"
                        id="postTitle"
                        name="postTitle"
                        value={title}
                        onChange={onChangeTitle}
                    />
                    <label htmlFor="postAuthor">Author:</label>
                    <select
                        id="postAuthor"
                        defaultValue={userId}
                        onChange={onChangeAuthor}
                    >
                        <option value="">---Select---</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="postContent">Post Content:</label>
                    <textarea
                        id="postContent"
                        name="postContent"
                        value={content}
                        onChange={onChangeContent}
                    />
                    <button
                        type="button"
                        onClick={onClickUpdateButton}
                        disabled={!isFormValid}
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={onClickDeleteButton}
                    >
                        Delete
                    </button>
                </form>
            </section>
        );
    }
};

export default EditPostForm;