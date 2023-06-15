import { createAction, createReducer, current, nanoid } from "@reduxjs/toolkit";
import { initalPostList } from "constants/blog";
import { Post } from "types/blog.type";

interface BlogState {
  postList: Post[],
  editingPost: Post | null
}

const initalState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

export const addPost = createAction('blog/addPost', (post: Omit<Post, "id">) => ({
 payload: {
  ...post, id: nanoid()
 } 
}))
export const deletePost = createAction<string>('blog/deletePost')
export const startEditingPost = createAction<string>('/blog/startEditingPost')
export const cancelEditingPost = createAction('/blog/cancelEditingPost')
export const finishEditingPost = createAction<Post>('/blog/finishEditingPost')


const blogReducer = createReducer(initalState, builder => {
  builder.addCase(addPost, (state, action) => {
    const post = action.payload
    state.postList.push(post)
  }).addCase(deletePost, (state, action) => {
    const postId = action.payload
    const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
    if(foundPostIndex !== -1) state.postList.splice(foundPostIndex, 1)
  }).addCase(startEditingPost, (state, action) => {
    const postId = action.payload;
    const foundPost = state.postList.find(post => post.id === postId) || null
    state.editingPost = foundPost
  }).addCase(cancelEditingPost, (state) => {
    state.editingPost = null
  }).addCase(finishEditingPost, (state, action) => {
    const postId = action.payload.id
    state.postList.some((post, index) => {
      if(post.id === postId) {
        state.postList[index] = action.payload;
        return true;
      }
      return false
    })
  }).addMatcher((action) => action.type.includes("cancel") , (state, action) => {
    console.log("cancel", current(state));
    
  })
})

export default blogReducer