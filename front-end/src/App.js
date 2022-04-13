// import logo from './logo.svg';
import React, { useContext, useEffect, useState } from "react";
import "./App.css";
//redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./store/indexReducer";

//Header
import Header from "./components/Header";

//Main
import Main from "./components/Main";

//store
const store = createStore(rootReducer);

//최상위 컴포넌트 App
function App() {
  return (
    <>
      <Provider store={store}>
        <Header />
        <div className="container">
          <Main />
        </div>
      </Provider>
    </>
  );
}

export default App;
