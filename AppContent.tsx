import './App.css';
import { useAppSelector } from './redux'

import { Game } from './components/Game'
import { Craft } from './components/Craft'

const AppContent = () => {
  const appState = useAppSelector(state => state.app.appState);

  return (
    <>
        {appState === 'game' && <Game />}
        {appState === 'crafting' && <Craft />}
    </>
  );
}

export default AppContent;
