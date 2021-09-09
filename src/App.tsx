import './App.css';
import { Game } from './components/Game'
import { Craft } from './components/Craft'
import { CraftingBook } from './components/CraftingBook'

const App = () => {
  return (
    <div className="App">
      <Game />
      <Craft />
      <CraftingBook />
    </div>
  );
}

export default App;
