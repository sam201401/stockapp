import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Appstate from './AppStateManager';
class App extends Component {
  render() {
    return (
      <View>
       <Appstate/>
      </View>
    )
  }
}

export default App