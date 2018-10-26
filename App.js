import React, { Component } from 'react';

import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web, AsyncStorage if react-native
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';

import reducers from './src/store';

import Entrypoint from './src/Entrypoint';
import LoadingComponent from './src/components/LoadingComponent';

class App extends Component {

  render() { 

    const config = {
      key: 'primary',
      storage
    }    

    const store = createStore(persistReducer(config,reducers));

    const persistor = persistStore(store);

    return (
      <Provider store={store}>
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          <Entrypoint/>
        </PersistGate>
      </Provider>
    );
  }
}
 
export default App;