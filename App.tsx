import './App.css';
import { Game } from './components/Game'
import { Craft } from './components/Craft'
import { Provider } from 'react-redux'
import store from './redux/store'

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        {/* <Game /> */}
        <Craft />
      </div>
    </Provider>
  );
}

export default App;
