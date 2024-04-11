import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {id:'0', name: "Naresh"},
    {id:'1', name: "Chaitrali"},
    {id:'2', name: "Mahesh"}
]

const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{}
})

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;