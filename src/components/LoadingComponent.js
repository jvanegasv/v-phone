import React, { Component } from 'react';
import { Spinner, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';


class LoadingComponent extends Component {

    render() { 

        const text = this.props.text || 'Loading, please wait...'

        return ( 

            <View style={styles.container}>
                <Text>{ text }</Text>
                <Spinner/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
});
   
export default LoadingComponent;