import React, { Component } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import styles, { fontmedum, fontRegular, hp, wp, bluesky_color } from './Assets/style/styles';
import database from '@react-native-firebase/database';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { getLocation } from '../functions/Functions';


class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            user: auth()?._user?._user,
            User_id: auth()?._user?._user.uid,
            message: null,
            chat: [],
            chatLocation: null

        };
        this.reference = database().ref('chats');
        this.userLocation = props?.route?.params
        this.navigate = this.props.navigation.navigate

    }




    async currentPossition() {
        const region = await getLocation()
        // console.log('region', region);
        if (region) {
            this.setState({
                chatLocation: {
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                },
            })
        }
    }



    async onSend() {
        const { User_id, user, message } = this.state
        let data = {
            message: message,
            time: moment().unix(),
            sender: User_id,
        }
        this.reference.push().set(data)
        this.setState({ message: '' })
    }

    sendLocation() {
        const { User_id, chat, chatLocation } = this.state
        let data = {
            location: chatLocation,
            time: moment().utcOffset('+02:00').unix(),
            sender: User_id,
        }
        this.reference.push().set(data)
    }

    componentDidMount() {
        this.reference
            .orderByChild('time')
            .on('value', snapshot => {
                let messages = [];
                let data = snapshot.val();
                for (let id in data) {
                    messages.push(data[id]);
                }
                messages.sort(function (a, b) {
                    return b.time - a.time
                });
                this.setState({ chat: messages });
            });
        this.currentPossition()
    }

    renderItem = ({ item, index, Item }) => {
        Item = ({ message, latitude, longitude, latitudeDelta, longitudeDelta, }) => {
            return (
                <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    padding: wp(2),
                }}>
                    {message ?
                        <View style={styles.messageCard} >
                            <Text style={styles.messageStyle} >{message}</Text>
                        </View>
                        : latitude ?
                            <View style={styles.mapStyle}  >
                                <MapView
                                    initialRegion={{
                                        latitude,
                                        longitude,
                                        latitudeDelta,
                                        longitudeDelta,
                                    }}
                                    liteMode={true}
                                    rotateEnabled={false}
                                    pitchEnabled={false}
                                    provider={PROVIDER_GOOGLE}
                                    showsIndoorLevelPicker={true}
                                    followsUserLocation={true}
                                    showsMyLocationButton={false}
                                    loadingEnabled={false}
                                    showsUserLocation={true}
                                    style={{
                                        width: wp(50),
                                        height: hp(20),
                                    }}
                                    ref={c => this.mapView = c}
                                    onPress={() => {
                                        this.navigate("Home", ({latitude, longitude, latitudeDelta, longitudeDelta}))
                                    }}
                                />
                            </View>

                            : null
                    }

                </View>
            )
        };
        return (
            <Item
                //messages
                message={item?.message}
                date_time={item?.date_time}
                //user
                sender={item?.sender}
                photoURL={item?.photoURL}
                latitude={item?.location?.latitude}
                longitude={item?.location?.longitude}
                latitudeDelta={0.00922}
                longitudeDelta={0.00421}
            />
        )
    };


    render() {
        const { message, data, chat, user } = this.state
        console.log('chat', chat);
        return (
            <View style={{ ...styles.container }}>
                <FlatList
                    inverted={true}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    data={chat}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: wp(3) }}>
                    <TouchableOpacity onPress={() => this.onSend()} >
                        <Entypo
                            onPress={() => this.sendLocation()}
                            name='location' size={25} color={bluesky_color}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{ ...styles.InputChat, }}
                        placeholder="Send her"
                        value={message}
                        keyboardType={'default'}
                        onChangeText={(message) => this.setState({ message })}
                        secureTextEntry={false}
                    />
                    <TouchableOpacity onPress={() => this.onSend()} >
                        <Text style={{ color: 'blue', fontSize: wp(4.5) }}>Send</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

export default ChatScreen;