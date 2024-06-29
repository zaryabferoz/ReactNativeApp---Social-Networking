import * as React from 'react';
import { Component } from 'react';
import firebase from 'firebase';
import { Text, View, TouchableOpacity, Dimensions, Image, StyleSheet,ToastAndroid,Keyboard,  Alert, FlatList, ActivityIndicator, KeyboardAvoidingView, TextInput, SafeAreaView } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import { Ionicons, Feather, Foundation, MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, FontAwesome, FontAwesome5, Fontisto,Octicons } from '@expo/vector-icons';
import { Button, Menu, Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { startDetecting } from 'react-native/Libraries/Utilities/PixelRatio';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';
import { useNavigation } from '@react-navigation/native';
import { Title, Paragraph, Portal, Dialog, } from 'react-native-paper';
import { Avatar, Card, IconButton, Snackbar, Chip } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import SnackBar from 'react-native-snackbar-component'
import { Slider } from "@miblanchard/react-native-slider";
import ChatBox from './Chatbox';
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync, } from 'expo-ads-admob';

const ChangeView = createStackNavigator();

function SearchandDisplayUserNavi() {
    return (
        <ChangeView.Navigator initialRouteName="SearchPanel" screenOptions={{ headerShown: false, animationEnabled: false, }}>
            <ChangeView.Screen name="SearchPanel" component={SearchScreen} />
            <ChangeView.Screen name="DisplayUsers" component={DisplayUserScreen} />
            <ChangeView.Screen name="ViewUser" component={ViewProfile} />
            <ChangeView.Screen name="MessageUser" component={MessageProfile} />
        </ChangeView.Navigator>
    );
}

export default class SearchAndDisplay extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width }}><SearchandDisplayUserNavi /></View>
            </View>
        );
    }
}

class SearchScreen extends React.Component {

    state = {
        visible: false,
        gender: 'Male',
        education: 'Inter',
        value: 21,
        hvalue: 0,
        heightft: 4,
        msgcount: 0,
        accstatus: null,
        goahead: false,
        gopro: false,
        memstat:''
    };

    componentDidMount = () => {

        let suid = firebase.auth().currentUser.uid;
        firebase.database().ref(`Messages/${suid}`).on('value', (snapShot) => { this.setState({ gopro: true }); this.setState({ msgcount: parseInt(snapShot.numChildren()) }) });

        firebase.firestore()
            .collection('users').where('userid', '==', suid).get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const useraccstatus = documentSnapshot.data().accountStatus;
                    const usermemstatus = documentSnapshot.data().memberStatus;
                    this.setState({ memstat: usermemstatus });
                    this.setState({ accstatus: useraccstatus });
            
                    this.setState({ goahead: true });

                })
               
            }
            )
    }

    loadinterad = async () => {
        if (this.state.accstatus == 'notverified' && this.state.memstat != 'deleted') {
            AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');

            try {
                await AdMobInterstitial.requestAdAsync();
                await AdMobInterstitial.showAdAsync();
            }
            catch (e) {
                console.log(e);
            }
        } else {

        }
        if(this.state.memstat == 'deleted'){
            ToastAndroid.show("Access denied!",ToastAndroid.LONG,ToastAndroid.BOTTOM);
            firebase.auth().signOut();
        }
    }

    checklimit = () => {
            this.state.msgcount > 2 && this.state.accstatus == "notverified" ? (
                Alert.alert(
                    "Register Membership",
                    "Please visit main-menu on homepage to register your Membership and get best experience from Shadee.org app.",
                    [
                        {
                            text: "CLOSE",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                    ]
                )
            ) : ( this.state.memstat == 'nothide' ? (this.searchperson()):(ToastAndroid.show("Your profile is hidden!",ToastAndroid.LONG,ToastAndroid.BOTTOM)))
        
    }

    searchperson = () => {

        var gen = this.state.gender;

        var startage = this.state.value;

        var edu = this.state.education;
        var hft = this.state.heightft;
        var height = this.state.hvalue;

        var endage = 23;

        if (this.state.value == 21) {
            var endage = 23;
        }
        if (this.state.value == 24) {
            var endage = 26;
        }
        if (this.state.value == 27) {
            var endage = 29;
        }
        if (this.state.value == 30) {
            var endage = 35;
        }
        if (this.state.value == 36) {
            var endage = 50;
        }

        this.props.navigation.navigate('DisplayUsers', {
            ugen: gen,
            sage: startage,
            eage: endage,
            uedu: edu,
            hef: hft,
            hei: height,
        });

    };

    showDialog = () => this.setState({ visible: true });
    hideDialog = () => this.setState({ visible: false });

    customthumb = () => (
        <View >
            <Badge size={70} style={{ fontSize: 18, backgroundColor: '#00cafd', color: '#fff', }}>{this.state.hvalue} in</Badge>
        </View>
    );

    render() {

        const options = [
            { label: 'Groom', value: 'Male', activeColor: '#00cafd', },
            { label: 'Bride', value: 'Female', activeColor: '#00cafd' },
        ];

        const optionsagemin = [
            { label: '21 ~ 23', value: '21', activeColor: '#00cafd', },
            { label: '24 ~ 26', value: '24', activeColor: '#00cafd' },
            { label: '27 ~ 29', value: '27', activeColor: '#00cafd' },
            { label: '30 ~ 35', value: '30', activeColor: '#00cafd' },
            { label: '36 ~ 50', value: '41', activeColor: '#00cafd' },
        ];

        const optionsedu = [
            { label: 'Inter', value: 'Inter', activeColor: '#00cafd', },
            { label: 'BS', value: 'BS', activeColor: '#00cafd' },
            { label: 'MS', value: 'MS', activeColor: '#00cafd' },
            { label: 'Ph.D', value: 'Ph.D', activeColor: '#00cafd' },
        ];

        const optionsheight = [
            { label: '4 ft', value: 4, activeColor: '#00cafd', },
            { label: '5 ft', value: 5, activeColor: '#00cafd' },
            { label: '6 ft', value: 6, activeColor: '#00cafd' },
        ];



        return (


            <ScrollView style={{ backgroundColor: '#fff' }}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", height: 43, paddingTop: 10, paddingBottom: 5, }} >


                    <View style={{ flex: 1, marginLeft: 10, width: '20%', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }} onPress={() => this.props.navigation.navigate('Home')}>
                            <MaterialIcons name="arrow-back-ios" size={20} color="#0dc8f6" style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5, }}>
                        <Text style={{ fontSize: 25, color: '#04c7f8', letterSpacing: -0.4, }}>Search</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10, width: '20%', marginTop: -2, right: 0, justifyContent: 'center' }}>
                        <TouchableOpacity style={{ padding:10, }} onPress={this.showDialog} ><View><Feather name="info" size={25} color="#0dc8f6" style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity>
                    </View>
                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                            <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: "#04b3df" }}> <MaterialIcons name="drag-indicator" size={14} color="#04b3df" /> User Guide <MaterialIcons name="drag-indicator" size={14} color="#04b3df" />  Search</Dialog.Title>
                            <Dialog.Content style={{ marginTop: -18 }}>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Search your desired profile here.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />To select, click on text options.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Slide to adjust height.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Click Search Profile button to load.</Paragraph>

                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>

                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: '3%', }}>

                    <Text style={{ letterSpacing: 0, paddingTop: 9, fontSize: 18, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 30, color: '#00cafd', marginTop: 4 }}>
                        Find a...
                    </Text>

                    <SwitchSelector style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}
                        initial={0} animationDuration={200} backgroundColor={'#f5f5f5'} fontSize={18} height={63} textColor={'#707070'}
                        options={options} onPress={value => this.setState({ gender: value })} />

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ letterSpacing: 0, paddingTop: 2, fontSize: 18, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 30, color: '#00cafd', marginTop: 10 }}>
                            Height
                        </Text>
                        {/* <Text style={{ marginBottom:-20,marginLeft:10, color: '#00cafd', fontSize:18 }}>{this.state.hvalue} ft </Text>
       */}

                    </View>
                    <SwitchSelector style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}
                        initial={0} animationDuration={200} backgroundColor={'#f5f5f5'} fontSize={18} height={68} textColor={'#707070'}
                        options={optionsheight} onPress={value => { this.setState({ heightft: value }) }} />

                    <View style={{ backgroundColor: '#f5f5f5', marginLeft: -12, marginRight: -12, marginTop: 0, backgroundColor: '#fff', paddingLeft: 30, paddingRight: 30, borderRadius: 45, paddingTop: 12, paddingBottom: 3, marginBottom: 2 }}>
                        <Slider
                            containerStyle={{ height: 70, backgroundColor: '#f5f5f5', paddingTop: 33, paddingBottom: 33, borderRadius: 80, justifyContent: 'center' }}
                            renderThumbComponent={this.customthumb}
                            minimumTrackTintColor='#e3e3e3'
                            maximumTrackTintColor='#e3e3e3'
                            trackClickable={true}
                            minimumValue={0}
                            maximumValue={12}
                            value={this.state.hvalue}
                            onValueChange={value => this.setState({ hvalue: parseInt(value) })}
                        />
                    </View>

                    <Text style={{ letterSpacing: 0, paddingTop: 2, fontSize: 18, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 30, color: '#00cafd', marginTop: 10 }}>
                        Education
                </Text>

                    <SwitchSelector style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}
                        initial={0} animationDuration={200} backgroundColor={'#f5f5f5'} fontSize={18} height={66} textColor={'#707070'}
                        options={optionsedu} onPress={value => this.setState({ education: value })} />



                    <Text style={{ letterSpacing: 0, paddingTop: 2, fontSize: 18, flexDirection: 'row', alignItems: 'flex-start', marginLeft: 30, color: '#00cafd', marginTop: 10 }} onPress={value => this.setState({ age: value })}>
                        Age
                </Text>
                

                    <SwitchSelector style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 8 }}
                        initial={0} animationDuration={200} backgroundColor={'#f5f5f5'} fontSize={15} height={68} textColor={'#707070'}
                        options={optionsagemin} onPress={value => { this.setState({ value: value }) }} />

                   

                    <View>
                        <TouchableOpacity onPress={this.checklimit}>
                            <Text style={styles.buttonText} >Search Profiles  <Ionicons name={'search'} size={18} color={'#00cafd'} /></Text>
                        </TouchableOpacity>
                    </View>

                </View >
            </ScrollView >

        );
    }
}

class DisplayUserScreen extends React.Component {
    state = {
        record: [],
        Loading: false,
        visible: false,
        color: '#f3f3f3',
        visible: false,

    }

    componentDidMount = () => {

        this.renderProfiles();
    }

    renderProfiles = () => {
        const { route, navigation } = this.props;
        const sage = parseInt(route.params.sage);
        const eage = parseInt(route.params.eage);
        const uedu = route.params.uedu;
        const { maxhei } = route.params;
        const { minhei } = route.params;
        var ugen = route.params.ugen;
        const hef = route.params.hef;
        const hei = route.params.hei;
        const nhs = 'nothide';

        firebase.firestore()
            .collection('users').where('gender', '==', ugen).where('education', '==', uedu).where("height", "==", hef).where("heightin", "==", hei).where("age", "<=", eage).where("age", ">=", sage).where("memberStatus", '==', nhs).orderBy("age", "desc").orderBy("updatetime", "desc").limit(300)
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
                <View style={{ flexDirection: "row", height: 43, paddingTop: 10, paddingBottom: 5, }} >


                    <View style={{ flex: 1, marginLeft: 10, width: '20%', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }} onPress={() => this.props.navigation.navigate('Home')}>
                            <MaterialIcons name="arrow-back-ios" size={20} color="#0dc8f6" style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5, }}>
                        <Text style={{ fontSize: 25, color: '#04c7f8', letterSpacing: -0.4, }}>Profiles</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', marginTop: -2, right: 0, justifyContent: 'center' }}>
                        <TouchableOpacity style={{ paddingLeft: 10, paddingTop: 10, paddingBottom: 10, }} onPress={this.showDialog} ><View><Feather name="info" size={25} color="#0dc8f6" style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity>
                    </View>
                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                            <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: "#04b3df" }}> <MaterialIcons name="drag-indicator" size={14} color="#04b3df" /> User Guide <MaterialIcons name="drag-indicator" size={14} color="#04b3df" />  Profiles</Dialog.Title>
                            <Dialog.Content style={{ marginTop: -18 }}>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Showing recently online users.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />See latest profiles everytime.</Paragraph>
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>


                <View style={{ marginLeft: '5%', marginRight: '5%' }}>
                    <TouchableRipple borderless={true} rippleColor="#ffff" style={{ width: '100%', height: 57, backgroundColor: '#0dc8f6', alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginTop: 22 }} onPress={() => { navigation.navigate('SearchPanel'); }}>
                        <Text style={{ fontSize: 17, alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Ionicons name="md-settings-outline" size={16.5} color="white" />  Change Settings    <Ionicons name="refresh" size={17} color="white" /> Refresh Profiles </Text>
                    </TouchableRipple>

                </View>

                <ScrollView style={{ flex: 1 }}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                    {this.state.loading && this.state.record ? (
                        <>
                            <Text style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 25, fontSize: 18, color: this.state.color, fontFamily: 'dmcapf' }}>MATCHED PROFILES : {this.state.record.length}</Text>
                            <FlatList
                                style={{ flex: 1, padding: 5 }}
                                data={Object.assign(this.state.record)}
                                keyExtractor={(key, index) => key + index}
                                renderItem={(itemData) => {

                                    return <Card.Title
                                        title={<Text>{itemData.item.name} {itemData.item.accountStatus != 'notverified' ? (<Text><Octicons name="verified" size={16} color={this.state.color} /></Text>) : (<Text></Text>)}</Text>}
                                        titleStyle={[itemData.item.gender == 'Male' ? { color: '#00cafd', fontfamily: "dmcapf", fontSize: 18, marginTop: -3, marginLeft: - 3, textTransform: 'capitalize' } : { color: '#fb0d9b', fontfamily: "dmcapf", fontSize: 18, marginTop: -3, marginLeft: - 3, textTransform: 'capitalize', }]}
                                        subtitle={<Text>{itemData.item.city}<Entypo name="dot-single" size={14} color="#d3d3d3" />{itemData.item.age}<Entypo name="dot-single" size={14} color="#d3d3d3" />{itemData.item.height}' {itemData.item.heightin}" </Text>}
                                        subtitleStyle={{ padding: 0, fontSize: 13, marginTop: -6, marginLeft: -3 }}
                                        style={[itemData.item.gender == 'Male' ? { borderColor: '#00cafd', borderWidth: 1.5, padding: 0, marginTop: 5, marginBottom: 4, marginLeft: 14, marginRight: 14, borderRadius: 12, } : { borderColor: '#fb0d9b', borderWidth: 1.5, padding: 0, marginTop: 5, marginBottom: 4, marginLeft: 14, marginRight: 14, borderRadius: 12, }]}
                                        left={(props) => <Avatar.Image source={{ uri: itemData.item.profileimage }} size={50} color="#00cafd" style={{ margin: -7, backgroundColor: "#e4e4e4" }} />}
                                        right={(props) => <TouchableOpacity style={[itemData.item.gender == 'Male' ? { backgroundColor: '#00cafd', width: 108, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 8, marginTop: 0.3 } : { backgroundColor: '#fb0d9b', width: 108, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 8, marginTop: 0.3 }]} onPress={() => this.props.navigation.navigate('ViewUser', { userID: itemData.item.userid })}>
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
        const userd = route.params.userID;
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
                    this.setState({link:documentSnapshot.data().profileimage});

                    const usergender = documentSnapshot.data().gender;
                    const userdetail = documentSnapshot.data();
                    userdata.push(userdetail);

                    let Male = 'Male';
                    if (usergender === Male) { this.setState({ color: '#00cafd' }); this.setState({ colortwo: '#fb0d9b' }); this.setState({ colorthree: '#fd86cd' }) } else { this.setState({ color: '#fb0d9b' }); this.setState({ colortwo: '#00cafd' }); this.setState({ colorthree: '#a3ebfd' }) }

                    this.setState({ userinfos: [...userdata] });

                })
            })
    }

    UserReport = () => {
        const { route, navigation } = this.props;
        const userd = route.params.userID;
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
        const userd = route.params.userID;
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
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: this.state.color }}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color='#00cafd' />
                    }}
                    onDismiss={() => this.setState({ show: false })}
                >
                    <Text style={{ color: '#00cafd', paddingLeft: 15, fontWeight: 'bold' }}>  USER REPORTED  </Text>
                </Snackbar>

                <Snackbar
                    visible={this.state.showinterest}
                    onDismiss={() => this.setState({ showinterest: false })}
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: this.state.color }}
                    duration={3000}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color='#00cafd' />
                    }}
                >
                    <Text style={{ color: '#00cafd', paddingLeft: 15, fontWeight: 'bold' }}>   INTEREST SENT   </Text>
                </Snackbar>
                <ScrollView style={{ backgroundColor: "#ffffff", }}  showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('DisplayUsers')}><View><Ionicons name="close" size={30} color={this.state.color} style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

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

                                    <View style={{ alignItems: 'center', width: 180, borderRadius: 30, borderColor: '#00cafd', marginTop: 5 }}>
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
                                                    <Text style={styles.labeli} style={{ color: this.state.colorthree }} >NATIONALITY</Text>
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
        showblock: false,
        color: '#f3f3f3',
        altcolor: null,
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

                    ToastAndroid.show("Message Sent",ToastAndroid.LONG,ToastAndroid.BOTTOM);
                    
                    firebase.database()
                        .ref('Messages/' + suid)
                        .child(guid + "/chat")
                        .push({

                            sender: suid,
                            reciever: guid,
                            msg: msg,
                            datetime: timestamp,

                        }).then(()=>{
                            
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
        this.setState({ showblock: true });
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
                <Snackbar
                    visible={this.state.showblock}
                    duration={3000}
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: '#00cafd' }}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color="#00cafd" />
                    }}
                    onDismiss={() => this.setState({ showblock: false })}
                >
                    <Text style={{ color: '#00cafd', paddingLeft: 15, fontWeight: 'bold' }}> USER BLOCKED</Text>
                </Snackbar>

                <View style={{ flexDirection: "column", flex: 1, backgroundColor: "#fff" }}>

                    <View style={{ flex: 0.5, justifyContent: "center", alignContent: 'center', padding: 9 }} >
                        <View style={{ flexDirection: 'row', width: window.width, marginRight: 7, marginLeft: 7, padding: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>

                            <View style={{ flex: 2.5, flexDirection: 'row' }}>
                                <Avatar.Image size={33} source={{ uri: this.state.guestimage }} style={{ backgroundColor: "#e4e4e4" }} />
                                <Text numberOfLines={1} style={{ flex: 2, flexWrap: 'wrap', fontSize: 23, color: this.state.color, marginLeft: 12, }}>{this.state.guestname}</Text>
                            </View>

                            <View style={{ flex: 0.7, alignItems: 'center', }}>
                                <TouchableOpacity onPress={this.confirmblock}>
                                    <FontAwesome name="ban" size={24} color={this.state.color} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.9, alignItems: 'center', paddingRight: 9 }}>
                                <TouchableOpacity onPress={this.confirmdelete}>
                                    <MaterialIcons name="delete" size={25} color={this.state.color} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ViewUser')}>
                                    <Ionicons name="close-circle-sharp" size={30} color={this.state.color} />
                                </TouchableOpacity>
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
                            </View>
                        )
                        }
                    </View>


                </View >

            </View >
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
        justifyContent: 'center'

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
        margin: 4,
        alignContent: 'center',
        justifyContent: 'center',


    },


});
