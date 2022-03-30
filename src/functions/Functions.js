import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import { Alert, Linking, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';

export const GOOGLE_MAPS_APIKEY = "AIzaSyB6UYoyhDj2Hc81EiUJcRzpvpWF0umRCag"

const config = {
    accuracy: {
        android: 'high',
        ios: 'best',
    },
    enableHighAccuracy: true,
    timeout: 2000,
    distanceFilter: 0,
};


const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
        Linking.openSettings().catch(() => {
            Alert.alert('Unable to open settings');
        });
    };

    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
        return true;
    }
    if (status === 'denied') {
        Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
        Alert.alert(
            `Turn on Location Services to allow  to determine your location.`, '',
            [
                { text: 'Go to Settings', onPress: openSetting },
                { text: "Don't Use Location", onPress: () => { } },
            ],
        );
    }
    return false;
};

const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        const hasPermission = await hasLocationPermissionIOS();
        return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
        );
    }
    return false;
};


export const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
        return false;
    }
    const getCoords = async () => {
        const data = new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(resolve, reject, config,)
        });
        return data.then((res) => {
            return res
        }).catch((error) => {
            alert(error.message)
            return false;
        });
    };
    const location = await getCoords();
    // console.log('location',location);
    return location ? { latitude: location.coords.latitude, longitude: location.coords.longitude } : false
};