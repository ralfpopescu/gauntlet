import { configureStore } from '@reduxjs/toolkit'
import crafting from './slices/crafting'
import game from './slices/game'
import app from './slices/app'

const store = configureStore({
  reducer: {
    crafting,
    game,
    app,
  },
})

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
