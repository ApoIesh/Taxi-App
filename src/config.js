import { Alert, Platform, ToastAndroid } from "react-native";

export let baseUrl = 'https://nawalalanzi.omar.alyomhost.net/api/v1/';
export const commonheaders = {
  'Accept': 'application/json',
  secret: '0b2a14a06cddwwwayukfdbvvc19b107ad43rdf65',
  lang: 'en'
}
export const headers = { ...commonheaders }
export const rendererror = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      message,
      ToastAndroid.SHORT
    )
  } else {
    Alert.alert(
      '',
      message,
      [{ text: 'close', style: 'cancel' }]
    )
  }

}








function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

function appendLeadingZeroes(n) {
  if (n <= 9) {
    return "0" + n;
  }
  return n
}

export function handelDateTime(date) {
  const newFormat = new Date(date);
  const newDate = newFormat.getFullYear() + '-' + appendLeadingZeroes(newFormat.getMonth() + 1) + '-' + appendLeadingZeroes(newFormat.getDate())
  const time = appendLeadingZeroes(newFormat.getHours()) + ':' + appendLeadingZeroes(newFormat.getMinutes()) /*+ ':' + appendLeadingZeroes(newFormat.getSeconds())*/
  return { time: time/*tConvert(time)*/, date: newDate }
}



export function formatTime(timer) {
  const getSeconds = `0${(timer % 60)}`.slice(-2)
  const minutes = `${Math.floor(timer / 60)}`
  const getMinutes = `0${minutes % 60}`.slice(-2)
  const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

  return timer ? `${getHours}:${getMinutes}:${getSeconds}` : `00:00:00`
}