import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Player } from '../../types-app'

type ScoreState = {
    defeatedPlayers: Player[]
}

const initialState: ScoreState = {
    defeatedPlayers: []
}

export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    addDefeatedPlayer: (state, action: PayloadAction<{ player: Player}>) => {
      state.defeatedPlayers = [...state.defeatedPlayers, action.payload.player];
    },
  },
})

export const { addDefeatedPlayer } = appStateSlice.actions

export default appStateSlice.reducer