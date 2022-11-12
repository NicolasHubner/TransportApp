import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (__DEV__) {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure()
    .useReactNative({
      networking: {
        // optionally, you can turn it off with false.
        ignoreUrls: /symbolicate/,
      },
    })
    .connect();

  // eslint-disable-next-line no-undef
  console.tron = Reactotron;
}

export default Reactotron;
