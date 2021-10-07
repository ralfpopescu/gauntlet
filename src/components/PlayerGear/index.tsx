import { Gear } from '../../types-app'
import styled from 'styled-components'

type PlayerGearProps = { gear: Gear[] }

const Container = styled.div`
display: flex;
flex-direction: column;
`

type SlotProps = { gear: Gear, name: string }

const Slot = ({ gear, name }: SlotProps) => {
    return (
        <Container>
            <div>{name}</div>
            <div>{JSON.stringify(gear.statEffects)}</div>
            <div>{gear.effectDescription}</div>
        </Container>
    )
}

export const PlayerGear = ({ gear }: PlayerGearProps) => {
    const head = gear.find(g => g.slot === 'head');
    const mainhand = gear.find(g => g.slot === 'mainhand');
    const offhand = gear.find(g => g.slot === 'offhand');
    const chest = gear.find(g => g.slot === 'chest');
    const feet = gear.find(g => g.slot === 'feet');

    return (
        <Container>
            {head && <Slot gear={head} name="Head"/>}
            {mainhand && <Slot gear={mainhand} name="Main-hand"/>}
            {offhand && <Slot gear={offhand} name="Off-hand"/>}
            {chest && <Slot gear={chest} name="Body"/>}
            {feet && <Slot gear={feet} name="Feet"/>}
        </Container>
    )
}