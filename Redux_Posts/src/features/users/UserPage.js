import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from "../post/postSlice";
import { Link, useParams } from "react-router-dom";

const UserPage = () => {
    const { userId } = useParams();
    const user = useSelector(state => selectUserById(state, Number(userId)));
    const postsOfUser = useSelector(state => selectPostsByUser(state, Number(userId)));

    return (
        <section>
            <h2>{user?.name}</h2>
            <ol>
                {postsOfUser.map(post => (
                    <li key={post.id}>
                        <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default UserPage;