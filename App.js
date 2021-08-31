import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './src/pages/Home'
import Vocabularies from './src/pages/Vocabularies'
import Quiz from './src/pages/Quiz'
import { SafeAreaView } from 'react-native'
import Dictionary from './src/pages/Dictionary'

const Stack = createStackNavigator()

const options = {
  headerStyle: { elevation: 0, backgroundColor: '#25283D' }
  , headerTitle: '', headerTintColor: 'wheat'
}

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer theme={{ colors: { background: 'black' } }}>
          <Stack.Navigator initialRouteName="Home" detachInactiveScreens={false}
            screenOptions={
              { cardStyle: { opacity: 1, backgroundColor: 'black' } }}>
            <Stack.Screen name="Home" component={Home}
              options={{ headerShown: false }} />
            <Stack.Screen name='Vocabularies' component={Vocabularies}
              options={options} />
            <Stack.Screen name='Quiz' component={Quiz}
              options={options} />
            <Stack.Screen name='Dictionary' component={Dictionary}
              options={options} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    )
  }
}
