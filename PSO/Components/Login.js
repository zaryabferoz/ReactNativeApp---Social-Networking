import * as React from 'react';
import { Component } from 'react';
import * as Font from 'expo-font';
import firebase from 'firebase';
import { Text, View, TouchableOpacity, TextInput, ActivityIndicator, Dimensions, ToastAndroid, Keyboard, Image, StyleSheet, TouchableHighlight, FlatList, Alert, SafeAreaView, SectionList, TouchableWithoutFeedback, TouchableWithoutFeedbackBase } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Appbar, List, Colors, Badge, Card, Title, Paragraph, Avatar, IconButton, Button, ToggleButton, TouchableRipple, Dialog, Portal, Snackbar, Chip } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons, Entypo, AntDesign, FontAwesome5, FontAwesome, Octicons, Fontisto } from '@expo/vector-icons';
import { Provider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger, Touchable } from 'react-native-popup-menu';
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync, } from 'expo-ads-admob';
import Constants from 'expo-constants';
import SearchScreen from './SearchScreen'
import ProfileCreation from './Screens/ProfileCreation'
import Interest from './Screens/Interest';
import ChatMessages from './Screens/ChatMessage';
import { createStackNavigator } from '@react-navigation/stack';
import ChatBox from './Chatbox';

import { LogBox } from 'react-native';
import { ThemeColors } from 'react-navigation';

const testID = 'ca-app-pub-6610588175793499/1614410287';

LogBox.ignoreLogs(['Setting a timer']);

var logopso = require('./logopso.png');

const Tab = createBottomTabNavigator();

const ChangeView = createStackNavigator();


export default class Login extends Component {

    render() {

        return (

            <View style={{ backgroundColor: "#fff" }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width, height: '100%' }}><Appss /></View>
            </View>

        );

    }
}

function Appss(props) {
    return (


        <Tab.Navigator initialRouteName="Home" showLabel="false"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search';
                        return <Ionicons name={iconName} size={30} color={color} />;
                    } else if (route.name === 'Messages') {
                        iconName = focused ? 'message-text-outline' : 'message-text-outline';
                        return <MaterialCommunityIcons name={iconName} size={29} color={color} />;
                    } else if (route.name === 'Home') {
                        iconName = focused ? 'home-variant' : 'home-variant';
                        return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
                    } else if (route.name === 'Interests') {
                        iconName = focused ? 'heart' : 'heart-outline';
                        return <MaterialCommunityIcons name={iconName} size={29} color={color} />;
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account-circle' : 'account-circle';
                        return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
                    }
                },
            })}
            tabBarOptions={{
                showLabel: false,
                style: { height: 50, paddingTop: 3, paddingBottom: 3 },
                activeTintColor: '#00cafd',
                inactiveTintColor: '#b8b8b8',
            }}
        >
            <Tab.Screen options={{ unmountOnBlur: true }} name="Search" component={SettingsScreen} />
            <Tab.Screen options={{ unmountOnBlur: true }} name="Messages" component={MessagesScreen} />
            <Tab.Screen options={{ unmountOnBlur: true }} name="Home" component={HomeScreen} />
            <Tab.Screen options={{ unmountOnBlur: true }} name="Interests" component={InterestsScreen} />
            <Tab.Screen options={{ unmountOnBlur: true }} name="Profile" component={ProfileScreen} />
        </Tab.Navigator>


    );
}

class HomeScreen extends React.Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width }}><Viewacc /></View>
            </View>
        );
    }

}

function Viewacc() {
    return (
        <ChangeView.Navigator initialRouteName="Main" screenOptions={{ headerShown: false, animationEnabled: false, }}>
            <ChangeView.Screen name="Main" component={Main} />
            <ChangeView.Screen name="LatestU" component={LatestUserScreen} />
            <ChangeView.Screen name="ViewUser" component={ViewProfile} />
            <ChangeView.Screen name="MessageUser" component={MessageProfile} />
            <ChangeView.Screen name="ViewPre" component={ViewPremi} />
            <ChangeView.Screen name="AboutUs" component={AboutPage} />
            <ChangeView.Screen name="GuideUs" component={GuidePage} />
            <ChangeView.Screen name="PayUs" component={PayPage} />
            <ChangeView.Screen name="FaqUs" component={FaqPage} />
            <ChangeView.Screen name="ContactUs" component={ContactPage} />
            <ChangeView.Screen name="Shadeeorg" component={Shadeeorg} />
        </ChangeView.Navigator>
    );
}

class Main extends React.Component {
    state = {
        msgt: 'All Messages',
        sallmsg: '0',
        sreceivedcounts: '0',
        record: [],
        accstatus: null,
        permit: false,
        visible: false,
        pmem: '0',
        loadedprofile: false,
        goahead: false,
        getchatid: [],
        readval: [],
        memstat:''
    }

    componentDidMount = () => {

        this.showstats();
        let suid = firebase.auth().currentUser.uid;
        firebase.firestore().collection('users').orderBy("timestamp", "desc").limit(3).get()
            .then(querySnapshot => {

                querySnapshot.forEach(documentSnapshot => {
                    const urecords = [];
                    const udata = documentSnapshot.data();
                    urecords.push(udata);
                    this.setState({ record: [...this.state.record, ...urecords] });
                    this.setState({ loadedprofile: true });
                });

            });

        firebase.firestore().collection('Chatrooms').doc(suid).collection('allchat').orderBy("timestamp", "desc").limit(1).get().then((querySnapshot) => {
            querySnapshot.docs.map((doc) => {
                var list = [];
                list.push(doc.id)
                this.setState({ getchatid: [...this.state.getchatid, ...list] });
            })
        }).then(() => {
            firebase.database().ref(`Messages/${suid}/${this.state.getchatid}/readstatus`).child('read').on('value', snapShot => {
                var r = [];
                r.push(snapShot.val());
                this.setState({ readval: [...this.state.readval, ...r] });
            
            }
            )
            if(this.state.memstat == 'deleted'){
                ToastAndroid.show("Access denied!",ToastAndroid.LONG,ToastAndroid.BOTTOM);
                firebase.auth().signOut()
            }
        });

    }

    showstats = () => {
        let suid = firebase.auth().currentUser.uid;
        firebase.database().ref(`Messages/${suid}`).on('value', snapShot => this.setState({ sallmsg: parseInt(snapShot.numChildren()) }));
        firebase.database().ref(`Interest/${suid}/Received`).on('value', snapShot => this.setState({ sreceivedcounts: parseInt(snapShot.numChildren()) }));

        firebase.database().ref('Premium').child('count').on('value', snapShot => this.setState({ pmem: parseInt(snapShot.val()) }));

        firebase.firestore()
            .collection('users').where('userid', '==', suid).get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const useraccstatus = documentSnapshot.data().accountStatus;
                    const usermemstatus = documentSnapshot.data().memberStatus;
                    this.setState({ accstatus: useraccstatus });
                    this.setState({ memstat: usermemstatus });
                    this.setState({ goahead: true });
                })
                        
            }
            ).then(()=>{
                this.permit();
            });

    }

    permit = () => {
        if (this.state.accstatus == "premium") {
            this.setState({ permit: true });
        }else {
            this.setState({ permit: false });
        }
    
    }

    useraccess = () => {
        this.state.permit ? (
            this.props.navigation.navigate('ViewPre')
        ) : (

            this.showDialog()

        );
    }

    showDialog = () => this.setState({ visible: true });

    viewrecent = () => {
        if (this.state.goahead == true) {
            this.state.sallmsg > 2 && this.state.accstatus == "notverified" ? (
                Alert.alert(
                    "Register Membership",
                    "Please visit main-menu to register your Membership and get best experience from Shadee.org app.",
                    [
                        {
                            text: "CLOSE",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                )
            ) : (this.props.navigation.navigate('LatestU'))
        }

    }


    deleteaccprofile = () => {
        Alert.alert(
            "Delete Account ?",
            "Your account deletion request will be sent to admin.\n\nBy pressing Confirm Delete button other users will not be able to see your profile or any other information.\n\nIt will take a while for complete account deletion.\n\nClick confirm to delete account !",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Confirm Delete", onPress: () => { this.confirmdel() } }
            ]

        );

    }

    confirmdel = () => {
        let suid = firebase.auth().currentUser.uid;
        let del = "deleted";

        firebase.firestore().collection("users").doc(suid).update({ 'memberStatus': del }).then(() => firebase.auth().signOut());
        ToastAndroid.show("Account Closed!",ToastAndroid.LONG,ToastAndroid.BOTTOM);

    }

    hideDialog = () => this.setState({ visible: false });

    hideprofile = () => {
        const suid = firebase.auth().currentUser.uid;
        var hidepro = 'hide';
        firebase.firestore().collection("users").doc(suid).update({ 'memberStatus': hidepro });
        ToastAndroid.show("Profile Hidden Now!",ToastAndroid.LONG,ToastAndroid.BOTTOM);
    }

    unhideprofile = () => {
        const suid = firebase.auth().currentUser.uid;
        var unhidepro = 'nothide';
        firebase.firestore().collection("users").doc(suid).update({ 'memberStatus': unhidepro });
        ToastAndroid.show("Profile is Public!",ToastAndroid.LONG,ToastAndroid.BOTTOM);
    }

    render() {
        let suid = firebase.auth().currentUser.uid;

        return (

            <ScrollView style={{ backgroundColor: "#fff", marginTop: -7 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ backgroundColor: '#fff', }}>

                    <View style={{ flexDirection: "row", height: 100, alignItems: 'center', justifyContent: 'center', paddingTop: 3 }}>

                        <View style={{ flex: 1, alignItems: 'flex-start', marginTop: 12, marginLeft: 20, width: '30%', }}>

                            <View>

                                <Menu>
                                    <MenuTrigger customStyles={{ triggerWrapper: { padding: 4 }, TriggerTouchableComponent: TouchableOpacity, triggerTouchable: { activeOpacity: 0.1 } }} text={<Feather name="menu" size={27} color="#00cafd" />} />
                                    <MenuOptions style={{ padding: 10, borderRadius: 30 }}>
                                        <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#00cafd' }}>MAIN MENU</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => this.props.navigation.navigate("AboutUs")} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}> <AntDesign name="team" size={19} color="#474747" />    ABOUT US</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => this.props.navigation.navigate("GuideUs")} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}> <Entypo name="lifebuoy" size={20} color="#474747" />    GUIDELINES</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => this.props.navigation.navigate("PayUs")} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}> <AntDesign name="idcard" size={19} color="#474747" />    MEMBERSHIP</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => this.props.navigation.navigate("FaqUs")} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}> <MaterialCommunityIcons name="ring" size={20} color="#474747" />    SHARE STORY</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => this.props.navigation.navigate("ContactUs")} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}> <AntDesign name="contacts" size={20} color="#474747" />    CONTACT US</Text>} />
                                    </MenuOptions>
                                </Menu>

                            </View>

                        </View>


                        <View style={{ flex: 4.5, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}><Image source={logopso} style={{ width: '93%', height: '93%', justifyContent: 'center', alignItems: 'center', marginTop: 4 }} /></View>

                        <View style={{ flex: 1, alignItems: 'flex-end', marginTop: 12, marginRight: 20, width: '30%', right: 0 }}>

                            <View>
                                <Menu>
                                    <MenuTrigger customStyles={{ triggerWrapper: { padding: 8 }, TriggerTouchableComponent: TouchableOpacity, triggerTouchable: { activeOpacity: 0.1 } }} text={<Feather name="settings" size={25} color="#00cafd" style={{ alignItems: 'flex-end' }} />} />
                                    <MenuOptions style={{ padding: 10, borderRadius: 30 }}>
                                        <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#00cafd' }}>SETTINGS</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => {
                                            Alert.alert(
                                                "HIDE / UN-HIDE PROFILE\n",
                                                "User can hide or un-hide their profile.\n\nIf you press 'HIDE' your profile will not appear in search. No user will be able to send you message or view your profile except users in your messages.\n\nPress 'UN-HIDE' to restore default.",
                                                [
                                                    {
                                                        text: "UN-HIDE PROFILE",
                                                        onPress: () => { this.unhideprofile() },

                                                    },
                                                    {
                                                        text: "HIDE PROFILE",
                                                        onPress: () => { this.hideprofile() },
                                                    }
                                                ]

                                            );
                                        }} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}><MaterialCommunityIcons name="shield-account-outline" size={20} color="#474747" />   HIDE PROFILE</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={this.deleteaccprofile} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}><Feather name="minus-circle" size={19} color="#474747" />   Delete Account</Text>} />
                                        <MenuOption customStyles={optionsStyles} onSelect={() => { firebase.auth().signOut(); }} text={<Text style={{ fontSize: 16, fontFamily: 'dmcapf', color: '#474747' }}><MaterialCommunityIcons name="logout-variant" size={20} color="#474747" />   Logout</Text>} />
                                    </MenuOptions>
                                </Menu>

                            </View>
                        </View>

                    </View>

                    <List.Item borderless={true} rippleColor="#fff"
                        title={<Text>{this.state.readval[0] == false ? (<Text><Octicons name="primitive-dot" size={14} color={'#fb0d9b'} />  </Text>) : (<Ionicons name="checkmark-done-sharp" size={1} color={"#00cafd"} />)}<Text>All Messages </Text></Text>}
                        left={() => <MaterialCommunityIcons name="message-text-outline" size={30} color="white" style={{ marginLeft: 15, marginRight: 15, paddingTop: 6 }} />}
                        right={props => <Badge size={33} style={{ marginTop: 2, alignItems: 'center', marginBottom: 3, marginRight: 2, backgroundColor: '#fff', color: '#fb1dba', fontWeight: 'bold' }} >{this.state.sallmsg}</Badge>}
                        onPress={() => {
                            this.props.navigation.navigate('Messages')
                        }}
                        style={{ backgroundColor: '#00cafd', borderRadius: 120, marginLeft: 18, marginRight: 16, padding: 14, marginBottom: 12, color: '#fff', fontSize: 20, marginTop: 4, }}
                        titleStyle={{ color: '#fff', fontSize: 19.3 }}
                    />

                    <List.Item borderless={true} rippleColor="#fff"
                        title="Interest Received"
                        left={props => <MaterialCommunityIcons name="heart" size={30} color="white" style={{ marginLeft: 15, marginRight: 15, paddingTop: 6 }} />}
                        right={props => <Badge size={33} style={{ marginTop: 2, alignItems: 'center', marginBottom: 3, marginRight: 2, backgroundColor: '#fff', color: '#fb1dba', fontWeight: 'bold' }} >{this.state.sreceivedcounts}</Badge>}
                        onPress={() => {
                            this.props.navigation.navigate('Interests')
                        }}
                        style={{ backgroundColor: '#00cafd', borderRadius: 120, marginLeft: 18, marginRight: 16, padding: 14, color: '#fff', fontSize: 20, }}
                        titleStyle={{ color: '#fff', fontSize: 19.3 }}
                    />

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: 14,
                            backgroundColor: '#fb0d9b',
                            width: '91%', height: 109, borderRadius: 12,
                        }}>
                            <View style={{ backgroundColor: '#fb0d9b', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 3, padding: 3.5, borderRadius: 0, borderColor: '#ffff00', marginBottom: 2, }}>
                                <FontAwesome name="star" size={26} color="#ffff00" style={{ marginTop: 7, marginRight: 6, paddingTop: 0, alignItems: 'center', justifyContent: 'center' }} />
                                <Text style={{
                                    padding: 0, fontSize: 20, color: "#ffff00", letterSpacing: -0.5
                                    , marginTop: 13, marginBottom: 2, fontFamily: 'dmcapf'
                                }}>TOP PROFILES</Text>
                            </View>
                            <View style={{ backgroundColor: '#dd0082', borderRadius: 8, marginTop: 8, width: '95.2%', padding: 5, paddingRight: 10, paddingLeft: 10, marginBottom: 30, marginBottom: 2, marginRight: 0.2 }} >

                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 2, padding: 3, marginBottom: 2 }}>

                                    <Text style={{ marginTop: 2, color: "#ffff00", fontSize: 15, letterSpacing: -0.4, fontFamily: 'dmcapf' }}><Ionicons name="person-sharp" size={16} color="#ffff00" /> {this.state.pmem} Members</Text>
                                    <TouchableOpacity onPress={this.useraccess}><Text style={{ marginTop: 2, color: "#ffff00", fontSize: 14, letterSpacing: -0.4, fontFamily: 'dmcapf', }}>VIEW ALL</Text></TouchableOpacity></View>
                                <Portal>
                                    <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                                        <Dialog.Title style={{ marginTop: 16, alignSelf: 'center', alignContent: 'center', justifyContent: 'center', color: "#ffff", paddingTop: 5 }}><Chip icon={() => <FontAwesome name="star" size={16} color="#fff" />} style={{ backgroundColor: '#00cafd' }} textStyle={{ color: '#fff' }}>TOP PROFILES</Chip> </Dialog.Title>
                                        <Dialog.Content style={{ marginTop: -18 }}>
                                            <Paragraph style={{ paddingTop: 3, color: "#787878", }}><Entypo name="dot-single" size={16} color="#787878" />Top Profiles are Premium Members and can only be viewed by Premium Account.</Paragraph>
                                            <Paragraph style={{ paddingTop: 10, color: "#787878", }}><Entypo name="dot-single" size={16} color="#787878" />Upgrade account membership to view all profiles. Please visit Main-menu to know more about Premium Membership.</Paragraph>
                                        </Dialog.Content>
                                    </Dialog>
                                </Portal>
                            </View>
                        </View>

                    </View>
                    <View style={{ marginTop: 16, marginLeft: 18, marginRight: 18, borderRadius: 12, backgroundColor: "#f3f3f3" }}>
                        <Text style={{ marginLeft: 14, marginRight: 15, paddingTop: 2, marginTop: 14, color: "#00cafd", fontSize: 18, letterSpacing: -0.4, fontFamily: 'dmcapf' }}> <Ionicons name="flash-outline" size={16} color="#00cafd" /> NEW MEMBERS </Text>

                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: "center", marginTop: 10, overflow: 'hidden', paddingBottom: 3, marginLeft: 6, marginRight: 3 }}>

                            {
                                this.state.loadedprofile ? (
                                    <ScrollView horizontal={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>{
                                        this.state.record.map(data => {
                                            return <View style={{ marginBottom: 1, marginTop: 1,  }}>
                                                <View horizontal={true} style={{ marginLeft: 3, marginRight: 3, height: 160, width: 108, }}>
                                                    <View style={{ borderWidth: 1, borderColor: "#f3f3f3", alignContent: 'center', marginLeft: 1, marginRight: 1, }}>

                                                        <TouchableOpacity onPress={() => {
                                                            if (this.state.sallmsg > 2 && this.state.accstatus == "notverified") {
                                                                Alert.alert(
                                                                    "Register Membership\n",
                                                                    "Please visit main-menu to register your Membership and get the best experience from Shadee.org app.",
                                                                    [
                                                                        {
                                                                            text: "CLOSE",
                                                                            onPress: () => console.log("Cancel Pressed"),
                                                                            style: "cancel"
                                                                        },
                                                                    ]

                                                                )

                                                            }
                                                            else { this.props.navigation.navigate('ViewUser', { useid: data.userid }) }
                                                        }}>


                                                            <View style={{ backgroundColor: '#fff', borderColor: '#00cafd', alignContent: "center", justifyContent: "center", borderWidth: 5, borderRadius: 90, padding: 4 }}><Avatar.Image source={{ uri: data.profileimage }} size={84} style={{ backgroundColor: '#d3d3d3', alignSelf: 'center' }} /></View>
                                                            <Text numberOfLines={1} style={{ alignContent: 'center', justifyContent: "center", alignSelf: 'center', fontFamily: "dmcapf", fontSize: 18.3, color: '#00cafd', marginTop: 9, letterSpacing: -0.2 }}>{data.name}</Text>
                                                            <Text numberOfLines={1} style={{ alignSelf: 'center', fontSize: 14, color: '#00cafd', marginTop: -3 }}>{data.age}, {data.city} </Text>

                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </View>
                                        })
                                    }</ScrollView>) : (
                                    <View><Text style={{ alignSelf: 'center', fontSize: 14, color: '#00cafd', marginTop: -3, }}><Entypo name="dots-three-horizontal" size={140} color="#fff" /></Text></View>
                                )
                            }

                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                            <TouchableOpacity borderless={true} rippleColor="#ffff" style={{ width: '30%', borderColor: '#00cafd', justifyContent: 'flex-end', marginLeft: 20, marginRight: 8, height: 36, marginTop: 2, backgroundColor: '#00cafd', alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginBottom: 9 }} onPress={this.viewrecent}>
                                <Text style={{ fontSize: 14, alignItems: 'center', justifyContent: 'center', color: '#fff' }}>View More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Profile') }}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00cafd', borderRadius: 120, marginLeft: 20, marginRight: 20, padding: 20, color: '#fff', fontSize: 20, marginBottom: 17, marginTop: 17 }}>
                            <Feather name="edit" size={26} color="#fff" style={{ marginRight: 15 }} />
                            <Text style={{ fontSize: 19, color: '#fff' }}>Edit / Manage Profile</Text>
                        </View>
                    </TouchableOpacity>



                </View>
            </ScrollView >
        );
    }
}

function InterestsScreen({ navigation }) {

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingLeft: 0, }}>

            <Interest />

        </View>

    );

}

function ProfileScreen({ navigation }) {

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            <ProfileCreation />

        </View>

    );
}

function SettingsScreen({ navigation }) {


    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingLeft: 0 }}>

            <SearchScreen />

        </View>


    );
}

function MessagesScreen({ navigation }) {

    return (

        <View style={{ flex: 1, backgroundColor: '#fff', paddingLeft: 0 }}>

            <ChatMessages />

        </View>
    );
}

class ViewPremi extends React.Component {
    state = {
        record: [],
        Loading: false,
        visible: false
    }

    componentDidMount = () => {
        this.renderProfiles();
    }

    renderProfiles = () => {

        firebase.firestore()
            .collection('users').where('accountStatus', '==', 'premium')
            .get()
            .then(querySnapshot => {

                querySnapshot.forEach(documentSnapshot => {
                    const urecords = [];
                    const udata = documentSnapshot.data();
                    urecords.push(udata);
                    this.setState({ record: [...this.state.record, ...urecords] });
                });

                this.setState({ loading: true });

            });

    }

    showDialog = () => this.setState({ visible: true });
    hideDialog = () => this.setState({ visible: false });

    render() {
        const { route, navigation } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: "row", height: 50, paddingTop: 10, paddingBottom: 10, justifyContent: 'center' }} >


                    <View style={{ flex: 1, marginLeft: 10, width: '20%', justifyContent: 'center', }}>
                        <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }} onPress={() => this.props.navigation.navigate('Main')}>
                            <MaterialIcons name="arrow-back-ios" size={20} color="#0dc8f6" style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5, }}>
                        <Text style={{ fontSize: 23, color: '#04c7f8', letterSpacing: -0.4 }}>Premium Profiles</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10, width: '20%', marginTop: -2, right: 0, justifyContent: 'center', }}>
                        <TouchableOpacity style={{ paddingRight: 10, paddingTop: 10, paddingBottom: 10, }} onPress={this.showDialog} ><View><Feather name="info" size={25} color="#0dc8f6" style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity>
                    </View>
                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                            <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: "#04b3df" }}> <MaterialIcons name="drag-indicator" size={14} color="#04b3df" /> Recent Profiles. </Dialog.Title>
                            <Dialog.Content style={{ marginTop: -18 }}>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Show only latest 20 Profiles</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />For more profiles click on search. </Paragraph>

                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {this.state.loading && this.state.record ? (
                        <>
                            <View style={{ marginLeft: '5%', marginRight: '5%', width: '90%', height: 57, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 90, marginTop: 18, borderWidth: 2, borderColor: '#00cafd' }}>
                                <TouchableWithoutFeedback >
                                    <Text style={{ fontSize: 17, alignItems: 'center', justifyContent: 'center', color: '#00cafd' }}> <FontAwesome name="star" size={18} color="#00cafd" />  ALL PREMIUM PROFILES :  </Text>
                                </TouchableWithoutFeedback>

                            </View>
                            <FlatList
                                style={{ flex: 1, padding: 5 }}
                                data={Object.assign(this.state.record)}
                                keyExtractor={(key, index) => key + index}
                                renderItem={(itemData) => {

                                    return <Card.Title
                                        title={itemData.item.name}
                                        titleStyle={[itemData.item.gender == 'Male' ? { fontfamily: "dmcapf", fontSize: 18, color: "#00cafd", marginTop: -3, marginLeft: - 3, textTransform: 'uppercase' } : { fontfamily: "dmcapf", fontSize: 18, color: "#fb0d9b", marginTop: -3, marginLeft: - 3, textTransform: 'uppercase' }]}
                                        subtitle={<Text>{itemData.item.city}<Entypo name="dot-single" size={14} color="#d3d3d3" />{itemData.item.age}<Entypo name="dot-single" size={14} color="#d3d3d3" />{itemData.item.height}' {itemData.item.heightin}" </Text>}
                                        subtitleStyle={{ padding: 0, fontSize: 13, marginTop: -6, marginLeft: -3 }}
                                        style={[itemData.item.gender == 'Male' ? { padding: 0, marginTop: 9, marginBottom: 4, marginLeft: 14, marginRight: 14, borderRadius: 12, borderColor: '#00cafd', backgroundColor: "#f3f3f3" } : { padding: 0, marginTop: 9, marginBottom: 4, marginLeft: 14, marginRight: 14, borderRadius: 12, backgroundColor: '#f3f3f3' }]}
                                        left={(props) => <Avatar.Image source={{ uri: itemData.item.profileimage }} size={50} color="#00cafd" style={{ margin: -7, backgroundColor: "#e4e4e4" }} />}
                                        right={(props) => <TouchableOpacity style={[itemData.item.gender == 'Male' ? { width: 108, height: 40, backgroundColor: '#0dc8f6', alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 8, marginTop: 0.3 } : { width: 108, height: 40, backgroundColor: '#fb0d9b', alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 8, marginTop: 0.3 }]} onPress={() => this.props.navigation.navigate('ViewUser', { useid: itemData.item.userid })}>
                                            <Text style={{ fontSize: 14, alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Visit Profile</Text>
                                        </TouchableOpacity>}
                                    />
                                }
                                }
                            />
                        </>
                    ) : (
                        <View
                            style={{ flex: 1, justifyContent: "center", alignItems: "center", fontSize: 300, marginTop: 90, }}
                        >
                            <Text><ActivityIndicator size="large" color="#d3d3d3" /></Text>
                        </View>
                    )}
                </ScrollView>


            </View>
        );

    }
}

class LatestUserScreen extends React.Component {
    state = {
        record: [],
        Loading: false,
        visible: false,
        color: '#f3f3f3'
    }

    componentDidMount = () => {
        this.renderProfiles();
    }

    renderProfiles = () => {

        firebase.firestore()
            .collection('users').orderBy("timestamp", "desc").limit(20)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const urecords = [];
                    const udata = documentSnapshot.data();
                    const ugender = documentSnapshot.data().gender;
                    let Male = 'Male';
                    if (ugender === Male) { this.setState({ color: '#00cafd' }) } else { this.setState({ color: '#fb0d9b' }) }
                    urecords.push(udata);
                    this.setState({ record: [...this.state.record, ...urecords] });
                });

                this.setState({ loading: true });
            });

    }

    showDialog = () => this.setState({ visible: true });
    hideDialog = () => this.setState({ visible: false });

    render() {
        const { route, navigation } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ flexDirection: "row", height: 50, paddingTop: 10, paddingBottom: 10, justifyContent: 'center' }} >


                    <View style={{ flex: 1, marginLeft: 10, width: '20%', justifyContent: 'center', }}>
                        <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }} onPress={this.showDialog}>
                            <Feather name="info" size={25} color="#0dc8f6" style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5, }}>
                        <Text style={{ fontSize: 23, color: '#04c7f8', letterSpacing: -0.4 }}>Recent Profiles</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10, width: '20%', marginTop: -2, right: 0, justifyContent: 'center', }}>
                        <TouchableOpacity style={{ paddingRight: 10, paddingTop: 10, paddingBottom: 10, }} onPress={() => this.props.navigation.navigate('Main')} ><View><MaterialIcons name="close" size={27} color="#0dc8f6" style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity>
                    </View>

                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                            <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: "#04b3df" }}> <MaterialIcons name="drag-indicator" size={14} color="#04b3df" /> Recent Profiles. </Dialog.Title>
                            <Dialog.Content style={{ marginTop: -18 }}>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Show only latest 20 Profiles</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />For more profiles click on search. </Paragraph>

                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {this.state.loading && this.state.record ? (
                        <>
                            <View style={{ marginLeft: '5%', marginRight: '5%', width: '90%', height: 57, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderRadius: 90, marginTop: 18, borderWidth: 2, borderColor: '#00cafd' }}>
                                <TouchableWithoutFeedback >
                                    <Text style={{ fontSize: 15, alignItems: 'center', justifyContent: 'center', color: '#00cafd' }}> <Ionicons name="person-sharp" size={18} color="#00cafd" />  SHOWING RECENT : UPTO 20 PROFILES  </Text>
                                </TouchableWithoutFeedback>

                            </View>
                            <FlatList
                                style={{ flex: 1, padding: 5 }}
                                data={Object.assign(this.state.record)}
                                keyExtractor={(key, index) => key + index}
                                renderItem={(itemData) => {

                                    return <Card.Title
                                        title={itemData.item.name}
                                        titleStyle={[itemData.item.gender == 'Male' ? { fontfamily: "dmcapf", fontSize: 18, color: "#00cafd", marginTop: -3, marginLeft: - 3, textTransform: 'uppercase' } : { fontfamily: "dmcapf", fontSize: 18, color: "#fb0d9b", marginTop: -3, marginLeft: - 3, textTransform: 'uppercase' }]}
                                        subtitle={<Text>{itemData.item.city}<Entypo name="dot-single" size={14} color="#d3d3d3" />{itemData.item.age}<Entypo name="dot-single" size={14} color="#d3d3d3" />{itemData.item.height}' {itemData.item.heightin}" </Text>}
                                        subtitleStyle={{ padding: 0, fontSize: 13, marginTop: -6, marginLeft: -3 }}
                                        style={[itemData.item.gender == 'Male' ? { padding: 0, marginTop: 9, marginBottom: 4, marginLeft: 14, marginRight: 14, borderRadius: 12, borderColor: '#00cafd', backgroundColor: '#f3f3f3' } : { padding: 0, marginTop: 9, marginBottom: 4, marginLeft: 14, marginRight: 14, borderRadius: 12, borderColor: '#fb0d9b', backgroundColor: '#f3f3f3' }]}
                                        left={(props) => <Avatar.Image source={{ uri: itemData.item.profileimage }} size={50} color="#00cafd" style={{ margin: -7, backgroundColor: "#e4e4e4" }} />}
                                        right={(props) => <TouchableOpacity style={[itemData.item.gender == 'Male' ? { width: 108, height: 40, backgroundColor: '#0dc8f6', alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 8, marginTop: 0.3 } : { width: 108, height: 40, backgroundColor: '#fb0d9b', alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 8, marginTop: 0.3 }]} onPress={() => this.props.navigation.navigate('ViewUser', { useid: itemData.item.userid })}>
                                            <Text style={{ fontSize: 14, alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Visit Profile</Text>
                                        </TouchableOpacity>}
                                    />
                                }
                                }
                            />
                        </>
                    ) : (
                        <View
                            style={{ flex: 1, justifyContent: "center", alignItems: "center", fontSize: 300, marginTop: 90, }}
                        >
                            <Text><ActivityIndicator size="large" color="#d3d3d3" /></Text>
                        </View>
                    )}
                </ScrollView>


            </View>
        );

    }
}

class ViewProfile extends React.Component {

    state = {
        visible: false,
        userinfos: [],
        link: '',
        show: false,
        showinterest: false,
        usernamebyid: null,
        color: '#fcfcfc',
        colortwo: '#fcfcfc',
        colorthree: '#fcfcfc',
        accstatus: "-"
    }

    componentDidMount() {
        const { route, navigation } = this.props;
        const userd = route.params.useid;
        this.setState({ usernamebyid: userd });

        this.loadprofile(userd);
    }

    loadprofile = (userd) => {
        const userdata = [];
        firebase.firestore()
            .collection('users').where('userid', '==', userd).get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const useraccstatus = documentSnapshot.data().accountStatus;
                    this.setState({ accstatus: useraccstatus });
                    this.setState({ link: documentSnapshot.data().profileimage });

                    const usergender = documentSnapshot.data().gender;
                    let Male = 'Male';
                    if (usergender === Male) { this.setState({ color: '#00cafd' }); this.setState({ colortwo: '#fb0d9b' }); this.setState({ colorthree: '#fd86cd' }) } else { this.setState({ color: '#fb0d9b' }); this.setState({ colortwo: '#00cafd' }); this.setState({ colorthree: '#a3ebfd' }) }

                    const userdetail = documentSnapshot.data();
                    userdata.push(userdetail);
                    this.setState({ userinfos: [...userdata] });

                })
            })
    }

    UserReport = () => {
        const { route, navigation } = this.props;
        const userd = route.params.useid;
        const suid = firebase.auth().currentUser.uid;

        Alert.alert(
            "Do you want to report this user ?\n",
            "If this Profile User is inappropriate click Report User. Admin will take action.\n\nUn-necessary reporting might freeze your account.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Report User", onPress: () => { { firebase.database().ref("Reportedby/" + suid).child('Reportedthis/' + userd).update({ baduser: "above" }) }; this.setState({ show: true }); } }
            ]

        );
    }

    InterestSend = () => {

        Alert.alert(
            "Do you want to send interest?",
            "Interest will be sent to this profile.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Send Interest", onPress: () => { this.verifyinterest() } }
            ]

        );

    }

    verifyinterest = () => {
        const { route, navigation } = this.props;
        const userd = route.params.useid;
        const suid = firebase.auth().currentUser.uid;
        firebase.database().ref("Interest/" + userd).child('Received/' + suid).update({ sentby: suid });
        firebase.database().ref("Interest/" + suid).child('Sent/' + userd).update({ sentTo: userd });
        this.setState({ showinterest: true });
    }


    MessageSend = () => {
        var usernameid = this.state.usernamebyid;

        this.props.navigation.push('MessageUser', {
            unbi: usernameid
        }
        )
    }


    showDialog = () => this.setState({ visible: true });
    hideDialog = () => this.setState({ visible: false });

    render() {

        return (
            <View style={{ backgroundColor: '#ffff', flex: 1 }}>
                <Snackbar
                    visible={this.state.show}
                    duration={3000}
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: '#00cafd' }}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color="#00cafd" />
                    }}
                    onDismiss={() => this.setState({ show: false })}
                >
                    <Text style={{ color: '#00cafd', paddingLeft: 15, fontWeight: 'bold' }}>  USER REPORTED  </Text>
                </Snackbar>

                <Snackbar
                    visible={this.state.showinterest}
                    onDismiss={() => this.setState({ showinterest: false })}
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: '#00cafd' }}
                    duration={3000}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color="#00cafd" />
                    }}
                >
                    <Text style={{ color: '#00cafd', paddingLeft: 15, fontWeight: 'bold' }}>   INTEREST SENT   </Text>
                </Snackbar>
                <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: "row", paddingTop: 10 }} >

                        <View style={{ marginLeft: 20, marginTop: 3, width: '20%', }}>
                            <TouchableOpacity onPress={this.showDialog}>
                                <Feather name="info" size={25} color={this.state.color} />
                            </TouchableOpacity>
                            <Portal>
                                <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                                    <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: this.state.color }}> <MaterialIcons name="drag-indicator" size={14} color={this.state.color} /> Profile Interaction</Dialog.Title>
                                    <Dialog.Content style={{ marginTop: -18 }}>
                                        <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Report Bad Profile / User with  <MaterialIcons name="report" size={20} color="grey" /></Paragraph>
                                        <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Send Interest with  <AntDesign name="heart" size={17} color="grey" /></Paragraph>
                                        <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Send Message with  <MaterialCommunityIcons name="message-text-outline" size={17} color="grey" /></Paragraph>
                                    </Dialog.Content>
                                </Dialog>
                            </Portal>
                        </View>

                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5 }}>
                            <Text style={{ fontSize: 25, color: this.state.color, letterSpacing: -0.4, }}>Profile Details</Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', marginTop: -2, right: 0, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}><View><Ionicons name="close" size={30} color={this.state.color} style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>
                    </View>
                    <View>
                        <View style={{ backgroundColor: '#fff', }}>
                            <View style={{ backgroundColor: '#fff', paddingTop: '1%', paddingLeft: 0, height: 'auto' }}>

                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
                                    <View style={{ borderWidth: 4, borderRadius: 300, borderColor: this.state.color }}>
                                        <View style={{ borderColor: '#fff', borderWidth: 4, borderRadius: 300 }}>
                                            <Avatar.Image source={{ uri: this.state.link }} size={200} style={{ backgroundColor: "#e4e4e4" }} />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                                    <View style={{ alignItems: 'center', width: 180, borderRadius: 30, borderColor: this.state.color, marginTop: 5 }}>
                                        {
                                            this.state.accstatus == 'verified' ?
                                                (<View style={{ alignItems: 'center', width: 180, borderRadius: 30, marginTop: 5 }}>
                                                    <Chip icon={() => <MaterialIcons name="verified-user" size={14} color="#fff" />} style={{ backgroundColor: this.state.color }} textStyle={{ fontSize: 12, color: '#FFF' }}>VERIFIED MEMBER</Chip>
                                                </View>) : (this.state.accstatus == 'premium' ? (<View style={{ alignItems: 'center', width: 180, borderRadius: 30, borderColor: '#00cafd', marginTop: 5 }}>
                                                    <Chip icon={() => <Fontisto name="star" size={14} color="#fff" />} style={{ backgroundColor: this.state.color }} textStyle={{ fontSize: 12, color: '#FFF', fontWeight: 'bold' }}>PREMIUM MEMBER</Chip>
                                                </View>) : (
                                                    <Chip icon={() => <FontAwesome5 name="exclamation-triangle" size={12} color="#fff" />} style={{ backgroundColor: this.state.color, marginTop: 5 }} textStyle={{ fontSize: 12.6, color: '#FFF' }}>NOT VERIFIED ACCOUNT</Chip>
                                                ))
                                        }
                                    </View>
                                    <View style={styles.container}>
                                        <TouchableOpacity onPress={this.UserReport} style={{ width: 70, height: 63, borderRadius: 45, margin: 4, alignContent: 'center', justifyContent: 'center', backgroundColor: this.state.color }}><Text style={{ justifyContent: 'center', alignSelf: 'center' }}><MaterialIcons name="report" size={33} color="#fff" /></Text></TouchableOpacity>
                                        <TouchableOpacity onPress={this.InterestSend} style={{ width: 130, height: 63, borderRadius: 45, margin: 4, alignContent: 'center', justifyContent: 'center', backgroundColor: this.state.color }}><Text style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}><AntDesign name="heart" size={28} color="#fff" /></Text></TouchableOpacity>
                                        <TouchableOpacity onPress={this.MessageSend} style={{ width: 130, height: 63, borderRadius: 45, margin: 4, alignContent: 'center', justifyContent: 'center', backgroundColor: this.state.color }} ><Text style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}><MaterialCommunityIcons name="message-text-outline" size={30} color="#fff" /></Text></TouchableOpacity>

                                    </View>
                                </View>
                                {this.state.userinfos.map(item => (

                                    <View>
                                        <Text style={{ fontSize: 23, color: this.state.color, marginLeft: 30, marginTop: 12, marginBottom: 2 }}>Personal Details</Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >NAME</Text>
                                                <Text style={styles.labeld} key={0}>{item.name}</Text>
                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>AGE</Text>
                                                <Text style={styles.labeld} key={0}>{item.age}</Text>
                                            </View>

                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >GENDER</Text>
                                                <Text style={styles.labeld} key={0}>{item.gender}</Text>

                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>CITY</Text>
                                                <Text style={styles.labeld} key={0}>{item.city}</Text>
                                            </View>

                                        </View>


                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >RELIGION</Text>
                                                <Text style={styles.labeld} key={0}>{item.religion}</Text>

                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>CASTE</Text>
                                                <Text style={styles.labeld} key={0}>{item.caste}</Text>
                                            </View>

                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >CITIZENSHIP</Text>
                                                <Text style={styles.labeld} key={0}>{item.citizenship}</Text>

                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>MARITAL STATUS</Text>
                                                <Text style={styles.labeld} >{item.maritalstatus}</Text>

                                            </View>

                                        </View>


                                        <Text style={{ fontSize: 23, color: this.state.color, marginLeft: 30, marginTop: 10, marginBottom: 5 }}>Education & Occupation</Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >EDUCATION</Text>
                                                <Text style={styles.labeld} key={0}>{item.education} </Text>

                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>DEGREE / FIELD</Text>
                                                <Text style={styles.labeld} key={0}>{item.degree}</Text>

                                            </View>


                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >OCCUPATION</Text>
                                                <Text style={styles.labeld} key={0}>{item.occupation}</Text>
                                            </View>
                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label} >MONTHLY INCOME</Text>
                                                <Text style={styles.labeld} key={0}>{item.monthlyincome} ~ PKR.</Text>
                                            </View>
                                        </View>

                                        <Text style={{ fontSize: 23, color: this.state.color, marginLeft: 30, marginTop: 10, marginBottom: 5 }}>Appearance & Lifestyle</Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >HEIGHT</Text>
                                                <Text style={styles.labeld} key={0}>{item.height}' {item.heightin}" </Text>

                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>WEIGHT</Text>
                                                <Text style={styles.labeld} key={0}>{item.weight} kg</Text>
                                            </View>

                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >COMPLEXION</Text>
                                                <Text style={styles.labeld} key={0}>{item.complexion}</Text>

                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>HOUSE</Text>
                                                <Text style={styles.labeld} key={0}>{item.house}</Text>
                                            </View>

                                        </View>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >SMOKE / DRINK</Text>
                                                <Text style={styles.labeld} key={0}>{item.smoke}</Text>

                                            </View>

                                        </View>



                                        <Text style={{ fontSize: 23, color: this.state.color, marginLeft: 30, marginTop: 10, marginBottom: 5 }}>Family Details</Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            height: 60
                                        }}>
                                            <View style={styles.inputWrap}>
                                                <Text style={styles.label} >NO. OF BROTHERS :<Text style={{ color: '#7e7e7e' }}> {item.noofb}</Text></Text>


                                            </View>

                                            <View style={styles.inputWrapn}>
                                                <Text style={styles.label}>NO. OF SISTERS :<Text style={{ color: '#7e7e7e' }}> {item.noofs}</Text></Text>

                                            </View>
                                        </View>


                                        <View style={{ alignSelf: 'center', marginTop: -23 }}><Entypo name="dots-three-horizontal" size={24} color="#e9e9e9" /></View>

                                        <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, borderRadius: 9, backgroundColor: this.state.colortwo, paddingTop: 12, paddingBottom: 10 }}>
                                            <Text style={{ fontSize: 18, color: '#fff', marginBottom: 7, alignSelf: 'center' }}>PARTNER PREFERENCE</Text>
                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                height: 60
                                            }}>
                                                <View style={styles.inputWrap}>
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }}>LOOKING FOR</Text>
                                                    <Text style={styles.labeldi} key={0}>{item.lookingfor}</Text>

                                                </View>

                                                <View style={styles.inputWrapn}>
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }}>COMPLEXION</Text>
                                                    <Text style={styles.labeldi} key={0}>{item.ppcomplexion}</Text>
                                                </View>

                                            </View>

                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                height: 60
                                            }}>
                                                <View style={styles.inputWrap}>
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }}>AGE</Text>
                                                    <Text style={styles.labeldi} key={0}>{item.ppage}</Text>
                                                </View>

                                                <View style={styles.inputWrapn}>
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }}>HEIGHT</Text>
                                                    <Text style={styles.labeldi} key={0}>{item.ppheight} ft</Text>
                                                </View>
                                            </View>

                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'flex-start',
                                                height: 60
                                            }}>
                                                <View style={styles.inputWrap}>
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }}>EDUCATION</Text>
                                                    <Text style={styles.labeldi} key={0}>{item.ppeducation}</Text>
                                                </View>

                                                <View style={styles.inputWrapn}>
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }}>NATIONALITY</Text>
                                                    <Text style={styles.labeldi} key={0}>{item.ppnationality}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 14, alignSelf: 'center', justifyContent: 'center', color: '#bfbfbf', marginTop: 10, marginBottom: 15 }}>PROFILE CREATED BY  :  {item.profilecreatedby}</Text>

                                    </View>

                                ))}

                            </View>

                        </View >

                    </View>
                </ScrollView>
            </View>
        );
    }
}

class MessageProfile extends React.Component {
    state = {
        guestUserId: "a",
        message: null,
        guestname: '',
        guestimage: '',
        msgdisplay: '',
        deletesnack: false,
        blockstatus: false,
        myuid: '',
        show: false,
        color: '#f3f3f3',
        altcolor: null
    }

    componentDidMount = () => {
        const { route, navigation } = this.props;
        const userd = route.params.unbi;

        this.setState({ guestUserId: userd });

        let suid = firebase.auth().currentUser.uid;
        this.setState({ myuid: suid })

        firebase.firestore()
            .collection('users').where('userid', '==', userd).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const usergender = doc.data().gender;
                    let Male = 'Male';
                    if (usergender === Male) { this.setState({ color: '#00cafd' }); this.setState({ altcolor: "#fb0d9b" }) } else { this.setState({ color: '#fb0d9b' }); this.setState({ altcolor: "#00cafd" }) }

                    this.setState({ guestname: doc.data().name })
                    this.setState({ guestimage: doc.data().profileimage })
                });
            });

        firebase.database().ref(`Messages/${suid}/${userd}/chat`).on("value", (dataSnapshot) => {
            let msgs = [];
            dataSnapshot.forEach((child) => {
                msgs.push({
                    sendBy: child.val().sender,
                    recievedBy: child.val().reciever,
                    msg: child.val().msg,
                    datetime: child.val().datetime,
                });
                this.setState({ msgdisplay: msgs });
            });

        });
        if ( suid != userd){
        firebase.database()
            .ref('Messages/' + suid)
            .child(userd + "/readstatus")
            .set({
                read: true
            });

        firebase.database()
            .ref('Messages/' + userd)
            .child(suid + "/seenstatus")
            .set({
                seen: true
            });
        }
    }
    uploadimg = () => {
        Alert.alert(
            "Sending Images\n",
            "TOP Profiles can only send images.\n\nPlease upgrade your account to send images. ",
            [
                {
                    text: "OK",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ]

        );
    }


    sendmessage = () => {
        let suid = firebase.auth().currentUser.uid;
        let guid = this.state.guestUserId;
        let msg = this.state.message;


        Keyboard.dismiss();

        firebase.database().ref("Blocked/" + suid).on("value", (snapshot) => {
            if (snapshot.hasChild(this.state.guestUserId)) { this.setState({ blockstatus: true }) }

            else {
                this.setState({ blockstatus: false });
                if (this.state.message === null || suid === guid) {
                    Alert.alert("Message Error !", "You are sending blank or self message.");
                }

                else {
                    var currentdate = new Date();
                    var hours = currentdate.getHours();
                    var minutes = currentdate.getMinutes();
                    var ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    var strTime = hours + ':' + minutes + ' ' + ampm;

                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                    var month = monthNames[currentdate.getMonth()];

                    var timestamp = currentdate.getDate() + " "
                        + month + " "
                        + currentdate.getFullYear() + " ~ "
                        + strTime;

                    ToastAndroid.show("Message Sent", ToastAndroid.LONG, ToastAndroid.BOTTOM);

                    firebase.database()
                        .ref('Messages/' + suid)
                        .child(guid + "/chat")
                        .push({

                            sender: suid,
                            reciever: guid,
                            msg: msg,
                            datetime: timestamp,

                        }).then(() => {

                            firebase.database()
                                .ref('Messages/' + guid)
                                .child(suid + "/chat")
                                .push({
                                    sender: suid,
                                    reciever: guid,
                                    msg: msg,
                                    datetime: timestamp,

                                });

                            this.setState({ message: null });

                            firebase.database()
                                .ref('Messages/' + guid)
                                .child(suid + "/readstatus")
                                .set({
                                    read: false
                                });


                            firebase.database()
                                .ref('Messages/' + suid)
                                .child(guid + "/seenstatus")
                                .set({
                                    seen: false
                                });

                            firebase.firestore().collection("Chatrooms").doc(suid).collection("allchat").doc(guid).set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });
                            firebase.firestore().collection("Chatrooms").doc(guid).collection("allchat").doc(suid).set({ timestamp: firebase.firestore.FieldValue.serverTimestamp() });

                        }

                        );




                }

            };

        });
    }

    confirmdelete = () => {
        Alert.alert(
            "Delete All Chat ?",
            "Do you want to delete this chat for everyone.\n\nThis will remove sent and received messages from both sides.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete Chat", onPress: () => { this.deletemsg() } }
            ]

        );
    }

    deletemsg = () => {
        this.setState({ deletesnack: true });
        let suid = firebase.auth().currentUser.uid;
        let guid = this.state.guestUserId;

        firebase.database().ref('Messages/' + suid).child(guid).remove();
        firebase.database().ref('Messages/' + guid).child(suid).remove();

        firebase.firestore().collection("Chatrooms").doc(suid).collection("allchat").doc(guid).delete();
        firebase.firestore().collection("Chatrooms").doc(guid).collection("allchat").doc(suid).delete();

        this.setState({ msgdisplay: '' });
        this.setState({ show: true });

    }

    confirmblock = () => {
        Alert.alert(
            "Block this user from messaging ?",
            "Irreversible action once blocked cannot be undone. Both users will not be able to send messages.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Block User", onPress: () => { this.blockthisuser() } }
            ]

        );
    }

    blockthisuser = () => {
        let suid = firebase.auth().currentUser.uid;
        let guid = this.state.guestUserId;
        firebase.database().ref('Blocked/' + suid).child(guid + "/userblocked").update({
            blocked: true,
        });
        firebase.database().ref('Blocked/' + guid).child(suid + "/userblocked").update({
            blocked: true,
        });
    }



    render() {
        return (

            <View style={{ backgroundColor: '#fff', flex: 1 }}>

                <Snackbar
                    visible={this.state.show}
                    duration={3000}
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: '#00cafd' }}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color="#00cafd" />
                    }}
                    onDismiss={() => this.setState({ show: false })}
                >
                    <Text style={{ color: '#00cafd', paddingLeft: 15, fontWeight: 'bold' }}> CHAT DELETED FOR EVERYONE</Text>
                </Snackbar>
                <View style={{ flexDirection: "column", flex: 1, backgroundColor: "#fff" }}>

                    <View style={{ flex: 0.5, justifyContent: "center", alignContent: 'center', padding: 9 }} >
                        <View style={{ flexDirection: 'row', width: window.width, marginRight: 7, marginLeft: 7, padding: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>

                            <View style={{ flex: 2.5, flexDirection: 'row' }}>
                                <Avatar.Image size={33} source={{ uri: this.state.guestimage }} style={{ backgroundColor: '#e4e4e4' }} />
                                <Text numberOfLines={1} style={{ flex: 2, flexWrap: 'wrap', fontSize: 23, color: this.state.color, marginLeft: 12, }}>{this.state.guestname}</Text>
                            </View>

                            <View style={{ flex: 0.7, alignItems: 'center', }}>
                                <TouchableRipple borderless={true} rippleColor="#fff" onPress={this.confirmblock}>
                                    <FontAwesome name="ban" size={24} color={this.state.color} />
                                </TouchableRipple>
                            </View>

                            <View style={{ flex: 0.9, alignItems: 'center', paddingRight: 9 }}>
                                <TouchableRipple borderless={true} rippleColor="#fff" onPress={this.confirmdelete}>
                                    <MaterialIcons name="delete" size={25} color={this.state.color} />
                                </TouchableRipple>
                            </View>

                            <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                <TouchableRipple borderless={true} rippleColor="#fff" onPress={() => this.props.navigation.navigate('ViewUser')}>
                                    <Ionicons name="close-circle-sharp" size={30} color={this.state.color} />
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 8 }} >
                        <View style={{ flex: 12 }}>

                            <View style={{ flex: 1, paddingTop: 18 }}>

                                <FlatList
                                    ref={ref => (this.FlatListRef = ref)}
                                    onContentSizeChange={() => this.FlatListRef.scrollToEnd()}
                                    data={this.state.msgdisplay}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <ChatBox
                                            msg={item.msg}
                                            sendby={item.sendBy}
                                            timestamp={item.datetime}
                                            altercolor={this.state.altcolor}
                                        />
                                    )}
                                />
                            </View>

                        </View>
                        {this.state.blockstatus ? (
                            <Text style={{ alignSelf: 'center', marginBottom: 8, color: "#f00" }}>User Blocked</Text>
                        ) : (
                            <View style={{ justifyContent: "flex-end", alignContent: 'center', padding: 5, }} >
                                <View style={{ flexDirection: 'row', width: window.width, margin: 8, paddingTop: 14, paddingBottom: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#e7e7e7', borderRadius: 90, backgroundColor: '#fff' }}>
                                    <View style={{ flex: 3 }}>
                                        <TextInput
                                            placeholder="Type here..."
                                            value={this.state.message}
                                            onChangeText={message => this.setState({ message })}
                                            style={{ paddingLeft: 21, fontSize: 18 }}
                                        />
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={this.uploadimg} >
                                            <Text mode="text">
                                                <Feather name="image" size={30} color="#00cafd" />
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.9 }}>
                                        <TouchableOpacity onPress={this.sendmessage}>
                                            <Ionicons name="send" size={30} color="#00cafd" style={{ alignSelf: 'center' }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>)
                        }
                    </View>


                </View >

            </View >
        );
    }
}

class AboutPage extends React.Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >

                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>ABOUT US</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, justifyContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

                </View>
                <View>
                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Shadee.org , Where you can find partner of your choice safely and more securely than anywhere else. In recent times as world facing pandemic, human interaction is not same like before. So our founder of app thought to make such application which let individual person can easily find partner of their choice for themselves or for their dearest ones through our platform. Now we have developed such an amazing application which provide better user experience and hassle free searching of partner with us. We are comitted to become more better as we grow and let our members have an amazing experience over here to find their better half more conveniently. Unlike others we don't charge hefty amounts from people. But we charge very small amount which can be easily payoff by any individual, so that we can keep up and running our system. We believe in making marriage an easy process for all in our country and beyond borders. Thanks</Text>
                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>LOVE AND PEACE</Text>
                    <Text style={{ marginLeft: 20, marginBottom: 20 }}><Text style={{ color: '#00cafd', fontSize: 18, fontFamily: 'dmcapf' }}>Shadee</Text><Text style={{ color: '#fb1dba', fontSize: 18, fontFamily: 'dmcapf' }}>.org</Text></Text>
                </View>
            </ScrollView>
        );
    }
}

class GuidePage extends React.Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >


                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>GUIDELINES</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, justifyContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

                </View>
                <View>
                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Here you will find all necessary information regarding interaction with application.</Text>
                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>FIRST STEP</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Create an amazing profile that looks awesome and real. Add a decent profile pic that shows your personality or you can add distance picture which gives glimpse of your appearance other members on app cannot view full picture and add other nescessary information about yourself. We don't take or display any personal information with anyother person etc in our application. You can edit your profile picture or details anytime. </Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>NEXT STEP</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Once profile creation is complete you can search members by navigating to search tab select filters that matches with you desired partner preference and click search profile button to view matched profiles.</Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>VISIT PROFILE</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>When you find matched profiles according to your criteria you can visit profiles. Where you can send message or interest to get attention from that particular member.</Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>MESSAGING</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Keep the messaging decent and clean. You have to introduce yourself and build your image, you can say whatever you like but within decency limits. Ask questions such as educational institue, hobbies, hometown or when they can get married and build your trust and then individual member can share their mobile number for further interaction if they found potential member. Note: In messages tab it displays only latest 20 chats to view older messages from other members, delete current displayed messages in your inbox. First go inside chat press delete bin icon and go back to your messages inbox at bottom other messages will be displayed. If you are receiving too many messages just hide your profile by going to homepage then click settings button on top right corner and press hide profile button you can unhide anytime later so your profile will be visible to other members.</Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>INTERESTS</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, }}>You can send interest to profile to let them know your are interested in them. You can also send interest back so they can initiate conversation.</Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>SECURITY AND PRIVACY</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Our application dont display or take any personal information such as phone number, location or NIC etc on our application but we take some information via email when verifying your profile account. In application First Name and picture is your identity which define you as unique individual. You can hide your profile by clicking settings button top right on home screen, you can hide or unhide profile as per your convenience. If profile hidden no member can see your profile and cannot message you except members in your messages tab. While you can still interact with members in your messages but you cannot search new profiles in search tab. You can delete messages or block any person from messaging.</Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>NOTIFICATIONS</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, }}>We don't display mobile phone notifications on new messages or interests because we don't want to send you with tons of notifications. We display only in app information display you can visit application anytime and on homescreen you will get to know about all messages you have in your messages tab / new message indicator dot sign, interests received and new members who joined recently. Also check messages tab to follow up conversations and we display latest messages sent or received on top, along with sent and read receipts. You can set time with any member so you can have real time chat with them on our platform. When you have found potential partner always hide your profile by going to homepage and click setting icon on top right corner to hide your profile from other members so you can have easy chat without getting more new messages. Then click unhide button so you can receive new messages as normal.</Text>

                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, color: '#00cafd', fontFamily: 'dmcapf' }}>BE SAFE</Text>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Good and bad people are everywhere. But we cannot ignore all good people out there, be vigilant and smart when interacting with any individual always inform your elders about everything. Keep asking questions dont fall for any wrong person and never ignore the right person. Everyone gives signs about themselves just look for them and right people always prefer family involvement and marrying soon.</Text>


                    <Text style={{ marginTop: 20, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>SPREAD HAPPINESS AROUND</Text>
                    <Text style={{ marginLeft: 20, marginBottom: 20, marginBottom: 20 }}><Text style={{ color: '#00cafd', fontSize: 18, fontFamily: 'dmcapf' }}>Shadee</Text><Text style={{ color: '#fb1dba', fontSize: 18, fontFamily: 'dmcapf' }}>.org</Text></Text>
                </View>
            </ScrollView>
        );
    }
}

class PayPage extends React.Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >


                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>Membership</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, jContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

                </View>
                <Text style={{ marginTop: 18, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Membership charges are one-time.</Text>
                <Text style={{ marginTop: 12, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Avail any membership option or upgrade / change your membership anytime.</Text>

                <Text style={{ marginTop: 18, fontSize: 16, textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf', color: '#00cafd' }}>MEMBERSHIP OPTIONS</Text>
                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Choose any membership. Limited time offers</Text>
          
                <View style={{flexDirection:'row',alignContent:'center',justifyContent:'center',fontFamily:'dmcapf',marginTop:27}}>
                <View style={{textAlign:'center',height:150,width:150,backgroundColor:'#00cafd',margin:10,alignContent:'center',justifyContent:'center',borderRadius:18}}>
                    <Text style={{alignSelf:'center',marginBottom:12}}><Fontisto name="star" size={24} color="#fff" /></Text>
                    <Text style={{color:'#fff',alignSelf:'center',fontFamily:'dmcapf',fontSize:21}}>PREMIUM</Text>
                    <Text style={{color:'#fff',alignSelf:'center',fontFamily:'dmcapf',fontSize:16}}>2000 PKR</Text>
                    <Text style={{color:'#fff',alignSelf:'center',fontSize:12,textDecorationLine: 'line-through',marginTop:3}}> was 4000 PKR</Text>
                </View>
                <View style={{textAlign:'center',height:150,width:150,backgroundColor:'#00cafd',margin:10,alignContent:'center',justifyContent:'center',borderRadius:18}}>
                <Text style={{alignSelf:'center',marginBottom:12}}><MaterialIcons name="verified-user" size={25} color="#fff" /></Text>
                    <Text style={{color:'#fff',alignSelf:'center',fontFamily:'dmcapf',fontSize:21}}>VERIFIED</Text>
                    <Text style={{color:'#fff',alignSelf:'center',fontFamily:'dmcapf',fontSize:16}}>500 PKR</Text>
                    <Text style={{color:'#fff',alignSelf:'center',fontSize:12,textDecorationLine: 'line-through',marginTop:3}}>was 1000 PKR</Text>
                </View>
                </View>
                
                <Text style={{ marginTop: 27, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf', color: '#00cafd' }}>PAYMENT METHOD AND DETAILS</Text>
                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Choose any membership and deposit the charges in the mentioned bank account, details are mentioned below.</Text>
                <Text style={{ marginTop: 25, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf',letterSpacing:1 }}>ACCOUNT TITLE :  ZITEC APPS</Text>
                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf',letterSpacing:1 }}>BANK ACCOUNT # :  08571007345431</Text>
                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf',letterSpacing:1 }}>IBAN :  PK49ALFH0857001007345431</Text>

                <Text style={{ marginTop: 27, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf', color: '#00cafd' }}>PAYMENT PROOF AND UPGRADE</Text>

                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, }}>Write your user email-address of shadee.org app "EMAIL USED FOR SIGN-UP" and attach your payment proof and send us email. We will upgrade your profile account.</Text>
                <Text style={{ marginTop: 18, fontSize: 16, textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf', color: '#00cafd' }}>Email Address (For Payment)</Text>
                <Text style={{ marginTop: 5, fontSize: 18, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27,marginBottom:50 }}>shadee.org@gmail.com</Text>

            </ScrollView>
        );
    }
}

class FaqPage extends React.Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >


                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>Share Your Story </Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, justifyContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

                </View>
                <Text style={{ marginTop: 30, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>You have found your life partner through our platform, let us know. We are glad to hear success story. </Text>
                <Text style={{ marginTop: 3, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Email us we will update this page with numbers of matches have been made here. Visit contact page and share your story with us via email.</Text>
                <Text style={{ marginTop: 21, fontSize: 16, textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf', color: '#00cafd' }}>No. OF MATCHES MADE HERE : ~</Text>
  
            </ScrollView>
        );
    }
}

class ContactPage extends React.Component {
    state={
        curruser:'',
    }

    componentDidMount = () =>{
        const current = firebase.auth().currentUser.uid;
        this.setState({curruser : current})
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >

                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>Contact Us</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, justifyContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

                </View>
                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, }}>You can always contact us here.</Text>
                <Text style={{ marginTop: 18, fontSize: 16, textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27, fontFamily: 'dmcapf', color: '#00cafd' }}>Email Address</Text>
                <Text style={{ marginTop: 5, fontSize: 18, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>shadee.org@gmail.com</Text>
                <Text style={{ marginTop: 25, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>Mention your subject and add details and send email to us we will respond to you asap.</Text>

                { this.state.curruser == "WAwNeYGP34WeVfqU4B7wo0xJo9o1" ? (<Text onPress={()=> this.props.navigation.navigate('Shadeeorg')} style={{marginLeft:20,marginTop:30,fontSize: 16, color: '#909090'}}>Thankyou</Text>):(<Text style={{marginLeft:20,marginTop:30,fontSize: 16, color: '#909090'}}>Thanks</Text>)}

            </ScrollView>
        );
    }
}

class Shadeeorg extends React.Component {
    state = {
        midv: '',
        midp: '',
        minv: '',
        name: '',
        pic: '',
        deleteme: '',
        prem:'',
        pinfo:'',
    }

    updatev = () => {
        const vid = this.state.midv;
        const veri = "verified";
        firebase.firestore().collection("users").doc(vid).update({ 'accountStatus': veri });
    }

    updatep = () => {
        const pid = this.state.midp;
        const prem = "premium";
        firebase.firestore().collection("users").doc(pid).update({ 'accountStatus': prem });
    }

    updatenv = () => {
        const nvid = this.state.minv;
        const notv = "notverified";
        firebase.firestore().collection("users").doc(nvid).update({ 'accountStatus': notv });
    }

    updatename = () => {
        const nameid = this.state.name;
        const noname = "N.A";
        firebase.firestore().collection("users").doc(nameid).update({ 'name': noname });
    }

    updatepic = () => {
        const nopic = this.state.pic;
        const noimg = "https://firebasestorage.googleapis.com/v0/b/psod-fc1f4.appspot.com/o/warnuser.png?alt=media&token=429ec6cb-da28-4639-9ed7-2d547eb6bde3";
        firebase.firestore().collection("users").doc(nopic).update({ 'profileimage': noimg });
    }

    updatedel = () => {
        const updel = this.state.deleteme;
        const delme = "deleted";
        firebase.firestore().collection("users").doc(updel).update({ 'memberStatus': delme });
    }

    updatepre = () => {
        const uppre = this.state.prem;

        firebase.database().ref("Premium").update({"count":uppre});
    }

    readinfo = () => {
        const upinfo = this.state.pinfo;
  
        firebase.firestore().collection("users").doc(upinfo).get().then((ddata) => console.log(ddata));
    
    }

    readreport = () => {
        firebase.database().ref("Reportedby").get().then((mydata)=>console.log(mydata));
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >

                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>Shadeeorg</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, justifyContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Main')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

                </View>
                <Text style={{ marginTop: 5, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>UPDATE ACCOUNTS</Text>

                <View style={{ margin: 30 }}>
                    <Text>1.CHANGE STATUS TO VERIFIED</Text>
                    <TextInput value={this.state.midv} onChangeText={midv => this.setState({ midv })} placeholder="MAKE ID VERIFIED" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5 }} />
                    <TouchableOpacity onPress={this.updatev} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>MAKE ID VERIFIED</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <Text>2.CHANGE STATUS TO PREMIUM</Text>
                    <TextInput value={this.state.midp} onChangeText={midp => this.setState({ midp })} placeholder="MAKE ID PREMIUM" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5 }} />
                    <TouchableOpacity onPress={this.updatep} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>MAKE ID PREMIUM</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <Text>3.CHANGE STATUS TO NOT VERIFIED</Text>
                    <TextInput value={this.state.minv} onChangeText={minv => this.setState({ minv })} placeholder="MAKE ID NOT VERIFIED" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5, justifyContent: 'center' }} />
                    <TouchableOpacity onPress={this.updatenv} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>MAKE ID NOT VERIFIED</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <Text>4.CHANGE NAME</Text>
                    <TextInput value={this.state.name} onChangeText={name => this.setState({ name })} placeholder="CHANGE NAME" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5, justifyContent: 'center' }} />
                    <TouchableOpacity onPress={this.updatename} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>CHANGE NAME</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <Text>5.CHANGE PICTURE</Text>
                    <TextInput value={this.state.pic} onChangeText={pic => this.setState({ pic })} placeholder="CHANGE PICTURE" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5, justifyContent: 'center' }} />
                    <TouchableOpacity onPress={this.updatepic} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>CHANGE PICTURE</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <Text>6.DELETE MEMBER</Text>
                    <TextInput value={this.state.deleteme} onChangeText={deleteme => this.setState({ deleteme })} placeholder="DELETE MEMBER" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5, justifyContent: 'center' }} />
                    <TouchableOpacity onPress={this.updatedel} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>DELETE MEMBER</Text>
                    </TouchableOpacity>
                </View>
                {/* Premium Member List No# */}
                <View style={{ margin: 30 }}>
                    <Text>7.No. of Premium Members</Text>
                    <TextInput value={this.state.prem} onChangeText={prem => this.setState({ prem })} placeholder="ADD NO. OF PREMIUM USER" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5, justifyContent: 'center' }} />
                    <TouchableOpacity onPress={this.updatepre} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>ADD NO. Of PREMIUM MEMBERS</Text>
                    </TouchableOpacity>
                </View>
                {/* Download Profile Details*/}
                <View style={{ margin: 30 }}>
                    <Text>8.DOWNLOAD PROFILE INFO</Text>
                    <TextInput value={this.state.pinfo} onChangeText={pinfo => this.setState({ pinfo })} placeholder="DOWNLOAD PROFILE INFO" style={{ padding: 3, borderWidth: 1, height: 80, width: '80%', borderRadius: 5, justifyContent: 'center' }} />
                    <TouchableOpacity onPress={this.readinfo} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>DOWNLOAD PROFILE INFO</Text>
                    </TouchableOpacity>
                </View>

                {/* Black List Profile */}

                {/* Download Reports */}
                <View style={{ margin: 30 }}>
                    <Text>9.DOWNLOAD REPORTS</Text>
                    <TouchableOpacity onPress={this.readreport} style={{ padding: 1, borderWidth: 1, backgroundColor: '#00cafd', height: 50, width: '40%', borderRadius: 5, justifyContent: 'center', alignContent: 'center' }}>
                        <Text>DOWNLOAD REPORTS</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    inputViewCreate: {
        backgroundColor: "#f7f7f7",
        borderRadius: 80,
        width: 360,
        height: 60,
        marginBottom: 12,
        marginTop: 12,
        paddingLeft: 40,
        fontSize: 16,
        alignContent: 'center',
        alignSelf: 'center'
    },

    buttonText: {
        borderRadius: 30,
        padding: 14,
        height: 50,
        width: 200,
        backgroundColor: '#fff',
        fontSize: 17,
        textAlign: 'center',
        color: "#FFF",
        marginBottom: 10,
        marginTop: 25,
        marginLeft: 20,
        borderWidth: 2,
        color: '#00cafd',
        borderColor: '#00cafd',
        marginBottom: 30,

    },
    label: {
        marginBottom: -4,
        color: '#d3d3d3',
        flex: 1,
        fontSize: 16
    },
    labeld: {
        marginBottom: 10,
        color: '#7e7e7e',
        flex: 1,
        height: 90,
        fontSize: 16
    },
    labeli: {
        marginBottom: -4,
        color: '#a3ecff',
        flex: 1,
        fontSize: 16
    },
    labeldi: {
        marginBottom: 10,
        color: '#ffffff',
        flex: 1,
        height: 90,
        fontSize: 16
    },
    inputWrap: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginLeft: 30,
        marginTop: 5,
        flex: 1,
    },
    inputWrapn: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginLeft: 20,
        marginTop: 5,
        flex: 1,
    },

    txtinput: {
        marginBottom: 8,
        marginTop: 2,
        marginLeft: 20,
        marginRight: 20,
        height: 60,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 12,
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10

    },

    redbox: {
        width: 130,
        height: 63,
        borderRadius: 45,
        margin: 4,
        borderColor: '#0db4de',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#0fcdfc',
    },

    redboxi: {
        width: 70,
        height: 63,
        borderRadius: 45,
        backgroundColor: '#0fcdfc',
        margin: 4,
        borderColor: '#0db4de',
        alignContent: 'center',
        justifyContent: 'center',


    },

    bottom: {
        marginTop: 10
    },
    item: {
        marginTop: 2,
        marginBottom: 20,
        marginLeft: 4.5,
        justifyContent: 'center', alignItems: 'center', marginRight: 4
    },
    itemPhoto: {
        width: 96,
        height: 96,
        borderRadius: 130,
        borderColor: '#fcfcfc',
        borderWidth: 3,

    },
    itemText: {
        color: 'rgba(255, 255, 255, 0.5)',
        color: '#00cafd',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'dmcapf',
        width: 105,
        marginTop: 5
    },
    itemTexts: {
        color: 'rgba(255, 255, 255, 0.5)',
        color: '#00cafd',
        fontSize: 14,
        textAlign: 'center',
        marginTop: -3
    },
});


const optionsStyles = {
    optionWrapper: {
        paddingTop: 15,
        paddingBottom: 15
    }
}

