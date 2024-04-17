import { useSelector } from "react-redux";
import { selectPostIds , getPostsStatus,getPostsError } from "./postSlice";
import React from 'react'
import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from "./postSlice";

const PostsLists = () => {
  
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error
} = useGetPostsQuery('getPosts')

let content;
if (isLoading) {
    content = <p>"Loading..."</p>;
} else if (isSuccess) {
    content = posts.ids.map(postId => <PostsExcerpt key={postId} postId={postId} />)
} else if (isError) {
    content = <p>{error}</p>;
}

  return (
      <section>
        {content}
      </section>
  )
}

export default PostsLists