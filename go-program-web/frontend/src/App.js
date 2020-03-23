import React from 'react';
import './App.css';
import {HashRouter} from 'react-router-dom';
import Main from './components/Main';

function App() {
  return (
    <HashRouter>
          <div>
            {/* App Component Has a Child Component called Main*/}
            <Main/>
          </div>
    </HashRouter>
  );
}

export default App;
