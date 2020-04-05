import React from 'react';
import './App.css';
import {HashRouter} from 'react-router-dom';
import Main from './components/Main';
import store from './redux/store';
import { Provider } from "react-redux";
import 'react-image-lightbox/style.css';

function App() {
  return (
    <Provider store = {store}>
      <HashRouter>
            <div>
              {/* App Component Has a Child Component called Main*/}
              <Main/>
            </div>
      </HashRouter>
    </Provider>
  );
}

export default App;
