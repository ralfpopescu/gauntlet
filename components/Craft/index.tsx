import { useState } from 'react'
import styled from "styled-components";
import { ethos, MetaEthos as MetaEthosType } from '../../utils/ethos'
import { Gear } from '../../types-app'
import { CraftingTable } from '../CraftingTable'
import { CraftingBook } from '../CraftingBook'

const Container = styled.div`
display: grid;
`

const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const rollRandomEthos = (number: number) => new Array(number).fill(null).map(() => randomNumber(0, ethos.length)).map(i => ethos[i])

export const Craft = () => {
    const [confirmed, setConfirmed] = useState<boolean>(false)
    const [chosen, setChosen] = useState<MetaEthosType[]>([])
    const [hand] = useState<MetaEthosType[]>(rollRandomEthos(7))
    const [choices] = useState<MetaEthosType[]>(rollRandomEthos(5))
    const [confirmedIngredients, setConfirmedIngredients] = useState<MetaEthosType[]>([])
    const [craftedGear, setCraftedGear] = useState<Gear[]>([])
    

    const [craftingTableIngredients, setCraftingTableIngredients] = useState<MetaEthosType[]>([])

    const onMetaEthosClick = (metaEthos: MetaEthosType) => {
        setChosen(c => [...c, metaEthos])
    }

    return (
        <Container>
            <CraftingTable 
                hand={hand} 
                choices={choices} 
                onMetaEthosClick={onMetaEthosClick}
                chosen={chosen} 
                onConfirm={() => {
                    if(hand.length + chosen.length === 10) setConfirmed(true)
                    setConfirmedIngredients([...hand, ...chosen])
                }}
                confirmed={confirmed}
                craftingTableIngredients={craftingTableIngredients}
                onCraftingTableIngredientClick={(ethos) => {
                    setCraftingTableIngredients(i => [...i, ethos])
                    let found = false;
                    setConfirmedIngredients(confirmedIngredients.filter(i => {
                        if(found) return found;
                        const isEthos = i.name === ethos.name;
                        const remove = isEthos && !found;
                        console.log('removeremove', remove)
                        found = true;
                        return remove;
                    }))
                }}
                clearTable={() => setCraftingTableIngredients([])}
                craftedGear={craftedGear}
                confirmedIngredients={confirmedIngredients}
            />
            <CraftingBook 
            craftingTableIngredients={craftingTableIngredients} 
            onCraft={(gear: Gear) => setCraftedGear(allGear => [...allGear, gear])} 
            />
        </Container>
    )
}