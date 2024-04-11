import { useSelector } from "react-redux";
import { selectAllPosts } from "./postSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import React from 'react'
import ReactionButtons from "./ReactionButtons";

const PostsLists = () => {
    console.log(selectAllPosts)
 const posts = useSelector(selectAllPosts);
 const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
 console.log(posts)
 const renderedPosts = orderedPosts.map(post =>(
    <article key={post.id}>
        <h3>{post.title}</h3>
        <p>{post.content.substring(0,100)}</p>
        <p className="postCredit">
            <PostAuthor userId={post.userId}/>
            <TimeAgo timestamp={post.date}/>
            </p>
            <ReactionButtons post={post}/>
    </article>
 ))
  return (
      <section>
        <h2>Posts</h2>
        {renderedPosts}
      </section>
  )
}

export default PostsLists