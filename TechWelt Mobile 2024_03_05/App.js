import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import * as PushNotifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { StyleSheet, Platform, Image,TouchableOpacity,View, BackHandler, Alert,Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { getItemString } from './src/services/getLocalAsyncStorage';

import Splash from './src/screens/Login/Splash';
import LoginBoard from './src/screens/Login/LoginBoard';
import SignupBoard from './src/screens/Signup/SignupBoard';

import Vehicle_List from './src/screens/List/Vehicle_List';
import Dashboard from './src/screens/Dashboard/Dashboard';
import History from './src/screens/Dashboard/History';
import Geofence from './src/screens/Dashboard/Geofence';
import NotificationSetting from './src/screens/Dashboard/NotificationSetting';
import Notification from './src/screens/Notification/Notification';
import Profile from './src/screens/Profile/Profile';

import store from './src/store';
import {useTranslation} from "react-i18next";
import {I18nextProvider} from "react-i18next";
import i18n from "./src/utils/i18n";

import Users from './src/screens/Dashboard/Users';
import Vehicle_Add from './src/screens/List/Vehicle_Add';
import Vehicle_Detail from './src/screens/List/Vehicle_Detail';
import Vehicle_Edit from './src/screens/List/Vehicle_Edit';
import Vehicle_Setting from './src/screens/List/Vehicle_Setting';
import Locations from './src/screens/Dashboard/Locations';
import User_Add from './src/screens/Dashboard/User_Add';
import User_Detail from './src/screens/Dashboard/User_Detail';
import User_Edit from './src/screens/Dashboard/User_Edit';
import Report from  './src/screens/Dashboard/Report';
import Map from './src/screens/List/Map';
import CurrentMap from './src/screens/Dashboard/CurrentMap';
import SignupVerify from './src/screens/Signup/SignupVerify';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const bottomNavHeight = Platform.OS === 'android' ? 56 : 49;

global.recieveperiodTime = 5000;
global.realtimeVehicles = [];
global.vehicleangle = [];

const BACKGROUND_FETCH_TASK = 'background-fetch-techwelt-name';

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await PushNotifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: PushNotifications.AndroidImportance.MAX,
      groupId: 'Techwelt',
      description:'Techwelt channel',
      vibrationPattern: [0, 250, 250, 250],
      enableLights: true,
      showBadge: true,
      lightColor: '#FF231F7C',
      icon: "./assets/notification_icon.png"
    });
  }

  if (true) {
    const { status: existingStatus } = await PushNotifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await PushNotifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
    }
    token = (await PushNotifications.getExpoPushTokenAsync({ projectId: '67f4f9f0-a4ac-4d9c-a186-f38d2384f3ab' })).data;
    console.log("@@register",token);
    //alert(token);
  } else {
    //alert('Must use physical device for Push Notifications');
  }

  return token;
}

const VehicleListStack = () => (
  <Stack.Navigator initialRouteName={'Vehicle_List'}>
    <Stack.Screen name='Vehicle_List' component={Vehicle_List} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Vehicle_Add' component={Vehicle_Add} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Vehicle_Detail' component={Vehicle_Detail} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Vehicle_Edit' component={Vehicle_Edit} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Vehicle_Setting' component={Vehicle_Setting} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Map' component={Map} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='CurrentMap' component={CurrentMap} options={{ headerShown: false }}></Stack.Screen>
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator initialRouteName="Dashboard">
    <Stack.Screen name='Dashboard' component={Dashboard} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Users' component={Users} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='User_Add' component={User_Add} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='User_Detail' component={User_Detail} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='User_Edit' component={User_Edit} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Report' component={Report} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='History' component={History} options={{ headerShown: false }}></Stack.Screen>
  </Stack.Navigator>
);

const LocationStack = () => (
  <Stack.Navigator initialRouteName="Locations">
    <Stack.Screen name='Locations' component={Locations} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Users' component={Users} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='History' component={History} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='Geofence' component={Geofence} options={{ headerShown: false }}></Stack.Screen>
    <Stack.Screen name='NotificationSetting' component={NotificationSetting} options={{ headerShown: false }}></Stack.Screen>
  </Stack.Navigator>
);

const AlertStack = () => (
  <Stack.Navigator initialRouteName="Notification">
    <Stack.Screen name='Notification' component={Notification} options={{ headerShown: false }}></Stack.Screen>
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator initialRouteName="Profile">
    <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }}></Stack.Screen>
  </Stack.Navigator>
);

const MyTabs = () => {
  const { t } = useTranslation();
  const tabBarOptions = {
    tabBarLabelStyle: { color: 'red' }, // Set the desired color here
  };
  
  return (
    <Tab.Navigator
      initialRouteName="LocationStack"
      tabBarLabelStyle={{color:'red'}}
      tabBarStyle={{height:20}}
      // tabBarOptions={{ showLabel: false, activeTintColor: 'white', tabBarOptions}}
      screenOptions={{headerShown: false, tabBarShowLabel:false, tabBarActiveTintColor:'white'}}
    >
      <Tab.Screen
        name="VehicleListStack"
        component={VehicleListStack}
        options={{
          tabBarOptions: {
            activeTintColor: 'white',
          },
          tabBarStyle:{backgroundColor:'#333333'},
          headerStyle: {backgroundColor:'#364153'},
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            color=="white" ?
            <Image style={{width:33, height:33, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_list_sel.png')}></Image>
            :
            <Image style={{width:33, height:33, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_list_desel.png')}></Image>
          ),
        }}
      />

      <Tab.Screen
        name="DashboardStack"
        component={DashboardStack}
        options={{
          tabBarOptions: {
            activeTintColor: 'white',
          },
          tabBarStyle:{backgroundColor:'#333333'},
          headerStyle: {backgroundColor:'#364153'},
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            color=="white" ?
            <Image style={{width:25, height:25, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_dashboard_sel.png')}></Image>
            :
            <Image style={{width:25, height:25, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_dashboard_desel.png')}></Image>
          ),
        }}
      />

      <Tab.Screen
        name="LocationStack"
        component={LocationStack}
        options={{
          tabBarOptions: {
            activeTintColor: 'white',
          },
          tabBarStyle:{backgroundColor:'#333333'},
          headerStyle: {backgroundColor:'#364153'},
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            color=="white" ?
            <Image style={{width:30, height:30, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_map_sel.png')}></Image>
            :
            <Image style={{width:30, height:30, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_map_desel.png')}></Image>
          ),
        }}
      />

      <Tab.Screen
        name="AlertStack"
        component={AlertStack}
        options={{
          tabBarOptions: {
            activeTintColor: 'white',
          },
          tabBarStyle:{backgroundColor:'#333333'},
          headerStyle: {backgroundColor:'#364153'},
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            color=="white" ?
            <View>
              <Image style={{width:40, height:40, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_alert_sel.png')}></Image>
              <View style={{position:'absolute', right:0, top:0, width:18, height:18, borderRadius:9, backgroundColor:'#D01400'}}>
                <Text style={{ color:'white', alignSelf:'center', fontSize:10, marginTop:1}}>32</Text>
              </View>
            </View>
            :
            <View>
              <Image style={{width:40, height:40, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_alert_desel.png')}></Image>
              <View style={{position:'absolute', right:0, top:0, width:18, height:18, borderRadius:9, backgroundColor:'#D01400'}}>
                <Text style={{ color:'white', alignSelf:'center', fontSize:10, marginTop:1}}>32</Text>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarOptions: {
            activeTintColor: 'white',
          },
          tabBarStyle:{backgroundColor:'#333333'},
          headerStyle: {backgroundColor:'#364153'},
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            color=="white" ?
            <Image style={{width:30, height:30, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_profile_sel.png')}></Image>
            :
            <Image style={{width:30, height:30, tintColor:color, resizeMode:'contain'}} source={require('./assets/tab_profile_desel.png')}></Image>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stacknav = (navigation) => {
  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
    >
      <MyMainTab.Navigator>
        <MyMainTab.Screen name="VehicleList" component={VehicleListStack} />
        <MyMainTab.Screen name="Home" component={HomeStack} />
      </MyMainTab.Navigator>

      <Stack.Screen name='Mainpage' component={MyTabs} options={{ headerShown: false }}></Stack.Screen>
      
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name='LoginBoard' component={LoginBoard} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='SignupBoard' component={SignupBoard} options={{ headerShown: false }}></Stack.Screen>

      <Stack.Screen name='Users' component={Users} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='User_Add' component={User_Add} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='User_Detail' component={User_Detail} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='User_Edit' component={User_Edit} options={{ headerShown: false }}></Stack.Screen>

      <Stack.Screen name='Report' component={Report} options={{ headerShown: false }}></Stack.Screen>


      <Stack.Screen name='Vehicle_Add' component={Vehicle_Add} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Vehicle_Detail' component={Vehicle_Detail} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Vehicle_Edit' component={Vehicle_Edit} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Vehicle_Setting' component={Vehicle_Setting} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='CurrentMap' component={CurrentMap} options={{ headerShown: false }}></Stack.Screen>
      
      <Stack.Screen name='History' component={History} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='Geofence' component={Geofence} options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen name='NotificationSetting' component={NotificationSetting} options={{ headerShown: false }}></Stack.Screen>

    </Stack.Navigator>

  );
}

const chkBackgroundFecth = async () =>{
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
  console.log("@@@@@chkBackgroundFecth",isRegistered,BACKGROUND_FETCH_TASK)
    
  if(isRegistered){
    unregisterBackgroundFetchAsync();
  }
}

async function registerBackgroundFetchAsync() {
  console.log("@@@@@registerbackFecth")
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 15, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  console.log("@@@@@unregisterbackFecth")
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function App() {

  const {t} = useTranslation();

  const [isRegistered, setIsRegistered] = React.useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const getRecievperiodTime = async()=>{
    let receivePeriod = await getItemString("receivePeriod");
    console.log("@@@@@@@realtimevehicle period",receivePeriod);
    receivePeriod = receivePeriod != null ? receivePeriod : 7000; 
    global.recieveperiodTime = parseInt(receivePeriod);
}


  // useEffect(() => {
  //   getRecievperiodTime();    
  //   chkBackgroundFecth();

  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  //   notificationListener.current = PushNotifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = PushNotifications.addNotificationResponseReceivedListener(response => {
  //     console.log("@@@@App.js addnotification response",response);
  //   });

  //   const appState = AppState.addEventListener('change', (nextAppState) => {
      
  //     if(global.userToken == "" || global.userID ==""){
  //       console.log("@@@@@app state change, user info null")
  //       return;
  //     } 
  //     if (nextAppState === 'background') {  
  //     //if (AppState.currentState === 'active' && (nextAppState == "inactive" || nextAppState == "background")) {  
  
  //       console.log("@@@@@@@@@@@background state background",new Date(),isRegistered)
  //       if(!global.isRegisterBF){
  //       //if(!isRegistered){
  //         global.startDateBF = new Date();
  //         global.isRegisterBF = true;
  //         registerBackgroundFetchAsync();
          
  //         checkStatusAsync();
  //       }
  //     }else if (nextAppState === 'active') {  
  //     //}else if (nextAppState === 'active' && (AppState.currentState == "inactive" || AppState.currentState == "background")) {  
  //       console.log("@@@@@@@@@@@background state active",isRegistered);     
  //       if (global.isRegisterBF) {
  //       //if (isRegistered) {
  //         global.isRegisterBF = false;
  //         unregisterBackgroundFetchAsync();        
  //         checkStatusAsync();
  //       }
  //     }
  
  //     console.log("@@@ nextAppState",AppState.currentState, nextAppState)
  //   });

  //   return () => {
  //     PushNotifications.removeNotificationSubscription(notificationListener.current);
  //     PushNotifications.removeNotificationSubscription(responseListener.current);

  //     appState.remove();
  //   };

  // }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    console.log("@@@@@checkStatusAsync",isRegistered,BACKGROUND_FETCH_TASK)
    global.isRegisterBF = isRegistered;
    setIsRegistered(isRegistered);
  };


  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={'Splash'}>
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="LoginBoard" component={LoginBoard} options={{ headerShown: false }} />
            <Stack.Screen name="SignupBoard" component={SignupBoard} options={{ headerShown: false }} />
            <Stack.Screen name="SignupVerify" component={SignupVerify} options={{ headerShown: false }} />
            <Stack.Screen name="MainScreen" component={MyTabs} options={{ headerShown: false }} />
          </Stack.Navigator>
      </NavigationContainer>
      </Provider>
    </I18nextProvider>

  );
}
const styles = StyleSheet.create({
  plusContainer: {
    backgroundColor: '#18567F',
    borderRadius: bottomNavHeight / 3,
    width: bottomNavHeight * 5 / 6,
    height: bottomNavHeight * 5 / 6,
    marginTop: -bottomNavHeight / 2,
    marginBottom: bottomNavHeight / 2,
    flexDirection: 'row',
    justifyContent: 'center',
    // zIndex: 1000,
    alignItems: 'center',
    elevation: 10
  },
  plusText: {
    fontSize: bottomNavHeight / 2,
    color: '#fff',
    alignSelf: 'center',
    fontWeight: '300'
  },
  to1: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFF',
    borderColor: '#FFFF',
    left: 10
  },
});