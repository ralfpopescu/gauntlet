import { createSlice } from '@reduxjs/toolkit'

type AppStates = 'intro' | 'crafting' | 'game'

type AppState = {
    appState: AppStates,
}

const initialState: AppState = {
    appState: 'crafting'
}

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    showIntro: (state) => {
      state.appState = 'intro';
    },
    startCrafting: (state) => {
      state.appState = 'crafting';
    },
    startGame: (state) => {
      state.appState = 'game';
    },
  },
})

export const { showIntro, startCrafting, startGame } = appStateSlice.actions

export default appStateSlice.reducer