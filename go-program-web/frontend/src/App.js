import React from 'react';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Main from './components/Main';
import store from './redux/store';
import { Provider } from "react-redux";
import 'react-image-lightbox/style.css';

function App() {
  return (
    <Provider store = {store}>
      <BrowserRouter>
          <Main/>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
