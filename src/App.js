import React from 'react';
import Collectin from './components/Collection/Collectin';
//components
import Header from './components/Header/Header';
import Intro from './components/Intro/Intro';
import LatestVideo from './components/LatestVideo/LatestVideo';
import Streaming from './components/Streaming/Streaming';

function App() {
  return (
    <div className="App">
      <Header/>
      <Intro/>
      <Collectin/>
      <Streaming/>
      <LatestVideo/>
    </div>
  );
}

export default App;
