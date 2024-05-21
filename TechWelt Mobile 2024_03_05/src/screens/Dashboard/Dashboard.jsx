import React,{useState} from "react";
import { StatusBar,Text, Image, StyleSheet, ScrollView, Alert,
   TouchableOpacity, View} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from "react-i18next";
import { logout } from '../../actions/auth';
import { toastr } from "../../services/navRef";
import ModalDropdown from 'react-native-modal-dropdown';

export default function Dashboard({ navigation }) {
  const {i18n} = useTranslation()
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const userReducer = useSelector(state => state.auth);
  const [image, setImage] = useState(userReducer?.user?.image);

  const gotoUsersPage = () => {
    if(userReducer.user.role === "Admin" || userReducer.user.role === "Manager") {
      navigation.navigate('Users');
    } else {
      toastr(t('access_denied'));
    }
  } 
  
  const renderDropdownRow = () => {
    return (
      <View style={{flexDirection:"column", padding:5, borderRadius:10}}>
        <TouchableOpacity style={{flex:1 }} 
          onPress={() => {
            Alert.alert(
              t('warning'),
              t('are_you_going_to_logout'),
              [
                {
                  text: t('yes'),
                  onPress: () => dispatch(logout(navigation)) ,
                },
                {
                  text: t('no'),
                  onPress: () => console.log("cancel"),
                },
              ],
            );
          }} >
          <View style={{ height:25, marginLeft:2, marginTop:3, flexDirection: 'row', alignItems: 'center' }}>
            <IconComponentProvider IconComponent={MaterialCommunityIcons}>
              <Icon name="logout" size={20} color="#1E6B96" style={{alignSelf:'center'}} />
            </IconComponentProvider>
            <Text style={[styles.menuString, {marginLeft:3, color:'#1E6B96', fontSize:15, fontWeight:'600'}]}>{t('logout')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex:1 }} onPress={() => { navigation.navigate('Profile') }}>
          <View style={{ height:25, flexDirection: 'row', alignItems: 'center' }}>
            <Image 
              source={require("../../../assets/vehicle_setting.png")} 
              style={{width: 25, height: 16, resizeMode: 'contain' }}/> 
            <Text style={[styles.menuString,{color:'#1E6B96', fontSize:15, fontWeight:'600'}]}>{t('settings')}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const dropdownOptions = ['sss'];


  return (
    <View style={{flex:1, backgroundColor:'#EBECF0'}}>
      <StatusBar backgroundColor={"#EBECF0"} barStyle={"dark-content"} />
      <View style={{flexDirection:'row', width:'100%',height: 85,
        backgroundColor:'#EBECF0' }}>
        <Text style={{ color:'#364153', fontWeight:'bold', fontSize: 15, marginTop:55, 
                      position:'absolute', left: 20, top:5}}>Hello, {userReducer?.user?.lname}</Text>

        <Text style={{ flex:1, textAlign:'center', position:'absolute', width:wp('100%'),
        marginTop:20, fontSize:15, fontWeight:'600', color:'#364153'}}>{t('dashboard')}</Text>
        <ModalDropdown
          options={dropdownOptions}
          dropdownStyle={{backgroundColor:'white', height:65, borderRadius:7, marginLeft:wp('100%')-95, marginTop:5}} // Change the position of the modal here
          renderRow={() => renderDropdownRow()}>
          {image ? 
          <Image style={{ borderRadius:6, width:40, height:40, marginLeft:wp('100%') - 60, marginTop:40}} source={{uri: image}}></Image>
          :
          <Image style={{ borderRadius:6, width:40, height:40, marginLeft:wp('100%') - 60, marginTop:40}} source={require('../../../assets/profile_avatar.png')}></Image>
          }        
        </ModalDropdown>
      </View>

      <Text style={{ width:wp('90%'), alignSelf:'center', height:1, backgroundColor:'#364153', marginTop:2 }}></Text>

      <ScrollView>
        <View style={[styles.v1, {marginTop:30}]}>
          <TouchableOpacity onPress={() => {navigation.navigate('Locations', { "infos": null})}}>
            <View style={styles.v2}>
              <Image style={styles.img} source={require('../../../assets/dashboard_locations.png')}></Image>
              <Text style={styles.txtLabel}>{t('locations')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Vehicle_List')}}>
            <View style={[styles.v2, {marginLeft:20}]}>
              <Image style={styles.img} source={require('../../../assets/dashboard_vehicles.png')}></Image>
              <Text style={styles.txtLabel}>{t('vehicles')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.v1}>
          <TouchableOpacity onPress={() => {gotoUsersPage()}}>
            <View style={styles.v2}>
              <Image style={styles.img} source={require('../../../assets/dashboard_user.png')}></Image>
              <Text style={styles.txtLabel}>{t('users')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate('Notification')}}>
            <View style={[styles.v2, {marginLeft:20}]}>
              <Image style={styles.img} source={require('../../../assets/dashboard_alerts.png')}></Image>
              <Text style={styles.txtLabel}>{t('alerts')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.v1}>
          <TouchableOpacity onPress={() => {navigation.navigate('Report')}}>
            <View style={styles.v2}>
              <Image style={styles.img} source={require('../../../assets/dashboard_reports.png')}></Image>
              <Text style={styles.txtLabel}>{t('reports')}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.v2, {marginLeft:20}]}>
            <Image style={styles.img} source={require('../../../assets/dashboard_tickets.png')}></Image>
            <Text style={styles.txtLabel}>{t('tickets')}</Text>
          </View>
        </View>

        <View style={styles.v1}>
          <TouchableOpacity onPress={() => {navigation.navigate('History',{"infos" : undefined})}}>
            <View style={styles.v2}>
              <Image style={styles.img} source={require('../../../assets/dashboard_history.png')}></Image>
              <Text style={styles.txtLabel}>{t('history')}</Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.v2, {marginLeft:20}]}>
            <Image style={styles.img} source={require('../../../assets/dashboard_rules.png')}></Image>
            <Text style={styles.txtLabel}>{t('rules')}</Text>
          </View>
        </View>

       </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  v1: {
    flexDirection:'row', alignSelf:'center', marginTop:15
  },
  v2: {
    alignItems:'center',
    flexDirection:'row',
    borderWidth: 1,
    borderColor: '#364153',
    backgroundColor: '#364153',
    borderRadius: 10,
    width: wp('44%'),
    height: (hp('100%') - 200 - 15 * 4) / 4,
  },
  img: {
    width:40, height:40, resizeMode:'contain', marginLeft:10
  },
  txtLabel: {
    marginLeft:10, color:'white', fontSize:16, fontWeight:'500'
  }
});