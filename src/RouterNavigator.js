import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Home from "./component/Home";
// import Subscribe from "./component/Subscribe";
import ChatScreen from "./component/ChatScreen";


const Stack = createNativeStackNavigator();

export default function RouterNavigator() {
    return (
        <Stack.Navigator
            // initialRouteName='Intro'
            screenOptions={{
                headerShown: false
            }}
        >

            <Stack.Screen name='Home' component={Home}
                options={{ headerShadowVisible: false, headerShown: false, }} />


            {/*  <Stack.Screen name='Subscribe' component={Subscribe}
                options={{
                    headerShadowVisible: false,
                }}
            />*/}
           <Stack.Screen name='ChatScreen' component={ChatScreen}
                options={{
                    headerShadowVisible: false,
                }}
            /> 

        </Stack.Navigator>
    );
}




