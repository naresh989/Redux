import { createSlice,createAsyncThunk ,createSelector,createEntityAdapter} from "@reduxjs/toolkit";
import axios from "axios"
import {sub} from 'date-fns';
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts"

const postsAdapter=createEntityAdapter({
    sortComparer:(a, b) => b.date.localeCompare(a.date)
})
const initialState = postsAdapter.getInitialState({
    status:'idle',
    error:null,
    count:0
})

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    try {
        const response = await axios.get(POSTS_URL);
        
        return [...response.data];
    } catch (err) {
        return err.message;
    }
}); 

export const createPost = createAsyncThunk("posts/createPost", async (post) => {
    try {
        const response = await axios.post(POSTS_URL, post);

        return response.data;
    } catch (err) {
        return err.message;
    }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (post) => {
    const { id } = post;

    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, post);

        return response.data;
    } catch (err) {
        // return err.message;
        return post; // only for this project, not recommended
    }
});
export const deletePost = createAsyncThunk("posts/deletePost", async (post) => {
    const { id } = post;

    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`);
        if (response?.status === 200) return post;
        return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
        return err.message;
    }
});


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state,action){
            state.count+=1
        }
        
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading";
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded";

                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    };

                    return post;
                });

                postsAdapter.upsertMany(state,loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
            builder
            .addCase(createPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                };

                postsAdapter.addOne(state,action.payload)
            });
            builder.addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("update could not complete");
                    console.log(action.payload);
    
                    return;
                }
    
                action.payload.date = new Date().toISOString();
                postsAdapter.upsertOne(state,action.payload)
            });
            builder.addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("delete could not complete");
                    console.log(action.payload);
    
                    return;
                }
    
                const { id } = action.payload;
                postsAdapter.removeOne(state,id)
            });
    
        }
    
})

export const {
    selectAll:selectAllPosts,
    selectById:selectPostById,
    selectIds:selectPostIds
} = postsAdapter.getSelectors(state=>state.posts)

export const getPostsStatus = (state) => state.posts.status;

export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
);
export const { increaseCount, reactionAdded } = postsSlice.actions

export default postsSlice.reducer