import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from './components/Map';

export default function App() {
  return (
    <View style={styles.view}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  }
});
