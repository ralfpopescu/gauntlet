import { Gear } from '../../types-app'
import styled from 'styled-components'

type PlayerGearProps = { gear: Gear[] }

const Container = styled.div`
display: flex;
flex-direction: column;
`

const PlayerGaer = ({ gear }: PlayerGearProps) => {
    const head = gear.find(g => g.slot === 'head');
    const mainhand = gear.find(g => g.slot === 'mainhand');
    const offhand = gear.find(g => g.slot === 'offhand');
    const chest = gear.find(g => g.slot === 'chest');
    const feet = gear.find(g => g.slot === 'feet');


}