import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { rollRandomEthos } from '../../utils/helpers'
import { MetaEthos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Recipe, Gear } from '../../types-app'

type CraftingIngredientsState = {
    hand: MetaEthosType[],
    choices: Array<MetaEthos | null>,
    chosen:Array<MetaEthos | null>,
    metaEthosInventory: Array<MetaEthos | null>,
    craftingTable: Array<MetaEthos | null>,
    confirmed: boolean,
    playerGear: Gear[],
}

//nulls represent empty slots
const initialState = {
    hand: rollRandomEthos(7),
    choices: rollRandomEthos(5),
    chosen: [null, null, null],
    metaEthosInventory: [],
    craftingTable: [null, null, null, null, null],
    confirmed: false,
    playerGear: [],
} as CraftingIngredientsState;

type RemoveFromMetaEthosArrayAndAddToAnotherOutput = {
  removedFrom:Array<MetaEthos | null>,
  addedTo: Array<MetaEthos | null>,
}

const removeFromMetaEthosArrayAndAddToAnother = (
  removeFrom: Array<MetaEthos | null>, 
  addTo: Array<MetaEthos | null>, 
  index: number): RemoveFromMetaEthosArrayAndAddToAnotherOutput => {
  const removedFrom = [...removeFrom];
  const metaEthos = removeFrom[index];
  if(metaEthos) {
    //will only replace if there is a null to fill, representing empty slots
    const nullIndex = addTo.findIndex(a => !a);
    const addedTo = [...addTo];
    if(nullIndex >= 0) {
      addedTo[nullIndex] = metaEthos;
      removedFrom[index] = null;
    }
  
    return { removedFrom, addedTo }
  }
  return { removedFrom: removeFrom, addedTo: addTo }
}

type CraftInput = { recipe: Recipe, upgrade: boolean }

export const craftingSlice = createSlice({
  name: 'crafting',
  initialState,
  reducers: {
    choose: (state, action: PayloadAction<number>) => {
      const metaEthosIndex = action.payload;
      const { removedFrom, addedTo } = 
      removeFromMetaEthosArrayAndAddToAnother(state.choices, state.chosen, metaEthosIndex)
      state.choices = [...removedFrom];
      state.chosen = [...addedTo];
    },
    removeChoice: (state, action: PayloadAction<number>) => {
      const metaEthosIndex = action.payload;
      const { removedFrom, addedTo } = 
        removeFromMetaEthosArrayAndAddToAnother(state.chosen, state.choices, metaEthosIndex)
      state.chosen = [...removedFrom];
      state.choices = [...addedTo];
    },
    confirm: (state) => {
      state.metaEthosInventory = [...state.chosen, ...state.hand]
      state.confirmed = true;
    },
    putOnCraftingTable: (state, action: PayloadAction<number>) => {
      const metaEthosIndex = action.payload;
      const { removedFrom, addedTo } = 
        removeFromMetaEthosArrayAndAddToAnother(state.metaEthosInventory, state.craftingTable, metaEthosIndex)
      state.metaEthosInventory = [...removedFrom];
      state.craftingTable = [...addedTo];
    },
    removeFromCraftingTable: (state, action: PayloadAction<number>) => {
      const metaEthosIndex = action.payload;
      const { removedFrom, addedTo } = 
        removeFromMetaEthosArrayAndAddToAnother(state.craftingTable, state.metaEthosInventory, metaEthosIndex)
      state.craftingTable = [...removedFrom];
      state.metaEthosInventory = [...addedTo];
    },
    craft: (state, action: PayloadAction<CraftInput>) => {
      const { recipe, upgrade } = action.payload
      
      const requiredMetaEthos = upgrade ? 
      [...recipe.upgrade.requiredMetaEthos, ...recipe.requiredMetaEthos] : 
      recipe.requiredMetaEthos;

      const gear = upgrade ? recipe.upgrade.upgradedItem : recipe.item;
      const { craftingTable } = state;

      const inputIngredientIndexes: number[] = [];
      requiredMetaEthos.forEach(metaEthos => {
        const metaEthosIndexesToAdd = craftingTable.findIndex(me => me?.name.toLowerCase() === metaEthos?.toLowerCase());
        if(metaEthosIndexesToAdd >= 0) {
          inputIngredientIndexes.push(metaEthosIndexesToAdd);
        }
      })
      //make sure we found all the necessary ingredients
      if(inputIngredientIndexes.length === requiredMetaEthos.length) {
        const newCraftingTable = [...state.craftingTable]
        inputIngredientIndexes.forEach(i => {
          //remove from crafting table
          newCraftingTable[i] = null;
        })
        state.craftingTable = [...newCraftingTable]
        state.playerGear = [...state.playerGear, gear]
      }
    },
  },
})

export const { choose, removeChoice, confirm, putOnCraftingTable, removeFromCraftingTable, craft } = craftingSlice.actions

export default craftingSlice.reducer