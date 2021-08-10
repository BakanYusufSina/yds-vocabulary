import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './src/pages/Home'
import Vocabularies from './src/pages/Vocabularies'
import Quiz from './src/pages/Quiz'

const Stack = createStackNavigator()

const options = {
  headerStyle: { elevation: 0, backgroundColor: '#25283D' }
  , headerTitle: '', headerTintColor: 'wheat'
}

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home}
            options={{ headerShown: false }} />
          <Stack.Screen name='Vocabularies' component={Vocabularies}
            options={options} />
          <Stack.Screen name='Quiz' component={Quiz}
            options={options} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
