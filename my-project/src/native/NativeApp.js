import React, {Component} from 'react'
import {Text, View} from 'react-native'

class Main extends Component {
  render() {
    return (
      <Text>Main</Text>
    )
  }
}

class SubColumn extends Component {
  render() {
    return (
      <Text>sub column!!!!!</Text>
    )
  }
}

export default class NativeApp extends Component {
  render() {
    return (
      <View>
        <Main/>
        <SubColumn/>
        <Text>this is component!!!!!</Text>
        <Text>this is component2</Text>
      </View>

    )
  }
}