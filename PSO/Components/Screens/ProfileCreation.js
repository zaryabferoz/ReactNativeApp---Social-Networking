import * as React from 'react';
import { Component } from 'react';
import firebase from 'firebase';
import { Text, View, TouchableOpacity, Dimensions, Image, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TouchableRipple, Avatar, Card, IconButton, Title, Paragraph, TextInput, Dialog, Portal, Chip, configureFonts, DefaultTheme, } from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import { Ionicons, AntDesign, MaterialIcons, Feather, Entypo, MaterialCommunityIcons, FontAwesome5, FontAwesome, Octicons,Fontisto } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import SwipeButton from 'rn-swipe-button';

const Change = createStackNavigator();

function Navi() {

    return (
        <Change.Navigator initialRouteName="ProfileScreen" screenOptions={{ headerShown: false }}>
            <Change.Screen name="cProfileScreen" component={ProfileScreen} />
            <Change.Screen name="cProfileEdit" component={ProfileEdit} />
        </Change.Navigator>
    );
}

export default class ProfileCreation extends Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff", }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width }}><Navi /></View>
            </View>

        );
    }
}


class ProfileScreen extends React.Component {

    state = {
        userinfos: [],
        link: '',
        color: '#e3e3e3',
        colortwo: '#fcfcfc',
        colorthree: '#fcfcfc',
        accstatus: "-",
        memstat:''
    }

    componentDidMount() {

        this.loadprofile();

    }

    loadprofile = () => {
        const suid = firebase.auth().currentUser.uid;
        const userdata = [];
        firebase.firestore()
            .collection('users').where('userid', '==', suid).get().then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const useraccstatus = documentSnapshot.data().accountStatus;
                    this.setState({ accstatus: useraccstatus });
                    const usermemstatus = documentSnapshot.data().memberStatus;
                    this.setState({ memstat: usermemstatus });
                    const usergender = documentSnapshot.data().gender;
                    const userprofile = documentSnapshot.data().profileimage;
                    this.setState({ link: userprofile });
                    const userdetail = documentSnapshot.data();

                    let Male = 'Male';
                    if (usergender === Male) { this.setState({ color: '#00cafd' }); this.setState({ colortwo: '#fb0d9b' }); this.setState({ colorthree: '#fd86cd' }) } else { this.setState({ color: '#fb0d9b' }); this.setState({ colortwo: '#00cafd' }); this.setState({ colorthree: '#a3ebfd' }) }
                    userdata.push(userdetail);
                    this.setState({ userinfos: [...userdata] });
                   
                })
               
            })


    }

    render() {

        return (
            <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ backgroundColor: '#fff', paddingLeft: 0, height: 'auto' }}>

                    <View style={{ flexDirection: "row", height: 43, paddingTop: 10, paddingBottom: 5, }}>
                        <View style={{ flex: 1, marginLeft: 10, width: '20%', justifyContent: 'center' }}>
                            <TouchableOpacity style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10 }} onPress={() => this.props.navigation.navigate('Home')}>
                                <MaterialIcons name="arrow-back-ios" size={20} color={this.state.color} style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5 }}>
                            <Text style={{ fontSize: 25, color: this.state.color, letterSpacing: -0.5 }}>User's Profile</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10, width: '20%', marginTop: -5, right: 0, justifyContent: 'center' }}>
                            <TouchableOpacity style={{  paddingTop: 10, paddingBottom: 10, paddingRight: 10 }} onPress={() => {
                                this.state.memstat != 'deleted' ? (this.props.navigation.push('cProfileEdit', { mainc: this.state.color, secondc: this.state.colortwo })):( firebase.auth().signOut())}}><View><Feather name="edit" size={27} color={this.state.color} style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 9 }}>
                        <View style={{ borderWidth: 4, borderRadius: 300, borderColor: this.state.color }}>
                            <View style={{ borderColor: '#fff', borderWidth: 4, borderRadius: 300 }}>
                                <Avatar.Image source={{ uri: this.state.link }} size={200} style={{ backgroundColor: "#e4e4e4" }} />

                            </View>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {
                            this.state.accstatus == 'verified' ?
                                (<View style={{ alignItems: 'center', width: 180, borderRadius: 30, marginTop: 9 }}>
                                    <Chip icon={() => <MaterialIcons name="verified-user" size={14} color="#fff" />} style={{ backgroundColor: this.state.color,  }} textStyle={{ fontSize: 12, color: '#FFF' }}>VERIFIED MEMBER</Chip>
                                </View>) : (this.state.accstatus == 'premium' ? (<View style={{ alignItems: 'center', width: 180, borderRadius: 30, borderColor: '#00cafd', marginTop: 9 }}>
                                    <Chip icon={() => <Fontisto name="star" size={14} color="#fff" />} style={{ backgroundColor: this.state.color }} textStyle={{ fontSize: 12, color: '#FFF', fontWeight: 'bold' }}>PREMIUM MEMBER</Chip>
                                </View>) : (
                                    <Chip icon={() => <FontAwesome5 name="exclamation-triangle" size={12} color="#fff" />} style={{ backgroundColor: this.state.color, marginTop: 9 }} textStyle={{ fontSize: 12.6, color: '#FFF' }}>NOT VERIFIED ACCOUNT</Chip>
                                ))
                        }
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
                                    <Text style={styles.labeld} key={0}>{item.height}' {item.heightin}"</Text>

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
                                    <Text style={styles.label} >SMOKE</Text>
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

                            <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20, borderRadius: 9, backgroundColor: this.state.colortwo, paddingTop: 14, paddingBottom: 5, marginBottom: 10 }}>
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
                                        <Text style={styles.labeli} style={{ color: this.state.colorthree }} >HEIGHT</Text>
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
                            <Text style={{ fontSize: 14, alignSelf: 'center', color: '#bfbfbf', marginTop: 3, marginBottom: 15, }}>PROFILE CREATED BY  :  {item.profilecreatedby}</Text>

                        </View>
                    ))}
                </View>

            </ScrollView >
        );

    }
}

class ProfileEdit extends React.Component {
    state = {
        uid: firebase.auth().currentUser.uid,
        profilecreatedby: null,
        visible: false,
        piclink: null,
        imgurl: null,
        primaryimg: null,
        username: null,
        gender: null,
        age: null,
        house: null,
        city: null,
        height: null,
        heightin: null,
        weight: null,
        complexion: null,
        education: null,
        degree: null,
        occupation: null,
        monthlyincome: null,
        religion: null,
        caste: null,
        smoke: null,
        maritalstatus: null,
        noofb: null,
        noofs: null,
        noofmb: null,
        noofms: null,
        lookingfor: null,
        pcomplexion: null,
        ppage: null,
        ppheight: null,
        ppeducation: null,
        ppnationality: null,
        color:"#d3d3d3",
        colortwo:"#d3d3d3"
    }

    componentDidMount() {
        const { route, navigation } = this.props;
        this.setState({ color: route.params.mainc });
        this.setState({ colortwo: route.params.secondc });
        const suid = firebase.auth().currentUser.uid;
        let imgref = firebase.storage().ref('users/' + suid).child('userimage');
        imgref.getDownloadURL().then((usrimg) => { this.setState({ primaryimg: usrimg }) });
    }

    showDialog = () => this.setState({ visible: true });
    hideDialog = () => this.setState({ visible: false });

    onUploadPic = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            this.setState({ imgurl: result.uri });
            this.setState({ primaryimg: this.state.imgurl });
            this.uploadImage(result.uri, "userprofile");
        }
      
        ref.getDownloadURL().then((usrimg) => {this.setState({ primaryimg: usrimg }) });
    }

    uploadImage = async (uri, name) => {
        const suid = firebase.auth().currentUser.uid;

        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref('users/' + suid).child('userimage');

        ref.put(blob).then(() => firebase.storage().ref('users/' + suid).child('userimage').getDownloadURL()).then((usrimg) => firebase.firestore().collection("users").doc(suid).update({ 'profileimage': usrimg }));;

    }

    onButtonPress = () => {
        this.props.navigation.replace('cProfileScreen');

    }

    render() {

        const suid = firebase.auth().currentUser.uid;
        const facebookIcon = () => (
            <AntDesign name="arrowright" size={24} color={this.state.color} />
        );

        return (
            <ScrollView style={{ backgroundColor: '#fff', }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

                <View style={{ flexDirection: "row", height: 40, }} >

                    <TouchableOpacity style={{ flex: 1.1, marginLeft: 14, width: '30%', justifyContent: 'center', flexDirection: 'row', marginTop: 8 }} onPress={() => this.props.navigation.replace('cProfileScreen')} >
                        <MaterialIcons name="arrow-back-ios" size={20} color={this.state.color} style={{ alignItems: 'flex-start', marginLeft: 0 }} />
                        <Text style={{ color: this.state.color }}>Profile</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -5 }}>
                        <Text style={{ fontSize: 25, color: this.state.color, letterSpacing: -0.4, }}>Edit Profile</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', marginTop: -3, right: 0, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={this.showDialog}><AntDesign name="questioncircleo" size={23} color={this.state.color} style={{ alignItems: 'flex-end' }} /></TouchableOpacity></View>
                    <Portal>
                        <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }} >
                            <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: this.state.color }}> <MaterialIcons name="drag-indicator" size={14} color={this.state.color} /> User Guide <MaterialIcons name="drag-indicator" size={14} color={this.state.color} />Edit Profile</Dialog.Title>
                            <Dialog.Content style={{ marginTop: -18, marginLeft: -6 }}>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> User can Edit / Update profile here.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Click Change profile for new picture.</Paragraph>
                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Select any field and change.</Paragraph>

                                <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Update profile at bottom of page.</Paragraph>
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 9 }}>
                    <View style={{ borderWidth: 4, borderRadius: 300, borderColor: this.state.color }}>
                        <View style={{ borderColor: '#fff', borderWidth: 4, borderRadius: 300 }}>
                            {(this.state.imgurl == null) ?
                                <Avatar.Image style={{ backgroundColor: "#fff" }} size={200} source={{ uri: this.state.primaryimg }} />
                                :
                                <Avatar.Image style={{ backgroundColor: "#fff" }} size={200} source={{ uri: this.state.imgurl }} />
                            }

                        </View>
                    </View>

                    <View style={{ borderWidth: 2, padding: 5, marginTop: 3, borderRadius: 20, borderColor: this.state.color, color: this.state.color, backgroundColor: this.state.color, marginTop: 6, marginBottom: 6 }}>
                        <Text style={{ color: "#fff", paddingLeft: 9, paddingRight: 8 }} onPress={this.onUploadPic} > Change Profile <MaterialCommunityIcons name="autorenew" size={14} color="#fff" /></Text>
                    </View>
                </View>
                <View style={{ marginTop: 3, alignContent: 'center', padding: 3, height: 40 }}>
                    <Text style={{ fontSize: 14, color: '#d3d3d3', letterSpacing: -0.4,alignSelf:'center' }}>CLICK <AntDesign name="questioncircle" size={14} color="#d3d3d3" /> ICON ABOVE FOR INFO.</Text>
                </View>
                <Text style={{ fontSize: 18, color: this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 2, marginTop: 0 }}>BASIC DETAILS</Text>
                <TextInput
                    underlineColor="#fff"
                    label="NAME"
                    value={this.state.username}
                    placeholder={this.state.username}
                    mode="outlined"
                    theme={{ colors: { text: '#7e7e7e', primary: '#939393', underlineColor: 'transparent', background: '#ffffff', height: 80 }, roundness: 8, height: 80 }}
                    style={styles.txtinput}
                    onBlur={() => Keyboard.dismiss()}
                    onChangeText={value => { this.setState({ username: value }); firebase.firestore().collection("users").doc(suid).update({ 'name': value }); }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'PROFILE CREATED BY', }}
                    items={[
                        { label: 'Self', value: 'SELF' },
                        { label: 'Parent', value: 'PARENT' },
                        { label: 'Relative', value: 'RELATIVE' },
                        { label: 'Gaurdian', value: 'GAURDIAN' },
                        { label: 'Friend', value: 'FRIEND' },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            profilecreatedby: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'profilecreatedby': value });
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />


                <RNPickerSelect
                    placeholder={{ label: 'GENDER', }}
                    items={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            gender: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'gender': value });
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'AGE', }}
                    items={[
                        { label: '21', value: 21 },
                        { label: '22', value: 22 },
                        { label: '23', value: 23 },
                        { label: '24', value: 24 },
                        { label: '25', value: 25 },
                        { label: '26', value: 26 },
                        { label: '27', value: 27 },
                        { label: '28', value: 28 },
                        { label: '29', value: 29 },
                        { label: '30', value: 30 },
                        { label: '31', value: 31 },
                        { label: '32', value: 32 },
                        { label: '33', value: 33 },
                        { label: '34', value: '34' },
                        { label: '35', value: '35' },
                        { label: '36', value: '36' },
                        { label: '36', value: '37' },
                        { label: '37', value: '38' },
                        { label: '38', value: '39' },
                        { label: '39', value: '40' },
                        { label: '40', value: '41' },
                        { label: '41', value: '42' },
                        { label: '42', value: '43' },
                        { label: '43', value: '44' },
                        { label: '45', value: '45' },
                        { label: '46', value: '46' },
                        { label: '47', value: '42' },
                        { label: '48', value: '43' },
                        { label: '49', value: '49' },
                        { label: '50', value: '50' },

                    ]}

                    onValueChange={value => {
                        if (value) {
                            this.setState({
                                age: value,
                            });
                            firebase.firestore().collection("users").doc(suid).update({ 'age': value })
                        }
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'HOUSE', }}
                    items={[
                        { label: 'Own', value: 'Own' },
                        { label: 'Rent', value: 'Rent' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            house: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'house': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'CITY', }}
                    items={[
                        { label: 'Karachi', value: 'Karachi' },
                        { label: 'Lahore', value: 'Lahore' },
                        { label: 'Islamabad', value: 'Islamabad' },
                        { label: 'Faisalabad', value: 'Faisalabad' },
                        { label: 'Rawalpindi', value: 'Rawalpindi' },
                        { label: 'Peshawar', value: 'Peshawar' },
                        { label: 'Quetta', value: 'Quetta' },
                        { label: 'Multan', value: 'Multan' },
                        { label: 'Hyderabad', value: 'Hyderabad' },
                        { label: 'Bahawalpur', value: 'Bahawalpur' },
                        { label: 'Sialkot', value: 'Sialkot' },
                        { label: 'Gujranwala', value: 'Gujranwala' },
                        { label: 'Sargodha', value: 'Sargodha' },
                        { label: '==== All Cities ====', value: '--' },
                        { label: 'None', value: 'N.A' },
                        { label: 'Abbotabad', value: 'Abbotabad' },
                       
                        { label: 'Arifwala', value: 'Arifwala' },
                        { label: 'Attock', value: 'Attock' },
                        { label: 'Bhera', value: 'Bhera' },
                        { label: 'Bhalwal', value: 'Bhalwal' },
                        { label: 'Bahawalnagar', value: 'Bahawalnagar' },
                        { label: 'Bhakkar', value: 'Bhakkar' },
                        { label: 'Burewala', value: 'Burewala' },
                        { label: 'Chenab Nagar', value: 'Chenab Nagar' },
                        { label: 'Chillianwala', value: 'Chillianwala' },
                        { label: 'Choa Saidanshah', value: 'Choa Saidanshah' },
                        { label: 'Chakwal', value: 'Chakwal' },
                        { label: 'Chak Jhumra', value: 'Chak Jhumra' },
                        { label: 'Charsadda', value: 'Charsadda' },
                        { label: 'Chichawatni', value: 'Chichawatni' },
                        { label: 'Chiniot', value: 'Chiniot' },
                        { label: 'Chishtian', value: 'Chishtian' },
                        { label: 'Chunian', value: 'Chunian' },
                        { label: 'Dajkot', value: 'Dajkot' },
                        { label: 'Daska', value: 'Daska' },
                  
                        { label: 'Darya Khan', value: 'Darya Khan' },
                        { label: 'Dera Ghazi Khan', value: 'Dera Ghazi Khan' },
                        { label: 'Dera Ismail Khan', value: 'Dera Ismail Khan' },
                        { label: 'Dhaular', value: 'Dhaular' },
                        { label: 'Dina', value: 'Dina' },
                       
                        { label: 'Dipalpur', value: 'Dipalpur' },

                        { label: 'Fateh Jang', value: 'Fateh Jang' },
                        { label: 'Ghakhar Mandi', value: 'Ghakhar Mandi' },
                        { label: 'Gojra', value: 'Gojra' },

                        { label: 'Gujrat', value: 'Gujrat' },
                        { label: 'Gujar Khan', value: 'Gujar Khan' },
                        { label: 'Harappa', value: 'Harappa' },
                        { label: 'Hafizabad', value: 'Hafizabad' },
                        { label: 'Haripur', value: 'Haripur' },
                        { label: 'Haroonabad', value: 'Haroonabad' },
                        
                        { label: 'Hasilpur', value: 'Hasilpur' },
                        { label: 'Haveli Lakha', value: 'Haveli Lakha' },
                        { label: 'Jalalpur Jattan', value: 'Jalalpur Jattan' },
                        { label: 'Jampur', value: 'Jampur' },
                        { label: 'Jaranwala', value: 'Jaranwala' },
                        { label: 'Jhang', value: 'Jhang' },
                        { label: 'Jhelum', value: 'Jhelum' },
                        { label: 'Kallar Syedan', value: 'Kallar Syedan' },
                        { label: 'Kalabagh', value: 'Kalabagh' },
                        { label: 'Karor Lal Esan', value: 'Karor Lal Esan' },
                        { label: 'Kasur', value: 'Kasur' },
                        { label: 'Kamalia', value: 'Kamalia' },
                        { label: 'Kāmoke', value: 'Kāmoke' },
                        { label: 'Khanewal', value: 'Khanewal' },
                        { label: 'Khanpur', value: 'Khanpur' },
                        { label: 'Khanqah Sharif', value: 'Khanqah Sharif' },
                        { label: 'Kharian', value: 'Kharian' },
                        { label: 'Khushab', value: 'Khushab' },
                        { label: 'Kohat', value: 'Kohat' },
                        { label: 'Kot Adu', value: 'Kot Adu' },
                        { label: 'Jauharabad', value: 'Jauharabad' },
                        { label: 'Lalamusa', value: 'Lalamusa' },
                        { label: 'Larkana', value: 'Larkana' },
                        { label: 'Layyah', value: 'Layyah' },
                 
                        { label: 'Liaquat Pur', value: 'Liaquat Pur' },
                        { label: 'Lodhran', value: 'Lodhran' },
                        { label: 'Malakwal', value: 'Malakwal' },
                      
                        { label: 'Mandi Bahauddin', value: 'Mandi Bahauddin' },
                        { label: 'Mian Channu', value: 'Mian Channu' },
                        { label: 'Mianwali', value: 'Mianwali' },
                        { label: 'Miani', value: 'Miani' },
                        { label: 'Mirpur Khas', value: 'Mirpur Khas' },
                        { label: 'Mingora', value: 'Mingora' },
                        { label: 'Murree', value: 'Murree' },
                        { label: 'Muridke', value: 'Muridke' },
                  
                        { label: 'Muzaffargarh', value: 'Muzaffargarh' },
                        { label: 'Narowal', value: 'Narowal' },
                        { label: 'Nankana Sahib', value: 'Nankana Sahib' },
                        { label: 'Nawabshah', value: 'Nawabshah' },
                        { label: 'Nowshera', value: 'Nowshera' },
                        { label: 'Okara', value: 'Okara' },
                        { label: 'Renala Khurd', value: 'Renala Khurd' },
                        { label: 'Pakpattan', value: 'Pakpattan' },
                        { label: 'Pattoki', value: 'Pattoki' },
                        { label: 'Pindi Bhattian', value: 'Pindi Bhattian' },
                        { label: 'Pind Dadan Khan', value: 'Pind Dadan Khan' },
                        { label: 'Pir Mahal', value: 'Pir Mahal' },
                        { label: 'Raiwind', value: 'Raiwind' },
                        { label: 'Rajanpur', value: 'Rajanpur' },
                        { label: 'Rahim Yar Khan', value: 'Rahim Yar Khan' },

                        { label: 'Sadiqabad', value: 'Sadiqabad' },
                        { label: 'Sagri', value: 'Sagri' },
                        { label: 'Sahiwal', value: 'Sahiwal' },
                        { label: 'Sambrial', value: 'Sambrial' },
                        { label: 'Samundri', value: 'Samundri' },
                        { label: 'Sangla Hill', value: 'Sangla Hill' },
                        { label: 'Sarai Alamgir', value: 'Sarai Alamgir' },
                        { label: 'Sawabi', value: 'Sawabi' },
                        { label: 'Shakargarh', value: 'Shakargarh' },
                        { label: 'Sheikhupura', value: 'Sheikhupura' },
                        { label: 'Sohawa', value: 'Sohawa' },
                        { label: 'Sukkar', value: 'Sukkar' },
                        { label: 'Tandlianwala', value: 'Tandlianwala' },
                        { label: 'Talagang', value: 'Talagang' },
                        { label: 'Taxila', value: 'Taxila' },
                        { label: 'Toba Tek Singh', value: 'Toba Tek Singh' },
                        { label: 'Vehari', value: 'Vehari' },
                        { label: 'Wah Cantonment', value: 'Wah Cantonment' },
                        { label: 'Wazirabad', value: 'Wazirabad' },
                        { label: 'Other', value: 'Other' },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            city: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'city': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <Text style={{ fontSize: 18, color: this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>YOUR APPEARANCE</Text>


                <RNPickerSelect
                    placeholder={{ label: 'HEIGHT - Feet', }}
                    items={[
                        { label: '4 ft', value: 4 },
                        { label: '5 ft', value: 5 },
                        { label: '6 ft', value: 6 },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            height: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'height': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'HEIGHT - Inches', }}
                    items={[
                        { label: '0 inches', value: 0 },
                        { label: '1 inches', value: 1 },
                        { label: '2 inches', value: 2 },
                        { label: '3 inches', value: 3 },
                        { label: '4 inches', value: 4 },
                        { label: '5 inches', value: 5 },
                        { label: '6 inches', value: 6 },
                        { label: '7 inches', value: 7 },
                        { label: '8 inches', value: 8 },
                        { label: '9 inches', value: 9 },
                        { label: '10 inches', value: 10 },
                        { label: '11 inches', value: 11 },
                        { label: '12 inches', value: 12 },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            heightin: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'heightin': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />


                <RNPickerSelect
                    placeholder={{ label: 'WEIGHT', }}
                    items={[
                        { label: '41 kg', value: '41' },
                        { label: '42 kg', value: '42' },
                        { label: '43 kg', value: '43' },
                        { label: '44 kg', value: '44' },
                        { label: '45 kg', value: '45' },
                        { label: '46 kg', value: '46' },
                        { label: '47 kg', value: '47' },
                        { label: '48 kg', value: '48' },
                        { label: '49 kg', value: '49' },
                        { label: '50 kg', value: '50' },

                        { label: '51 kg', value: '51' },
                        { label: '52 kg', value: '52' },
                        { label: '53 kg', value: '53' },
                        { label: '54 kg', value: '54' },
                        { label: '55 kg', value: '55' },
                        { label: '56 kg', value: '56' },
                        { label: '57 kg', value: '57' },
                        { label: '58 kg', value: '58' },
                        { label: '59 kg', value: '59' },
                        { label: '60 kg', value: '60' },

                        { label: '61 kg', value: '61' },
                        { label: '62 kg', value: '62' },
                        { label: '63 kg', value: '63' },
                        { label: '64 kg', value: '64' },
                        { label: '65 kg', value: '65' },
                        { label: '66 kg', value: '66' },
                        { label: '67 kg', value: '67' },
                        { label: '68 kg', value: '68' },
                        { label: '69 kg', value: '69' },
                        { label: '70 kg', value: '70' },

                        { label: '71 kg', value: '71' },
                        { label: '72 kg', value: '72' },
                        { label: '73 kg', value: '73' },
                        { label: '74 kg', value: '74' },
                        { label: '75 kg', value: '75' },
                        { label: '76 kg', value: '76' },
                        { label: '77 kg', value: '77' },
                        { label: '77 kg', value: '78' },
                        { label: '78 kg', value: '79' },
                        { label: '79 kg', value: '80' },

                        { label: '81 kg', value: '81' },
                        { label: '82 kg', value: '82' },
                        { label: '83 kg', value: '83' },
                        { label: '84 kg', value: '84' },
                        { label: '85 kg', value: '85' },
                        { label: '86 kg', value: '86' },
                        { label: '87 kg', value: '87' },
                        { label: '88 kg', value: '88' },
                        { label: '89 kg', value: '89' },
                        { label: '90 kg', value: '90' },

                        { label: '91 kg', value: '91' },
                        { label: '92 kg', value: '92' },
                        { label: '93 kg', value: '93' },
                        { label: '94 kg', value: '94' },
                        { label: '95 kg', value: '95' },
                        { label: '96 kg', value: '96' },
                        { label: '97 kg', value: '97' },
                        { label: '98 kg', value: '98' },
                        { label: '99 kg', value: '99' },
                        { label: '100 kg', value: '100' },
                        { label: '105 kg', value: '105' },
                        { label: '110 kg', value: '110' },
                        { label: '115 kg', value: '115' },
                        { label: '120 kg', value: '120' },
                        { label: '130 kg', value: '130' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            weight: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'weight': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'COMPLEXION', }}
                    items={[
                        { label: 'Very Fair', value: 'Very Fair' },
                        { label: 'Fair', value: 'Fair' },
                        { label: 'Light Wheatish', value: 'Light Wheatish' },
                        { label: 'Wheatish', value: 'Wheatish' },
                        { label: 'Dim Wheatish', value: 'Dim Wheatish' },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            complexion: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'complexion': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <Text style={{ fontSize: 18, color:this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>EDUCATION & OCCUPATION</Text>

                <RNPickerSelect
                    placeholder={{ label: 'EDUCATION', }}
                    items={[
                        { label: 'Inter', value: 'Inter' },
                        { label: 'BS', value: 'BS' },
                        { label: 'MS', value: 'MS' },
                        { label: 'PhD', value: 'Ph.D' },
                    ]}

                    onValueChange={value => {
                        if (value != null) {
                            this.setState({
                                education: value,
                            });
                            firebase.firestore().collection("users").doc(suid).update({ 'education': value })
                        }
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'DEGREE / FIELD / TITLE', }}
                    items={[
                        { label: 'Choose Best Option' },
                        { label: 'Accouting / Finance', value: 'Accouting / Finance' },
                        { label: 'Architect', value: 'Architect' },
                        { label: 'Arts', value: 'Arts' },
                        { label: 'Aviation', value: 'Aviation' },
                        { label: 'Banker', value: 'Banker' },
                        { label: 'BBA', value: 'BBA' },
                        { label: 'BDS', value: 'BDS' },
                        { label: 'Charatered Accountant', value: 'Charatered Accountant' },
                        { label: 'Chemist', value: 'Chemist' },
                        { label: 'Diploma', value: 'Diploma' },
                        { label: 'Doctor', value: 'Doctor' },
                        { label: 'Economics', value: 'Economics' },
                        { label: 'Engineer', value: 'Engineer' },
                        { label: 'Engineer - Civil', value: 'Engineer - Civil' },
                        { label: 'Engineer - Electrical', value: 'Engineer - Electrical' },
                        { label: 'Engineer - Chemical', value: 'Engineer -Chemical' },
                        { label: 'Engineer - Mechanical', value: 'Engineer - Software' },
                        { label: 'Engineer - Software', value: 'Engineer - Software' },
                        { label: 'Health Worker', value: 'Health Worker' },
                        { label: 'IT / Computer Science', value: 'IT / Computer Science' },
                        { label: 'Law', value: 'Law' },
                        { label: 'Literature', value: 'Literature' },
                        { label: 'Math / Stats', value: 'Math / Stats' },
                        { label: 'MBA', value: 'MBA' },
                        { label: 'MBBS', value: 'MBBS' },
                        { label: 'Media', value: 'Media' },
                        { label: 'Medical', value: 'Medical' },
                        { label: 'Pharmacist', value: 'Pharmacist' },
                        { label: 'Science', value: 'Science' },
                        { label: 'None', value: 'None' },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            degree: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'degree': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'OCCUPATION', }}
                    items={[
                        { label: 'Govt Job', value: 'Govt Job' },
                        { label: 'Private Job', value: 'Private Job' },
                        { label: 'Business', value: 'Business' },
                        { label: 'None', value: 'N.A' },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            occupation: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'occupation': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'MONTHLY INCOME (PKR)', }}
                    items={[
                        { label: 'None', value: 'None' },
                        { label: 'Approx 25 K or Plus', value: '25 K' },
                        { label: 'Approx 50 K or Plus', value: '50 K' },
                        { label: 'Approx 1 Lac or Plus', value: '100 K' },
                        { label: 'Approx 2 Lac or Plus', value: '200 K' },
                        { label: 'Approx 5 Lac or Above', value: '500 K' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            monthlyincome: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'monthlyincome': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <Text style={{ fontSize: 18, color: this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>SOCIAL & RELIGION STATUS</Text>

                <RNPickerSelect
                    placeholder={{ label: 'RELIGION', }}
                    items={[
                        { label: 'Islam', value: 'Islam' },
                        { label: 'Hindu', value: 'Hindu' },
                        { label: 'Sikh', value: 'Sikh' },
                        { label: 'Christian', value: 'Christian' },
                        { label: 'None', value: 'None' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            religion: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'religion': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'CASTE / ORIGIN', }}
                    items={[

                        { label: 'Arian', value: 'Arian' },
                        { label: 'Bangash', value: 'Bangash' },
                        { label: 'Butt', value: 'Butt' },
                        { label: 'Gujjar', value: 'Gujjar' },
                        { label: 'Jatt', value: 'Jatt' },
                        { label: 'Kamboh', value: 'Kamboh' },
                        { label: 'Khokhar', value: 'Khokhar' },
                        { label: 'Mughal', value: 'Mughal' },
                        { label: 'Pathan', value: 'Pathan' },
                        { label: 'Qureshi', value: 'Qureshi' },
                        { label: 'Rajput', value: 'Rajput' },
                        { label: 'Randhawa', value: 'Randhawa' },
                        { label: 'Sheikh', value: 'Sheikh' },
                        { label: 'Syed', value: 'Syed' },
                        { label: 'Virk', value: 'Virk' },
                        { label: '- OR -' },
                        { label: 'Punjabi', value: 'Punjabi' },
                        { label: 'Sindhi', value: 'Sindhi' },
                        { label: 'Baclochi', value: 'Balochi' },
                        { label: 'Pakhtoon', value: 'Pakhtoon' },
                        { label: 'Saraiki', value: 'Saraiki' },
                        { label: 'Gilgiti', value: 'Gilgiti' },
                        { label: 'Other', value: 'N.A' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            caste: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'caste': value })

                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'CITIZENSHIP', }}
                    items={[
                        { label: 'Pakistani', value: 'Pakistani' },
                        { label: 'American', value: 'American' },
                        { label: 'European', value: 'European' },
                        { label: 'British', value: 'British' },
                        { label: 'Australian', value: 'Australian' },
                        { label: 'Other', value: 'Other' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            citizenship: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'citizenship': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'SMOKE', }}
                    items={[
                        { label: 'No Smoking', value: 'No' },
                        { label: 'Yes Smoking', value: 'Yes' },


                    ]}

                    onValueChange={value => {
                        this.setState({
                            smoke: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'smoke': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'MARITAL STATUS', }}
                    items={[
                        { label: 'Unmarried', value: 'Unmarried' },
                        { label: 'Widowed', value: 'Widowed' },
                        { label: 'Divorced', value: 'Divorced' },
                        { label: 'Separated', value: 'Separated' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            maritalstatus: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'maritalstatus': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />


                <Text style={{ fontSize: 18, color: this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>FAMILY STATUS</Text>


                <RNPickerSelect
                    placeholder={{ label: 'NUMBER OF BROTHERS', }}
                    items={[
                        { label: '0', value: '0' },
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                        { label: '3', value: '3' },
                        { label: '4', value: '4' },
                        { label: '5', value: '5' },
                        { label: '6', value: '6' },
                        { label: '7', value: '7' },
                        { label: '8', value: '8' },
                        { label: '9', value: '9' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            noofb: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'noofb': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'NUMBER OF SISTERS', }}
                    items={[
                        { label: '0', value: '0' },
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                        { label: '3', value: '3' },
                        { label: '4', value: '4' },
                        { label: '5', value: '5' },
                        { label: '6', value: '6' },
                        { label: '7', value: '7' },
                        { label: '8', value: '8' },
                        { label: '9', value: '9' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            noofs: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'noofs': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />


                <Text style={{ fontSize: 18, color: this.state.colortwo, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>PARTNER PREFERENCE</Text>

                <RNPickerSelect
                    placeholder={{ label: 'LOOKING FOR', }}
                    items={[
                        { label: 'Unmarried', value: 'Unmarried' },
                        { label: 'Widowed', value: 'Widowed' },
                        { label: 'Divorced', value: 'Divorced' },
                        { label: 'Separated', value: 'Separated' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            lookingfor: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'lookingfor': value })
                    }}

                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />


                <RNPickerSelect
                    placeholder={{ label: 'COMPLEXION', }}
                    items={[
                        { label: 'Very Fair', value: 'Very Fair' },
                        { label: 'Fair', value: 'Fair' },
                        { label: 'Light Wheatish', value: 'Light Wheatish' },
                        { label: 'Wheatish', value: 'Wheatish' },
                        { label: 'Dim Wheatish', value: 'Dim Wheatish' },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            ppcomplexion: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'ppcomplexion': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'AGE', }}
                    items={[
                        { label: '21', value: 21 },
                        { label: '22', value: 22 },
                        { label: '23', value: 23 },
                        { label: '24', value: 24 },
                        { label: '25', value: 25 },
                        { label: '26', value: 26 },
                        { label: '27', value: 27 },
                        { label: '28', value: 28 },
                        { label: '29', value: 29 },
                        { label: '30', value: 30 },
                        { label: '31', value: 31 },
                        { label: '32', value: 32 },
                        { label: '33', value: 33 },
                        { label: '34', value: 34 },
                        { label: '35', value: 35 },
                        { label: '36', value: 36 },
                        { label: '36', value: 37 },
                        { label: '37', value: 38 },
                        { label: '38', value: 39 },
                        { label: '39', value: 40 },
                        { label: '40', value: 41 },
                        { label: '41', value: 42 },
                        { label: '42', value: 43 },
                        { label: '43', value: 44 },
                        { label: '45', value: 45 },
                        { label: '46', value: 46 },
                        { label: '47', value: 47 },
                        { label: '48', value: 48 },
                        { label: '49', value: 49 },
                        { label: '50', value: 50 },
                    ]}

                    onValueChange={value => {
                        this.setState({
                            ppage: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'ppage': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'HEIGHT', }}
                    items={[
                        { label: '4.10 ft', value: 4.10 },
                        { label: '4.11 ft', value: 4.11 },
                        { label: '5.0 ft', value: 5.0 },
                        { label: '5.1 ft', value: 5.1 },
                        { label: '5.2 ft', value: 5.2 },
                        { label: '5.3 ft', value: 5.3 },
                        { label: '5.4 ft', value: 5.4 },
                        { label: '5.5 ft', value: 5.5 },
                        { label: '5.6 ft', value: 5.6 },
                        { label: '5.7 ft', value: 5.7 },
                        { label: '5.8 ft', value: 5.8 },
                        { label: '5.9 ft', value: 5.9 },
                        { label: '5.10 ft', value: 5.10 },
                        { label: '5.11 ft', value: 5.11 },
                        { label: '6.1 ft', value: 6.1 },
                        { label: '6.2 ft', value: 6.2 },
                        { label: '6.3 ft', value: 6.3 },
                        { label: '6.4 ft', value: 6.4 },
                        { label: '6.5 ft', value: 6.5 },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            ppheight: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'ppheight': value })
                    }}

                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'EDUCATION', }}
                    items={[
                        { label: 'Inter', value: 'Inter' },
                        { label: 'BS', value: 'BS' },
                        { label: 'MS', value: 'MS' },
                        { label: 'PhD', value: 'PhD' },

                    ]}

                    onValueChange={value => {
                        this.setState({
                            ppeducation: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'ppeducation': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <RNPickerSelect
                    placeholder={{ label: 'NATIONALITY', }}
                    items={[
                        { label: 'Pakistani', value: 'Pakistani' },
                        { label: 'American', value: 'American' },
                        { label: 'European', value: 'European' },
                        { label: 'British', value: 'British' },
                        { label: 'Australian', value: 'Australian' },
                        { label: 'Other', value: 'Other' },
                    ]}
                    onValueChange={value => {
                        this.setState({
                            ppnationality: value,
                        });
                        firebase.firestore().collection("users").doc(suid).update({ 'ppnationality': value })
                    }}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 18,
                            right: 30,
                            color: "#3333"
                        },
                    }}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow', color: "#7e7e7e" }}
                    Icon={() => {
                        return <MaterialIcons name="keyboard-arrow-down" size={24} color="#7e7e7e" />
                    }}
                />

                <Text style={{ paddingLeft: 20, fontSize: 18, color: this.state.color, letterSpacing: -0.4, marginBottom: 2, marginTop: 15, marginLeft: 4 }}>UPDATE ACCOUNT </Text>
                <View style={{ marginRight: 12, marginLeft: 12, marginTop: 0, marginBottom: 20 }}>

                    <SwipeButton
                        enableRightToLeftSwipe
                        thumbIconBackgroundColor="#FFFFFF"
                        thumbIconComponent={facebookIcon}
                        title="CLICK HERE AND SLIDE"
                        titleFontSize={16}
                        height={72}

                        railBackgroundColor={this.state.color}
                        thumbIconBorderColor={this.state.color}
                        thumbIconBackgroundColor="#fff"
                        railBorderColor={this.state.color}
                        railFillBorderColor={this.state.color}
                        titleColor="#FFF"
                        railStyles={{
                            backgroundColor: this.state.color,
                            borderColor: "#fff",
                        }}
                        onSwipeSuccess={this.onButtonPress}
                    />
                </View>

            </ScrollView >


        );
    }
}


const styles = StyleSheet.create({
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
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        color: 'grey',
        borderWidth: 1,
        borderColor: '#7e7e7e',
        borderRadius: 10,
        paddingRight: 30,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 8
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        color: 'grey',
        borderWidth: 1,
        borderColor: '#7e7e7e',
        borderRadius: 10,
        paddingRight: 30,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 8
    },
});

