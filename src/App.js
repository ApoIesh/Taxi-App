import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import RouterNavigator from './RouterNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, isReadyRef } from './NavigationActions';



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                    isReadyRef.current = true;
                }}
            >
                <StatusBar
                    backgroundColor={'#fff'}
                    barStyle={'dark-content'}
                />
                <RouterNavigator />
            </NavigationContainer>
        );
    }
}

export default App;
