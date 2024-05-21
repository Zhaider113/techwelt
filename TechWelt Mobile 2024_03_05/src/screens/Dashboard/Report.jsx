import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, StatusBar, StyleSheet, 
  TouchableOpacity, Image, FlatList} from "react-native";
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import DateRangePicker from "rn-select-date-range";
import moment from "moment";
import Header from "../Header";
import { navigationRef } from "../../services/navRef";
import ModalDropdown from 'react-native-modal-dropdown';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { jsonToCSV, readRemoteFile } from 'react-native-csv';
import * as Permissions from 'expo-permissions';
import { toastr } from "../../services/navRef";
import * as FileSystem from 'expo-file-system';
import {StorageAccessFramework} from 'expo-file-system';
import XLSX from 'xlsx';

const type_report=[{name:"Fuel", checked:false}, 
                  {name:"Idle", checked:false}, 
                  {name:"Connectivity", checked:false}, 
                  {name:"Movement", checked:false}, 
                  {name:"Ignition ON/OFF", checked:false}, 
                  {name:"OverSpeed", checked:false}, 
                  {name:"Crash", checked:false}, 
                  {name:"Geofence", checked:false}, 
                  {name:"GPS", checked:false}, 
                  {name:"Low Battery", checked:false}, 
                  {name:"Not in Route", checked:false}, 
                  {name:"Temperature", checked:false}];

const tempNotiData=[{vehicle:"Movement", device:"Audi", time:"11-03-2023 13:10"},
                    {vehicle:"Enter", device:"Faster",  time:"11-03-2023 13:10" },
                    {vehicle:"11111",  device:"BMW",  time:"11-03-2023 13:10"},
                    {vehicle:"222",  device:"Safari",  time:"11-03-2023 13:10"},]

export default function Report({ navigation }) {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.auth);
  const notificationsReducer = useSelector(state => state.notifications);

  const [checkTypeList, setCheckTypeList] = useState([]);
  const [checkReportList, setCheckReportList] = useState([]);

  const [searchText, setSearchText] = React.useState("");
  const [isShowTypeList, setIsShowTypeList] = useState(false);

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  const [resultData, setResultData] = useState([]);
  const [resultType, setResultType] = useState(type_report);
  const [checkedAllResult, setCheckedAllResult] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const changeText = (newText) => {
    setSearchText(newText);
  };

  useFocusEffect(React.useCallback(() => {
    const tmpArray = tempNotiData.map( (item, index) => {
      return {'vehicle':item.vehicle, 'time':item.time, 'device':item.device, 'checked':false, 'index':index};
    })
    setResultData(tmpArray);
    // setResultType(type_report);
  }, []));

  const ReportList = () => {
    if (tempNotiData == null) {
      return (
          <View style={{ alignSelf:'center', width: wp('100%'), height: hp('100%') }}>
            <Text style={{ textAlign:'center', alignItems: 'center', marginTop: hp('30%')}}>No Data</Text>
          </View>
      )
    }
    else {
      return (
        < FlatList
          data={filterData(resultData)}
          renderItem={({ item, index }) => renderReportItem(item, index)}
          style={{ width: wp('100%'), height: hp('100%') - 230}}
        />           
      )
    }
    
  }

  const renderTypeItem = (item,index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleCheckType(item)
        }}>
        <View style={{alignItems:'center',width:'100%', height:33, flexDirection:'row',justifyContent:'flex-start'}}>
          <View style={{width:17,height:17, marginLeft:10, alignItems:'center', justifyContent:'center', borderColor:'#7A7D8B',borderRadius:4,borderWidth:2}}>
            {item.checked ? (<IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="check-bold" size={11} color="red" />
            </IconComponentProvider>) : null }
          </View>
          <Text style={{marginLeft:15, fontWeight:'bold', fontSize:16, cololr:'#374957'}}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
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
            if (item.device.toLowerCase().includes(searchText.toLowerCase())) {
                return item;
            }
            if (item.vehicle.toLowerCase().includes(searchText.toLowerCase())) {
                return item;
            }
        }
    );
  }

  const handleCheckType = (data) => {
    setResultType(
      resultType.map((item) =>
        item.name === data.name ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const handleCheckData = (data) => {
    setResultData(
      resultData.map((item) =>
        item.device === data.device ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const renderReportItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleCheckData(item)
          // let tempCheckList = checkTypeList;
          // console.log("$$$!!!", tempCheckList)
          // tempCheckList[index] = !tempCheckList[index]; 
          // console.log("$$$", tempCheckList)
          // setCheckTypeList(tempCheckList);
        }}
        >
          <View style={styles.listItem}>
            <View style={{width:17,height:17, position:'absolute', left:10, borderColor:'#7A7D8B',borderRadius:4,borderWidth:2}}>
              {item.checked && <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="check-bold" size={11} color="red" />
              </IconComponentProvider>}
            </View>
              <Text style={[styles.listString,{width:wp('40%')-15}]}>{item.vehicle}</Text>
              <Text style={[styles.listString,{width:wp('30%')}]}>{item.device}</Text>
              <Text style={[styles.listString,{width:wp('30%')}]}>{item.time}</Text>
          </View>
      </TouchableOpacity>
    )
  }

  const handleCheckAllResult = (flag) => {
    console.log("----3", flag)
    if (flag === true) {
      const tmpData = resultData.map(item => {
        return {...item, checked: !flag};
      });
      console.log("----1", tmpData)
      // setResultData(tmpData);
    } else {
      const tmpData = resultData.map(item => {
        return {...item, checked: flag};
      }); 
      console.log("----2", tmpData)
      // setResultData(tmpData);
    }
    // setCheckedAllResult(flag);
  }

  const dropdownOptions = ['Menu'];
  const renderDropdownReportType = () => {
    return (
      <FlatList 
        data={resultType}
        renderItem={({ item,index }) => renderTypeItem(item,index)}
      />
    );
  }

  const handleClear = (data) => {
    if(data === "From") {
      setFromDate();
    } else {
      setToDate()
    }
  }


  const renderDropdownCalendar = (data) => {
    return (
      <View>
        {data === "From" ?
        <Image source={require('../../../assets/arrow_up.png')} 
          style={{alignSelf:'flex-start', marginLeft:70, width: 20, height:16, resizeMode:'contain'}} ></Image>
          :
        <Image source={require('../../../assets/arrow_up.png')} 
          style={{alignSelf:'center', width: 20, height:16, resizeMode:'contain'}} ></Image>
        }
        <Calendar
          style={{width:wp('85%'), height:310, borderRadius:10, alignSelf:'center', marginTop:-4}}
          theme={{
            'stylesheet.calendar.main': {
              week: {
                marginVertical: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
            calendarBackground: '#DFE0EB',
            textSectionTitleColor: '#7A7D8B', // Mon , Tue, Wed, ...
            selectedDayBackgroundColor: '#132C14',
            todayTextColor: 'red',
            dayTextColor: '#002ED0', monthTextColor:'#7A7D8B',
            textDisabledColor: '#898A8D'}}
            onDayPress={day => {
            if(data === "From") {
              setFromDate(day.dateString);
            } else {
              setToDate(day.dateString);
            }
            // setResult(filterData(tempNotiData));
          }}
        />
        <TouchableOpacity style={{backgroundColor:'red',position:'absolute', right:20}} onPress={() => {handleClear(data)}}>
          <Text style={{color:'white', position:'absolute', right:30, top:290, borderRadius:7, width:50, height:20, textAlign:'center', backgroundColor:'#18AFF5'}}>Clear</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const saveFile = async () => {
    const workbook = XLSX.utils.book_new();

    const filterRstType = resultType.filter(item => item.checked);
    const filterRstdata = resultData.filter(item => item.checked);
    const filename = Date.now();

    filterRstdata.forEach((item) => {
      const sheetData = filterRstType.map((aItem, index) => [index + 1, aItem.name, aItem.time]);
    
      // Add sheet to workbook
      const sheet = XLSX.utils.aoa_to_sheet([['Device: ' + item.device], ['No', 'Name', "Date"], ...sheetData]);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet' + (filterRstdata.indexOf(item) + 1));
    });

    const fileContent = XLSX.writeXLSX(workbook, { type: 'base64' });
    try {
      const permissions_ =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions_.granted) {
        return;
      }
      console.log("@@@@@@",permissions_.directoryUri)
      const uri = await StorageAccessFramework.createFileAsync(
        `${permissions_.directoryUri}/Techwelt`,
        `${filename}.xlsx`,
        'xlsx',
      );
      await FileSystem.writeAsStringAsync(uri, fileContent, {encoding: FileSystem.EncodingType.Base64,});
      console.log(uri);
    } catch (ignore) {
      console.log("Save Error")
    }
    // saveDataToXLS(tempNotiData);
  }

  const saveDataToXLS = async (data) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    const fileContent = XLSX.write(workbook, { type: 'base64' });
    // const filePath = `${FileSystem.documentDirectory}tempNotiData.xls`;
    // const filePath = `${RNFS.ExternalStorageDirectoryPath}/Download/tempNotiData.xls`;
    ///////////////////////
    try {
      const permissions_ =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions_.granted) {
        return;
      }
      console.log("@@@@@@",permissions_.directoryUri)
      const uri = await StorageAccessFramework.createFileAsync(
        `${permissions_.directoryUri}/Techwelt`,
        'tempNotiData.xls',
        'xls',
      );
      await FileSystem.writeAsStringAsync(uri, fileContent, {encoding: 'utf8'});
      console.log(uri);
    } catch (ignore) {}
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back="true" screenName={t('reports')} curNavigation={navigation}></Header>

      <View style={{flexDirection:'row', alignSelf:'center', width:wp('97%'), marginTop:3}}>
        <View style={{ borderWidth: 1, flex:1, marginRight:5, borderRadius: 10, borderColor: "#A9A9A9", backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'center' }}>
            <TextInput placeholder={t('search_vehicle')} style={{ flex:1, marginLeft: 10, marginRight:10, zIndex: 9 }}
              value={searchText}
              onChangeText={changeText}
            />
          </View>
        </View>
        <View style={{height:40, justifyContent:'center', alignSelf:'flex-end'}}>
          <ModalDropdown
            options={dropdownOptions}
            dropdownStyle={{ borderRadius:10, width:170, borderColor:'#7A7D8B', height:400, backgroundColor:'white'}}
            renderRow={() => renderDropdownReportType()}>
            <Image source={require('../../../assets/report_type.png')} style={{width:66, height:30}} ></Image>
          </ModalDropdown>
        </View>

        <TouchableOpacity style={{width:50, alignItems:'center'}}
          onPress={() => saveFile()}
        >
          <View style={{height:40, justifyContent:'center'}}>
            <Image source={require('../../../assets/share.png')} style={{width: 35, height:35 }} ></Image>
          </View>
        </TouchableOpacity>
      </View>
  
      <View style={{flexDirection:'row',alignSelf:'center', width:wp('96.8%'), marginTop:12}}>
        <ModalDropdown
          options={dropdownOptions}
          dropdownStyle={{ borderRadius:10, width:wp('96.8%'), borderColor:'transparent', height:330, backgroundColor:'transparent'}}
          renderRow={() => renderDropdownCalendar("From")}>
          <TextInput editable={false} placeholder={t('from')} style={[styles.searchTxt,{ height:30, width:120 , marginRight:12 }]} value={fromDate}/>
          <Image source={require('../../../assets/calendar.png')} style={{position:'absolute', left:90, top:13, width: 17, height:17}} ></Image>
        </ModalDropdown>
        <ModalDropdown
          options={dropdownOptions}
          dropdownStyle={{ borderRadius:10, marginLeft:-wp('96.8%') + 230, width:wp('96.8%'), borderColor:'transparent', height:330, backgroundColor:'transparent'}}
          renderRow={() => renderDropdownCalendar("To")}>
          <TextInput editable={false} placeholder={t('to')} style={[styles.searchTxt,{ height:30, width: 120, marginRight:26 }]} value={toDate} />
          <Image source={require('../../../assets/calendar.png')} style={{position:'absolute', left:90, top:13, width: 17, height:17}} ></Image>
        </ModalDropdown>
      </View>

      {/* {showCalendar &&
      <DateRangePicker
          onSelectDateRange={(range) => {
            // setRange(range);
          }}
          blockSingleDateSelection={true}
          responseFormat="YYYY-MM-DD"
          maxDate={moment()}
          minDate={moment().subtract(100, "days")}
          selectedDateContainerStyle={styles.selectedDateContainerStyle}
          selectedDateStyle={styles.selectedDateStyle}
      />} */}


      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: wp('97%'), marginTop: 21 }}>
        {/* <TouchableOpacity
          onPress={handleCheckAllResult(true)}>
          <View style={{width:17,height:17, position:'absolute', left:15, borderColor:'#7A7D8B',borderRadius:4,borderWidth:2}}>
            {resultData.filter(item => item.checked === true).length === resultData.length &&
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="check-bold" size={11} color="red" />
            </IconComponentProvider>}
          </View>
        </TouchableOpacity> */}
        <Text style={[styles.listHeader,{width:wp('40%')-15}]}>{t('vehicle')}</Text>
        <Text style={[styles.listHeader,{width:wp('30%')}]}>{t('device')}</Text>
        <Text style={[styles.listHeader,{width:wp('30%')}]}>Time</Text>
      </View>

      <View style={{width:wp('100%'), height:hp('100%')-285, paddingBottom:10}}>
        <ReportList></ReportList>
      </View>

      {isShowTypeList && <View style={{borderRadius:7, position:'absolute', backgroundColor:'white', width:170, 
        borderWidth:1, borderColor:'rgba(122, 125, 139, 1)', top:125, right:10 }}>
          <FlatList 
            data={resultType}
            renderItem={({ item,index }) => renderTypeItem(item,index)}
          />
        </View>}

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
    color:'#7A7D8B', fontSize:12,
    marginTop:5
  },
  imgSearch: {
    resizeMode:'contain',
    width: 32,
    height: 32,
    alignSelf: 'center',
    justifyContent:'center'
  },
  listHeader: {
    fontSize: 14,
    fontWeight:'bold',
    color: '#7A7D8B',
    alignSelf: 'center',
    textAlign: 'center',
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#DFE0EB", borderRadius: 10, borderWidth:1,
    backgroundColor: 'white',
    width: wp('97%'),
    height:50,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  listString: {
    fontSize: 12,
    color: '#7A7D8B',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
