import * as React from 'react';
import { Component } from 'react';
import firebase from 'firebase';
import { Text, View, ToastAndroid,Keyboard, TouchableOpacity, Dimensions, Image, StyleSheet, Alert, FlatList, ActivityIndicator, KeyboardAvoidingView, TextInput, SafeAreaView } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import { Ionicons, Feather, Foundation, MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, FontAwesome, FontAwesome5, Octicons, Fontisto } from '@expo/vector-icons';
import { Button, Menu, Divider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { startDetecting } from 'react-native/Libraries/Utilities/PixelRatio';
import { createStackNavigator } from '@react-navigation/stack';
import { render } from 'react-dom';
import { useNavigation } from '@react-navigation/native';
import { Title, Paragraph, Portal, Dialog, Chip } from 'react-native-paper';
import { Avatar, Card, IconButton, Snackbar, List } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import SnackBar from 'react-native-snackbar-component'
import { Slider } from "@miblanchard/react-native-slider";
import ChatBox from '.././Chatbox';
import { BackHandler, AppState } from "react-native";
import { AdMobBanner, AdMobInterstitial, PublisherBanner, AdMobRewarded, setTestDeviceIDAsync, } from 'expo-ads-admob';

const ChangeView = createStackNavigator();

function ChatMessageNavi() {
    return (
        <ChangeView.Navigator initialRouteName="allmessages" screenOptions={{ headerShown: false, animationEnabled: false, }}>
            <ChangeView.Screen name="allmessages" component={AllMesssages} />
            <ChangeView.Screen name="readmsg" component={Readmessage} />
            <ChangeView.Screen name="viewacc" component={ViewAccount} />
        </ChangeView.Navigator>
    );
}

export default class DisplayChatMessages extends Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width }}><ChatMessageNavi /></View>
            </View>
        );
    }
}


class AllMesssages extends React.Component {

    state = {
        expanded: false,
        allchatid: [],
        record: [],
        loading: false,
        showlastmsg: [],
        dt: [],
        msgcount: 0,
        accstatus: null,
        readval: [],
        readconfirm: [],
        memstat:''
    };

    componentDidMount = () => {
        AppState.addEventListener("change", this._handleAppStateChange);
        this.loadmessages();
        this.msglimit();        
    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this._handleAppStateChange);
    }

    _handleAppStateChange = () => {
        this.props.navigation.replace("allmessages");
    };

    msglimit = () => {
        
        const suid = firebase.auth().currentUser.uid;
        firebase.database().ref(`Messages/${suid}`).on('value', (snapShot) => this.setState({ msgcount: parseInt(snapShot.numChildren()) }));

        firebase.firestore()
            .collection('users').where('userid', '==', suid).get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const useraccstatus = documentSnapshot.data().accountStatus;
                    const usermemstatus = documentSnapshot.data().memberStatus;
                    this.setState({ memstat: usermemstatus });
                    this.setState({ accstatus: useraccstatus });
                })
                
            }
            ).then(()=>{
                if(this.state.memstat == 'deleted'){
                    ToastAndroid.show("Access denied!",ToastAndroid.LONG,ToastAndroid.BOTTOM);
                    firebase.auth().signOut();
                }
            });
            
    }

    loadmessages = () => {
        const suid = firebase.auth().currentUser.uid;

        firebase.firestore().collection('Chatrooms').doc(suid).collection('allchat').orderBy("timestamp", "desc").limit(30).get().then((querySnapshot) => {
            querySnapshot.docs.map((doc) => {
                var list = [];
                list.push(doc.id)
                this.setState({ allchatid: [...this.state.allchatid, ...list] });
            })

            this.lastmsg();
            this.renderuser();
            
    
        })
        
    }

    loadinterad = async () => {
        if (this.state.accstatus == 'notverified') {
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
    }

    lastmsg = () => {
        const suid = firebase.auth().currentUser.uid;

        this.state.allchatid.map((ids) => {
            firebase.database().ref(`Messages/${suid}/${ids}/chat`).orderByKey().limitToLast(1)
                .on("value",
                    mss => {
                        mss.forEach((child) => {
                            var a = [];
                            var b = [];
                            a.push(child.val().msg);
                            b.push(child.val().datetime);
                            this.setState({ showlastmsg: [...this.state.showlastmsg, ...a] });
                            this.setState({ dt: [...this.state.dt, ...b] });
                        });
                        this.setState({ loading: true });
                    }
                )

            firebase.database().ref(`Messages/${suid}/${ids}/readstatus`).child('read').on('value', snapShot => {
                var r = [];
                r.push(snapShot.val());
                this.setState({ readval: [...this.state.readval, ...r] });
            }
            )

            firebase.database().ref(`Messages/${suid}/${ids}/seenstatus`).child('seen')
                .on('value', snapShot => {
                    var rc = [];
                    rc.push(snapShot.val())
                    this.setState({ readconfirm: [...this.state.readconfirm, ...rc] });
                });

        });

    }


    renderuser = () => {

        this.state.allchatid.map((chatids) => {

            firebase.firestore()
                .collection('users').where('userid', '==', chatids)
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
        });

    }

    showDialog = () => this.setState({ visible: true });
    hideDialog = () => this.setState({ visible: false });

    _handlePress = () =>
        this.setState({
            expanded: !this.state.expanded,

        });

    render() {

        return (

            <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", height: 43, paddingTop: 10, paddingBottom: 5, }} >


                    <View style={{ flex: 1, marginLeft: 10, width: '20%', justifyContent: 'center', }}>
                        <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }} onPress={() => this.props.navigation.navigate('Home')}>
                            <MaterialIcons name="arrow-back-ios" size={20} color="#0dc8f6" style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5, }}>
                        <Text style={{ fontSize: 25, color: '#04c7f8', letterSpacing: -0.4, }}>Messages</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10, width: '20%', marginTop: -2, right: 0, justifyContent: 'center',}}>
                        <TouchableOpacity style={{ paddingLeft: 10, paddingTop: 10, paddingBottom: 10, paddingRight: 10 }} onPress={this.showDialog} ><View><Feather name="info" size={25} color="#0dc8f6" style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity>
                    </View>
                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }}>
                            <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: "#04b3df" }}> <MaterialIcons name="drag-indicator" size={14} color="#04b3df" /> User Guide <MaterialIcons name="drag-indicator" size={14} color="#04b3df" />  Messages</Dialog.Title>
                            <Dialog.Content style={{ marginTop: -18 }}>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />Latest Message appears on top.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />View New / Sent messages here.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />TOP Profiles can send images only.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />User can block inappropriate users.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" />User can delete messages.</Paragraph>
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>
                {this.state.loading ? (
                    
                    <FlatList

                        style={{ flex: 1, padding: 9, backgroundColor: '#fff' }}
                        data={Object.assign(this.state.record)}
                        keyExtractor={(key, index) => key + index}
                        renderItem={(itemData) => {

                            return (
                                <TouchableOpacity onPress={() =>{
                                    this.state.msgcount > 2 && this.state.accstatus == 'notverified' ?(
                                        
                                            Alert.alert(
                                            "Register Membership\n",
                                            "Please visit main-menu to register your Membership and get best experience from Shadee.org app.",[
                                                {
                                                    text: "CLOSE",
                                                    onPress: () => console.log("Cancel Pressed"),
                                                    style: "cancel"
                                                },
                                            ])    
                                        
                                ):(this.props.navigation.navigate('readmsg', { userID: itemData.item.userid })) 
                                }}>

                                    <Card.Title
                                        title={<Text><Text>{itemData.item.name} </Text><Text>
                                            {itemData.item.accountStatus != 'notverified' ? (<Text><Octicons name="verified" size={16} color={this.state.color} /></Text>) : (<Text></Text>)}
                                        </Text></Text>}
                                        titleStyle={[itemData.item.gender == 'Male' ? { color: '#00cafd', fontfamily: "dmcapf", fontSize: 18, marginTop: -3, marginLeft: - 3, textTransform: 'capitalize' } : { color: '#fb0d9b', fontfamily: "dmcapf", fontSize: 18, marginTop: -3, marginLeft: - 3, textTransform: 'capitalize', }]}
                                        subtitle={<Text>{this.state.readval[itemData.index] ? (this.state.readconfirm[itemData.index] ? (<Ionicons name="checkmark-done-sharp" size={18} color={"#04e8bb"} />) : (<Ionicons name="checkmark-done-sharp" size={18} color={"#d3d3d3"} />)) : (<Ionicons name="flash" size={14} color={'#d3d3d3'} />)} <Text> {this.state.showlastmsg[itemData.index]}</Text></Text>}
                                        subtitleStyle={{ backgroundColor: '#f6f6f6', padding: 0, fontSize: 15, marginTop: -3, marginLeft: -3, letterSpacing: -0.3 }}
                                        style={{ padding: 0, marginTop: 9, marginBottom: 2, marginLeft: 7, marginRight: 7, backgroundColor: '#f6f6f6', borderRadius: 12 }}
                                        left={(props) => <Avatar.Image source={{ uri: itemData.item.profileimage }} size={50} color="#00cafd" style={{ margin: -7, backgroundColor: "#e4e4e4" }} />}
                                        right={() => <Text style={{ marginTop: -21, marginRight: 9, color: '#c3c3c3', fontSize: 12 }}>{this.state.dt[itemData.index]}   {this.state.readval[itemData.index] ? (<Ionicons name="checkmark-done-sharp" size={0} color="black" />) : (<Octicons name="primitive-dot" size={14} color={'#fb0d9b'} />)}</Text>}
                                    />

                                </TouchableOpacity>)
                        }
                        }
                    />) : (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", fontSize: 300, marginTop: 180, }}>
                        <Text><Ionicons name="ios-chatbubbles-outline" size={90} color="#f6f6f6" /></Text>
                        <Entypo name="dots-three-horizontal" size={24} color="#f3f3f3" />
                        <View style={{ marginTop: 30, color: '#e7e7e7', borderWidth: 1, padding: 5, borderRadius: 9, borderColor: "#e7e7e7" }}>

                            <Paragraph style={{ color: '#e7e7e7', padding: 2 }}><Entypo name="dot-single" size={16} color="#e7e7e7" />No Message or Loading...</Paragraph>

                        </View>
                    </View>
                )}


            </ScrollView >

        );
    }
}

class Readmessage extends React.Component {
    constructor(props) {
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", (payload) =>
            BackHandler.addEventListener("hardwareBackPress", this.backpress())
        );
    }

    state = {
        guestUserId: "a",
        message: null,
        guestname: '',
        guestimage: '',
        msgdisplay: '',
        deletesnack: false,
        blockstatus: false,
        myuid: '',
        showdel: false,
        showblock: false,
        color: "#f3f3f3",
        altcolor: null,
        readconfirm: null
    }

    componentDidMount = () => {
        const { route, navigation } = this.props;
        const userd = route.params.userID;

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

        this.willBlur = this.props.navigation.addListener("willBlur", (payload) =>
            BackHandler.removeEventListener("hardwareBackPress", this.backpress())
        );

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

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backpress());
    }

    backpress = () => {
        this.props.navigation.replace('allmessages');
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
                { text: "Delete Chat", onPress: () => { this.deletethismsg() } }
            ]

        );
    }

    deletethismsg = () => {
        this.setState({ showdel: true });

        let suid = firebase.auth().currentUser.uid;
        let guid = this.state.guestUserId;

        firebase.database().ref('Messages/' + suid).child(guid).remove();
        firebase.database().ref('Messages/' + guid).child(suid).remove();

        firebase.firestore().collection("Chatrooms").doc(suid).collection("allchat").doc(guid).delete();
        firebase.firestore().collection("Chatrooms").doc(guid).collection("allchat").doc(suid).delete();


        this.setState({ msgdisplay: '' });

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
                { text: "Block User", onPress: () => { this.blockuser() } }
            ]

        );
    }

    blockuser = () => {
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
                    visible={this.state.showdel}
                    duration={3000}
                    style={{ borderRadius: 9, backgroundColor: '#363636', width: '90%', height: 50, alignSelf: 'center', justifyContent: 'center', color: '#00cafd' }}
                    action={{
                        label: <Ionicons name="ios-checkbox" size={21} color="#00cafd" />
                    }}
                    onDismiss={() => this.setState({ showdel: false })}
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

                            <TouchableOpacity style={{ flex: 2.5, flexDirection: 'row', borderRadius: 50, padding: 3, }} onPress={() => this.props.navigation.navigate('viewacc', { userID: this.state.guestUserId })}>
                                <View style={{ borderWidth: 3, borderColor: this.state.color, borderRadius: 30, padding: 2.5 }}><Avatar.Image size={33} source={{ uri: this.state.guestimage }} style={{ backgroundColor: "#e4e4e4", }} /></View>
                                <View style={{ flex: 1, marginleft: 3, marginRight: 12 }}><Text numberOfLines={1} style={{ flexWrap: 'wrap', fontSize: 21, color: this.state.color, marginTop: 5, marginLeft: 9, fontWeight: "500" }}>{this.state.guestname}</Text></View>

                            </TouchableOpacity>


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
                                <TouchableRipple borderless={true} rippleColor="#fff" onPress={() => this.props.navigation.navigate('allmessages')}>
                                    <Ionicons name="close-circle-sharp" size={30} color={this.state.color} />
                                </TouchableRipple>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 9 }} >
                        <View style={{ flex: 18 }}>

                            <View style={{ marginTop: 5, paddingTop: 18 }}>

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

class ViewAccount extends React.Component {

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
        this.props.navigation.navigate('readmsg');
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
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('readmsg')}><View><Ionicons name="close" size={30} color={this.state.color} style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>

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
                                                <Text style={styles.labeld} key={0}>{item.height} ' {item.heightin}" </Text>

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
        backgroundColor: '#0fcdfc',
        margin: 4,
        borderColor: '#0db4de',
        alignContent: 'center',
        justifyContent: 'center',


    },


});
