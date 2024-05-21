import React, { useState, useEffect } from "react";
import { Alert, View, Text, TextInput, StatusBar, StyleSheet, 
  TouchableOpacity, Image, FlatList } from "react-native";
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-virtualized-view';
import { useFocusEffect } from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';
import Menu, { MenuTrigger, MenuProvider, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Header from "../Header";
import BottomTab from "../BottomTab";
import { navigationRef } from "../../services/navRef";
import { userList, deleteUser, activateUser} from '../../actions/user';
import ModalDropdown from 'react-native-modal-dropdown';
import { toastr } from '../../services/navRef';

export default function Users({ navigation }) {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const authReducer = useSelector(state => state.auth);
  const userReducer = useSelector(state => {
    return state.user
  });

  const [searchText, setSearchText] = React.useState("");
  const changeText = (newText) => {
    setSearchText(newText);
  };

  useEffect(() => {
    console.log("UserList Page Init:")
    dispatch(userList(authReducer.token, authReducer.user._id));
  }, []);

  const handleDeleteUser = (email) => {
    dispatch(deleteUser(authReducer.token, authReducer.user._id, email, navigation));
  };

  const handleActivateUser = (item) => {
    console.log(item)
    if(authReducer.user.role !== "Admin" && item.role === "Admin") {
      toastr(t("access_denied"));
      return;
    }
    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      email: item.email,
      activate: true === item.verified ? false : true
    }

    console.log("@SendData : ", sendData)
    dispatch(activateUser(sendData, navigation));
  };


  useFocusEffect(React.useCallback(() => {}, []));

  function filterData(data) {
    // console.log("!!!", data)
    //return data;
    return data.filter(
        function (item) {
            if (item.lname.toLowerCase().includes(searchText.toLowerCase())) {
                return item;
            }
            if (item.lname.toLowerCase().includes(searchText.toLowerCase())) {
                return item;
            }
        }
    );
  }

  const dropdownOptions = ['Menu'];
  const renderDropdownRow = (data) => {
    return (

      <View style={{flexDirection:"column", padding:5, borderRadius:10}}>
        <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('User_Detail', { "infos": data, "index" : 0}) }}>
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_view.png")} 
              style={{width: 25, height: 16, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('view')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('User_Edit', { "infos": data, "index" : 0}) }}>
          <View style={{ height:25, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_edit.png")} 
              style={{width: 25, height: 16, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('edit')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
            Alert.alert(
              t('warning'),
              t('are_you_going_to_delete_this_user'),
              [
                {
                  text: t('yes'),
                  onPress: () => handleDeleteUser(data.email),
                },
                {
                  text: t('no'),
                  onPress: () => console.log("cancel"),
                },
              ],
            );
          }} >
          <View style={{ height:25, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_delete.png")} 
              style={{width: 25, height: 17, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('delete')}</Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('User_Edit', { "infos": data, "index" : 0}) }}> */}
          <View style={{ height:30, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/assign_vehicle.png")} 
              style={{width: 25, height: 18, resizeMode: 'contain' }}/> 
            <Text style={styles.menuString}>{t('assign_vehicle')}</Text>
          </View>
        {/* </TouchableOpacity> */}
        {(data.verified === true) ?
        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
            Alert.alert(
              t('warning'),
              t('are_you_going_to_deactivate_this_user'),
              [
                {
                  text: t('yes'),
                  onPress: () => handleActivateUser(data),
                },
                {
                  text: t('no'),
                  onPress: () => console.log("cancel"),
                },
              ],
            );
        }} >
          <View style={{ height:30, marginLeft:5, flexDirection: 'row', alignItems: 'center' }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="block-helper" size={17} color="#FF3062" style={{}} />
            </IconComponentProvider>
            <Text style={[styles.menuString, {marginLeft:8}]}>{t('deactivate')}</Text>
          </View>
        </TouchableOpacity>
        :
        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
            Alert.alert(
              t('warning'),
              t('are_you_going_to_activate_this_user'),
              [
                {
                  text: t('yes'),
                  onPress: () => handleActivateUser(data),
                },
                {
                  text: t('no'),
                  onPress: () => console.log("cancel"),
                },
              ],
            );
        }} >
          <View style={{ height:30,  marginLeft:5,flexDirection: 'row', alignItems: 'center' }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="circle-outline" size={20} color="#63D16E" style={{}} />
            </IconComponentProvider>
            <Text style={[styles.menuString]}>{t('active')}</Text>
          </View>
        </TouchableOpacity>
        }

      </View>
    );
  }

  const UserItem = (item, index) => {
    // console.log("@@@ User Item", item)
    return (
        <View style={[styles.listItem]}>
          <Text style={[styles.listString,{width:100}]}>{item.lname}</Text>
          <Text style={[styles.listString,{flex:1}]}>{item.fname}</Text>
          { item.verified === true ?
          <Text style={[styles.listString,{width:100, color:'#63D16E'}]}>{t("active")}</Text>
          :
          <Text style={[styles.listString,{width:100, color:'#FF3062'}]}>{t("deactivate")}</Text>
          }
          <View style={{width:40}}>
            <ModalDropdown
              options={dropdownOptions}
              dropdownStyle={{width:130, height:155, borderRadius:10, elevation:10, shadowColor:'black', top: 100, right: 30 }} // Change the position of the modal here
              renderRow={() => renderDropdownRow(item)}>
              <Image
                source={require("../../../assets/menu_ico.png")} 
                style={{alignSelf:'center', width: 16, height: 25, resizeMode: 'contain' }}/> 
            </ModalDropdown>
          </View>
        </View>
    )
  }


  const UserList = () => {
    if (!userReducer.userList || userReducer.userList.length === 0) {
      return (
        <View style={{ flex: 1, alignSelf: 'center' }}>
          <Text style={{ alignItems: 'center', marginTop: hp('30%') }}>No Users</Text>
        </View>
      )
    } else {
      let data = userReducer.userList.users.filter(obj => obj._id !== authReducer.user._id);
      if(authReducer.user.role === 'Admin'){
        data = data.filter(item => item.role !== 'Admin');
      }
      if(authReducer.user.role === 'Manager'){
        data = data.filter(item => item.role !== 'Admin' && item.role !== 'Manager');
      }
      return (
        <MenuProvider style={{ flex:1, width:wp('97%'), alignSelf:'center', marginTop:10, marginBottom:200}}>
          < FlatList
            data={filterData(data)}
            renderItem={({ item, index }) => UserItem(item, index)}
          />
        </MenuProvider> 
      )
    }
    
  }

  return (
    <View style={{ backgroundColor: "#F1F4FA" }}>
      <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
      <Header back='true' screenName={t('users')} curNavigation={navigation}></Header>
      <View style={{flexDirection:'row', alignSelf:'center', width:wp('97%'), marginTop:5}}>
        <View style={{ borderWidth: 1, width: wp('85%'), borderRadius: 10, borderColor: "#A9A9A9" }}>
          <View style={{ flexDirection: 'row', marginVertical: 5, alignItems: 'center' }}>
            <TextInput placeholder={t('search_user')} style={{ width: wp('72%'), paddingLeft:10, marginLeft: 5, zIndex: 9 }}
              value={searchText}
              onChangeText={changeText}
            />
          </View>
        </View>
        <TouchableOpacity style={{flex:1 }}
          onPress={() => { navigation.navigate('User_Add') }}
        >
          <View style={{backgroundColor:'#454D56', width:40, height:40, borderRadius:20, justifyContent:'center', alignSelf:'flex-end'}}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="plus" size={22} color="white" style={{alignSelf:'center'}} />
            </IconComponentProvider>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', width:wp('100%')- 20, alignSelf:'center', alignItems: 'center', justifyContent: 'center', marginTop: 25 }}>
        <Text style={[styles.listHeader,{width:100}]}>{t('name')}</Text>
        <Text style={[styles.listHeader,{flex:1}]}>{t('username')}</Text>
        <Text style={[styles.listHeader,{width:100}]}>{t('status')}</Text>
        <Text style={[styles.listHeader,{width:40}]}></Text>

      </View>

      <View style={{width:wp('100%')}}>
        <ScrollView>
        <UserList/>
        </ScrollView>
      </View>
    </View>
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
    color:'#1E6B97', fontSize:12,
    marginTop:5
  },
  imgSearch: {
    resizeMode:'contain',
    width: 30,
    height: 32,
    alignSelf: 'center',
    justifyContent:'center'
  },
  listHeader: {
    fontSize: 14,
    fontWeight:'600',
    color: '#1E6B97',
    alignSelf: 'center',
    textAlign: 'center',
  },
  listItem: {
    marginLeft:10, marginRight:10,marginTop:3,
    width:wp('100%') - 20,
    height:45,
    elevation:5,
    flexDirection: 'row',
    backgroundColor: "white",
    borderRadius: 4,
    alignSelf: 'center',
    alignItems: 'center',
  },
  listString: {
    fontSize: 12,
    fontWeight:'500',
    color: '#1E6B97',
    alignSelf: 'center',
    textAlign: 'center',
  },
  menuOptions: {
    alignItems: 'center',
    marginTop: -160,
    width:130,
    borderRadius: 8
  },
  menuString: {
    marginLeft:5,
    fontSize: 12,
    fontWeight:'bold',
    color:'#1E6B97'
  },

});
