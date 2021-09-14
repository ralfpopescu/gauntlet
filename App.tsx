import './App.css';
import { Provider } from 'react-redux'
import store from './redux/store'
import AppContent from './AppContent'

const App = () => {

  return (
    <Provider store={store}>
      <div className="App">
        <AppContent />
      </div>
    </Provider>
  );
}

export default App;
