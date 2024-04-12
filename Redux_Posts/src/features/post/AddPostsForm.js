import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "./postSlice";
import { selectAllUsers } from "../users/usersSlice";
import {useNavigate} from 'react-router-dom'
const AddPostForm = () => {
    const dispatch = useDispatch()
     const navigate = useNavigate();
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [createRequestStatus, setCreateRequestStatus] = useState("idle");
    const users = useSelector(selectAllUsers);

    const isFormValid = [title, content, userId].every(Boolean) && createRequestStatus === "idle";
     

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    const onSavePostClicked = () => {
        if (isFormValid) {
            try {
                setCreateRequestStatus("pending");
                dispatch(createPost({ title, body: content, userId })).unwrap();

                setTitle("");
                setContent("");
                setUserId("");
                navigate('/')
            } catch (err) {
                console.error("failed to create the post", err);
            } finally {
                setCreateRequestStatus("idle");
            }
        }
    }
    const canSave = Boolean(title) && Boolean(content) && Boolean(userId)
    const usersOptions = users.map(user=>(
        <option key={user.id} value={user.id}>{user.name}</option>
    ))
   


    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    )
}
export default AddPostForm