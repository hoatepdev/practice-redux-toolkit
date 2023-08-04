import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'types/blog.type'
import { CustomerError } from '../../utils/helpers'

// Define a service using a base URL and expected endpoints

export const blogApi = createApi({
  reducerPath: 'blogApi', // Tên field trong redux state
  tagTypes: ['Posts'], // Những kiểu tag cho phép dùng trong blogApi
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (builder) => ({
    // generic type theo thứ tự là kiểu response trả về và argument
    getPosts: builder.query<Post[], void>({
      query: () => 'posts', // method ko có argument
      providesTags(result) {
        /**
         * Cái callback này sẽ chạy mỗi khi getPosts chạy
         * Mong muốn là sẽ return về một mảng kiểu
         * ```ts
         * interface Tags: {
         *    type: "Posts";
         *    id: string;
         *  }[]
         *```
         * vì thế phải thêm as const vào để báo hiệu type là Read only, không thể mutate
         */
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        // const final = [{ type: 'Posts' as const, id: 'LIST' }]
        // return final
        return [{ type: 'Posts', id: 'LIST' }]
      }
    }),

    /*
     * Chung ta dung mutate doi voi cac truong hop POST, PUT, DELETE
     * Post la response tra ve va Omit<Post, 'id'> la body gui len
     * */
    addPosts: builder.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        try {
          // let a: any = null
          // a.b = 1
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomerError(error.message)
        }
      },
      /*invalidatesTags cung cap cac tag de bao hieu cho nhung method nao co porvidesTas match voi no se bi goi lai
       * trong truong hop nay getPosts se chay lai*/
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Posts', id: 'LIST' }])
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `posts/${id}`
    }),
    updatePost: builder.mutation<Post, { id: string; body: Post }>({
      query(data) {
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      // trong truong hop nay thi getPosts se chay lai
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Posts', id: data.id }])
    }),
    deletePost: builder.mutation<{}, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => (error ? [] : [{ type: 'Posts', id }])
    })
  })
})
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsQuery, useAddPostsMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
