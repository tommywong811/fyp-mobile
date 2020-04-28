import BackgroundFetch from "react-native-background-fetch";
import { api } from '../';

const autoUpdateHandler = {
  configure: () => {
    console.log("autoUpdate configured")
    BackgroundFetch.configure({
      minimumFetchInterval: 1440,     // <-- minutes (15 is minimum allowed)
      // Android options
      forceAlarmManager: false,     // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false,      // Default
      requiresDeviceIdle: false,    // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false  // Default
    }, async (taskId) => {
      fetch('https://api.ust.hk/hkust-path-advisor-api/tags', {
        headers: {
          'Authorization': '5d0c4f23de394e0001045b5d15b0b0884fda4a28a553e098aa2b5531',
          Accept: 'application/json'
        }
      }).then((response) => response.json())
      .then((json) => {
        api.syncTags(json.data)
      })
      fetch('https://api.ust.hk/hkust-path-advisor-api/floors', {
        headers: {
          'Authorization': '5d0c4f23de394e0001045b5d15b0b0884fda4a28a553e098aa2b5531',
          Accept: 'application/json'
        }
      }).then((response) => response.json())
      .then((json) => {
        api.syncFloors(json.data)
      })
      fetch('https://api.ust.hk/hkust-path-advisor-api/buildings', {
        headers: {
          'Authorization': '5d0c4f23de394e0001045b5d15b0b0884fda4a28a553e098aa2b5531',
          Accept: 'application/json'
        }
      }).then((response) => response.json())
      .then((json) => {
        api.syncBuildings(json.data)
      })

      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });
  },
  stop: () => {
    console.log("autoUpdate stopped")
    BackgroundFetch.stop()
  }
}

export default autoUpdateHandler
