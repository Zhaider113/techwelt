import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, StatusBar, StyleSheet, Modal,
  TouchableOpacity, Image, FlatList, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { ScrollView } from 'react-native-virtualized-view';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import Header from "../Header";
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from "moment";
import ModalDropdown from 'react-native-modal-dropdown';

const tempNotiData=[{alert:"Movement", vehicle:"Audi", time:"11-03-2023 13:10"},
                    {alert:"Enter", vehicle:"Faster",  time:"11-03-2023 13:10" },
                    {alert:"Outer",  vehicle:"BMW",  time:"11-03-2023 13:10"},
                    {alert:"Movement", vehicle:"Audi", time:"11-03-2023 13:10"},
                    {alert:"Outer",  vehicle:"BMW",  time:"11-03-2023 13:10"},
                    {alert:"Movement", vehicle:"Audi", time:"11-03-2023 13:10"},
                    ];

export default function Notification({ navigation }) {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.auth);
  const notificationsReducer = useSelector(state => state.notifications);

  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [result, setResult] = useState(tempNotiData);

  const [showCalendar, setShowCalendar] = useState(false);
  useFocusEffect(React.useCallback(() => {
  }, []));

  const handleClearData = () => {
    setShowCalendar(false)
    setFromDate("");
    setToDate("");
    setF_H("00"), setF_M("00");
    setT_H("00"), setT_M("00");
    setSearchText("");
    setResult(tempNotiData);
  }
  
  const handleGetNotiData = () => {
    setShowCalendar(false)
    console.log("@@@From : ", fromDate)
    console.log("@@@To : ", toDate),
    console.log("@@@Search string :", searchText)
    setResult(filterData(tempNotiData));
  }

  const handleClear = (data) => {
    if(data === "From") {
      setFromDate();
    } else {
      setToDate()
    }
  }

  const [f_h, setF_H] = useState("00");
  const [f_m, setF_M] = useState("00");
  const [t_h, setT_H] = useState("00");
  const [t_m, setT_M] = useState("00");
  const [f_meridian, setFMeridian] = useState("AM")
  const [t_meridian, setTMeridian] = useState("AM")
  const [curTimeType, setCurTimeType] = useState("");
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleTime = (data) => {
    setShowTimeModal(true);
    setCurTimeType(data);
  }

  const decreaseVal = () => {
    let tmpVal = 0;
    if(curTimeType === 'f_h') {
      tmpVal = parseInt(f_h);
      if(tmpVal === 0) {
        tmpVal === parseInt(f_h.substring(1,2))
      }
      if(tmpVal === 0){
        tmpVal = 11;
      } else {
        tmpVal = tmpVal - 1;
      }
      setF_H(tmpVal.toString().padStart(2, '0'));
    } else if(curTimeType === 'f_m') {
      tmpVal = parseInt(f_m);
      if(tmpVal === 0) {
        tmpVal === parseInt(f_m.substring(1,2))
      }
      if(tmpVal === 0){
        tmpVal = 59;
      } else {
        tmpVal = tmpVal - 1;
      }
      setF_M(tmpVal.toString().padStart(2, '0'));
    } else if(curTimeType === 't_h') {
      tmpVal = parseInt(t_h);
      if(tmpVal === 0) {
        tmpVal === parseInt(t_h.substring(1,2))
      }
      if(tmpVal === 0){
        tmpVal = 11;
      } else {
        tmpVal = tmpVal - 1;
      }
      setT_H(tmpVal.toString().padStart(2, '0'));
    } else if(curTimeType === 't_m') {
      tmpVal = parseInt(t_m);
      if(tmpVal === 0) {
        tmpVal === parseInt(t_m.substring(1,2))
      }
      if(tmpVal === 0){
        tmpVal = 59;
      } else {
        tmpVal = tmpVal - 1;
      }
      setT_M(tmpVal.toString().padStart(2, '0'));
    }
  }

  const increaseVal = () => {
    let tmpVal = 0;
    if(curTimeType === 'f_h') {
      tmpVal = parseInt(f_h);
      console.log('>>',f_h)
      if(tmpVal === 0) {
        tmpVal === parseInt(f_h.substring(1,2))
      }
      if(tmpVal === 11){
        tmpVal = 0;
      } else {
        tmpVal = tmpVal + 1;
      }
      setF_H(tmpVal.toString().padStart(2, '0'));
    } else if(curTimeType === 'f_m') {
      tmpVal = parseInt(f_m);
      if(tmpVal === 0) {
        tmpVal === parseInt(f_m.substring(1,2))
      }
      if(tmpVal === 59){
        tmpVal = 0;
      } else {
        tmpVal = tmpVal + 1;
      }
      setF_M(tmpVal.toString().padStart(2, '0'));
    } else if(curTimeType === 't_h') {
      tmpVal = parseInt(t_h);
      if(tmpVal === 0) {
        tmpVal === parseInt(t_h.substring(1,2))
      }
      if(tmpVal === 11){
        tmpVal = 0;
      } else {
        tmpVal = tmpVal + 1;
      }
      setT_H(tmpVal.toString().padStart(2, '0'));
    } else if(curTimeType === 't_m') {
      tmpVal = parseInt(t_m);
      if(tmpVal === 0) {
        tmpVal === parseInt(t_m.substring(1,2))
      }
      if(tmpVal === 59){
        tmpVal = 0;
      } else {
        tmpVal = tmpVal + 1;
      }
      setT_M(tmpVal.toString().padStart(2, '0'));
    }
  }

  const [curSelCalender, setCurSelCalender] = useState();
  const renderDropdownRow = (data) => {
    // console.log('>>>>>>>',data)
    return (
      <View style={{position:'absolute', zIndex:100, top:45, alignSelf:'center'}}>
        {data === "From" ?
        <Image source={require('../../../assets/arrow_up.png')} 
          style={{alignSelf:'flex-start', marginLeft:70, width: 20, height:16, resizeMode:'contain'}} ></Image>
          :
        <Image source={require('../../../assets/arrow_up.png')} 
          style={{alignSelf:'center', width: 20, height:16, resizeMode:'contain', marginLeft:120}} ></Image>
        }
        <Calendar
          style={{width:wp('85%'), height:350, borderRadius:10, alignSelf:'center', marginTop:-4}}
          theme={{
            'stylesheet.calendar.main': {
              week: {
                marginVertical: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
            calendarBackground: '#1F1C1C',
            textSectionTitleColor: '#EEECF1', // Mon , Tue, Wed, ...
            selectedDayBackgroundColor: '#132C14',
            selectedDayTextColor: '#f00',
            todayTextColor: 'red',
            dayTextColor: '#002ED0', monthTextColor:'#EEECF1',
            textDisabledColor: '#898A8D'}}
            onDayPress={day => {
              if(data === "From") {
                setFromDate(day.dateString);
              } else {
                setToDate(day.dateString);
              }
          }}
        />

          <View style={{flexDirection:'row'}}>
            <View style={{width:120, height:42, backgroundColor:'black', marginTop:-50, marginLeft:30, paddingLeft:10, 
              borderWidth:2, borderColor:'#76A9FF', borderRadius:12}}>
                <Text style={{color:'#76A9FF'}}>{data}</Text>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity 
                    onPress={ ()=> {
                      if(data === "From") {
                        handleTime("f_h")
                      } else if(data === "To") {
                        handleTime("t_h")
                      }
                    }}>
                    <Text style={{color:'white'}}>{data === "From" ? f_h : t_h}</Text>
                  </TouchableOpacity>
                  <Text style={{color:'white'}}>{" : "}</Text>
                  <TouchableOpacity 
                    onPress={ ()=> {
                      if(data === "From") {
                        handleTime("f_m")
                      } else if(data === "To") {
                        handleTime("t_m")
                      }
                    }}>
                    <Text style={{color:'white'}}>{data === "From" ? f_m : t_m}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={ ()=> {
                      if(data === "From") {
                        setFMeridian(f_meridian === 'AM' ? 'PM' : 'AM')
                      } else if(data === "To") {
                        setTMeridian(f_meridian === 'AM' ? 'PM' : 'AM')
                      }
                    }}>
                    <Text style={{color:'white', marginLeft:10}}>{data=== "From" ? f_meridian : t_meridian}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={ () => {
                    setF_H("00"); setF_M("00"); setFMeridian("AM");
                  }}>
                  <Image style={{position:'absolute',right:10, top:-30, width:20,height:20, resizeMode:'contain'}} source={require('../../../assets/x.png')}></Image>
                </TouchableOpacity>
            </View>
           
            <TouchableOpacity style={{borderRadius:5, alignSelf:'center', alignItems: 'center', 
              justifyContent:'center', backgroundColor:'#18AFF5', width:60, height:30,
              position:'absolute',right:100,bottom:15}} onPress={()=>{handleClear(data)}}>
              <Text style={styles.submit}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{borderRadius:5, alignSelf:'center', alignItems: 'center', 
              justifyContent:'center', backgroundColor:'#18AFF5', width:60, height:30,
              position:'absolute',right:20,bottom:15}} onPress={()=>{handleGetNotiData()}}>
              <Text style={styles.submit}>{t('Submit')}</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  };
  const dropdownOptions = ['Menu'];

  const NotificationList = () => {
    //if (!notificationsReducer.isGettingNotifies && notificationsReducer.notifications === undefined) {
    if (tempNotiData == null) {
      console.log("@@@@@data is empty")
        return (
            <View style={{ alignSelf:'center', width: wp('100%'), height: hp('100%') }}>
              <Text style={{ textAlign:'center', alignItems: 'center', marginTop: hp('30%')}}>No Notifications</Text>
            </View>
        )
    }
    else {
        return (
          < FlatList
            data={result}
            renderItem={({ item }) => renderNotificationItem(item)}
            style={{ width: wp('100%'), height: hp('100%')- 305}}
          />           
        )
    }
    
  }

  function filterData(data) {
    let tmpData = data;
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    if(fromDate !== undefined) {
      if(toDate !== undefined) {
        tmpData = data.filter(item => {
          const itemDate = moment(item.time, "MM-DD-YYYY HH:mm").format();
          return new Date(itemDate) >= startDate && new Date(itemDate) <= endDate; });
      } else {
        tmpData = data.filter(item => {
          const itemDate = moment(item.time, "MM-DD-YYYY HH:mm").format();
          return new Date(itemDate) >= startDate; });
      }
    } else {
      if(toDate !== undefined) {
        tmpData = data.filter(item => {
          const itemDate = moment(item.time, "MM-DD-YYYY HH:mm").format();
          return new Date(itemDate) <= endDate; });
      }
    }

    return tmpData.filter(
      function (item) {
          if (item.alert.toLowerCase().includes(searchText.toLowerCase())) {
              return item;
          }
          if (item.vehicle.toLowerCase().includes(searchText.toLowerCase())) {
              return item;
          }
      }
    );
  }

  const renderNotificationItem = (item) => {
    const date = new Date(item.time);
    return (
        <View style={styles.listItem}>
            <Text style={[styles.listString,{width:wp('30%')}]}>{item.alert}</Text>
            <Text style={[styles.listString,{width:wp('20%')}]}>{item.vehicle}</Text>
            <Text style={[styles.listString,{width:wp('50%')}]}>{item.time}</Text>
        </View>
    )
  }


  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header screenName={t('notifications')} curNavigation={navigation}></Header>

      <Modal visible={showTimeModal} transparent={true}>
        <View style={{width:wp('100%'), height:hp('100%'), backgroundColor:'rgba(0,0,0,0.2)', justifyContent:'center'}}>
          <View style={{flexDirection:'row', alignSelf:'center'}}>
            <TouchableOpacity
              onPress={ () => {
                decreaseVal();
            }}>
              <Text style={{fontSize:30, color:'white', backgroundColor:'#364143', textAlign:'center', width:40, height:40}}>-</Text>
            </TouchableOpacity>
            {curTimeType === "f_h" &&
            <Text style={{fontSize:30, fontWeight:'bold', color:'red', marginLeft:10, marginRight:10}}>{f_h}</Text>
            }
            {curTimeType === "f_m" &&
            <Text style={{fontSize:30, fontWeight:'bold', color:'red', marginLeft:10, marginRight:10}}>{f_m}</Text>
            }
            {curTimeType === "t_h" &&
            <Text style={{fontSize:30, fontWeight:'bold', color:'red', marginLeft:10, marginRight:10}}>{t_h}</Text>
            }
            {curTimeType === "t_m" &&
            <Text style={{fontSize:30, fontWeight:'bold', color:'red', marginLeft:10, marginRight:10}}>{t_m}</Text>
            }
            <TouchableOpacity
              onPress={ () => {
                increaseVal();
            }}>
              <Text style={{fontSize:30, color:'white', backgroundColor:'#364143', textAlign:'center', width:40, height:40}}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
           onPress={ () => {
            setShowTimeModal(false);
           }}>
            <Text style={{marginTop:20, fontSize:20, paddingTop:5, color:'white', backgroundColor:'#364143', alignSelf:'center', textAlign:'center',
                width:60, height:40, borderRadius:10,}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.searchTxt}>
        <TextInput placeholder={t('search_vehicle')} style={{ height:40, width: '100%' }} onChangeText={(val) => setSearchText(val)} />
      </View>

      <View style={{flexDirection:'row',alignSelf:'center', width:wp('96.8%'), marginTop:12}}>
        <TouchableOpacity onPress={() => {setShowCalendar(true); setCurSelCalender("From")}}>
          <TextInput editable={false} placeholder={t('from')} style={[styles.searchTxt,{ height:40, width:140 , marginRight:12 }]} value={fromDate}/>
          <Image source={require('../../../assets/calendar.png')} style={{position:'absolute', left:110, top:15, width: 20, height:20}} ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setShowCalendar(true); setCurSelCalender("To")}}>
          <TextInput editable={false} placeholder={t('to')} style={[styles.searchTxt,{ height:40, width: 140, marginRight:26 }]} value={toDate} />
          <Image source={require('../../../assets/calendar.png')} style={{position:'absolute', left:110, top:15, width: 20, height:20}} ></Image>
        </TouchableOpacity>
        {showCalendar && renderDropdownRow(curSelCalender)}
        <TouchableOpacity style={{ justifyContent:'center'}} onPress={() => {handleClearData()}}>
          <Image source={require('../../../assets/clear_filter.png')} style={styles.imgSearch} ></Image>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: wp('96.8%'), marginTop: 21 }}>
        <Text style={[styles.listHeader,{width:wp('35%')}]}>{t('alert')}</Text>
        <Text style={[styles.listHeader,{width:wp('15%')}]}>{t('vehicle')}</Text>
        <Text style={[styles.listHeader,{width:wp('50%')}]}>{t('time')}</Text>
      </View>

      <View style={{width:wp('100%')}}>
        <NotificationList></NotificationList>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "white",
  },
  searchTxt: {
    width:wp('96.8%'), 
    borderRadius: 8, borderWidth:1, borderColor: '#A9A9A9', 
    alignSelf:'center', justifyContent:'center',
    paddingLeft: 15, paddingRight: 15,
    color:'#333', fontSize:12, fontWeight:'500',
    marginTop:5
  },
  imgSearch: {
    resizeMode:'contain',
    width: 35,
    height: 35,
    marginTop:5,
    alignSelf: 'center',
    justifyContent:'center'
  },
  listHeader: {
    fontSize: 14,
    fontWeight:'bold',
    color: '#1E6B97',
    alignSelf: 'center',
    textAlign: 'center',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    width: wp('96.8%'),
    height:35,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 2,
    paddingVertical: 5
  },
  listString: {
    fontSize: 12, fontWeight:'500',
    color: '#1E6B97',
    alignSelf: 'center',
    textAlign: 'center',
  },
  submit: {
    fontSize:12,color:"#FFFFFF", fontWeight:'500',
    textAlign:'center',
  }
});
