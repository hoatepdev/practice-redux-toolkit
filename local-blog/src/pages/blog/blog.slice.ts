// import { addPost, cancelEditingPost, deletePost, finishEditingPost, startEditingPost } from 'pages/blog/blog.reducer';
import { createAction, createReducer, current, nanoid, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

// export const addPost = createAction('blog/addPost', (post: Omit<Post, "id">) => ({
//  payload: {
//   ...post, id: nanoid()
//  } 
// }))
// export const deletePost = createAction<string>('blog/deletePost')
// export const startEditingPost = createAction<string>('/blog/startEditingPost')
// export const cancelEditingPost = createAction('/blog/cancelEditingPost')
// export const finishEditingPost = createAction<Post>('/blog/finishEditingPost')


const blogSlice = createSlice({
  name: 'blog',
  initialState: initalState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        const post = action.payload
        state.postList.push(post)
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post, id: nanoid()
         } 
      })
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
      if(foundPostIndex !== -1) state.postList.splice(foundPostIndex, 1)
    },
    startEditingPost: (state, action) => {
      const postId = action.payload;
      const foundPost = state.postList.find(post => post.id === postId) || null
      state.editingPost = foundPost
    }, 
    cancelEditingPost: (state) => {
      state.editingPost = null
    },
    finishEditingPost: (state, action) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if(post.id === postId) {
          state.postList[index] = action.payload;
          return true;
        }
        return false
      })}
  },
  extraReducers(builder) {
    builder.addMatcher((action) => action.type.includes("cancel") , (state, action) => {console.log(current(state));
    }).addDefaultCase((state, action) => {
      console.log(`action type: ${current(state)}`);
      
    })
  }
})

// const blogReducer = createReducer(initalState, builder => {
//   builder.addCase(addPost, (state, action) => {
//     const post = action.payload
//     state.postList.push(post)
//   }).addCase(deletePost, (state, action) => {
//     const postId = action.payload
//     const foundPostIndex = state.postList.findIndex((post) => post.id === postId)
//     if(foundPostIndex !== -1) state.postList.splice(foundPostIndex, 1)
//   }).addCase(startEditingPost, (state, action) => {
//     const postId = action.payload;
//     const foundPost = state.postList.find(post => post.id === postId) || null
//     state.editingPost = foundPost
//   }).addCase(cancelEditingPost, (state) => {
//     state.editingPost = null
//   }).addCase(finishEditingPost, (state, action) => {
//     const postId = action.payload.id
//     state.postList.some((post, index) => {
//       if(post.id === postId) {
//         state.postList[index] = action.payload;
//         return true;
//       }
//       return false
//     })
//   }).addMatcher((action) => action.type.includes("cancel") , (state, action) => {
//     console.log("cancel", current(state));
    
//   })
// })
const blogReducer = blogSlice.reducer;

export const {addPost, cancelEditingPost, deletePost, finishEditingPost,startEditingPost} = blogSlice.actions
export default blogReducer