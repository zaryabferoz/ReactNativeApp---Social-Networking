import React, { Component } from 'react';
import firebase from 'firebase'
import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions, Alert, TextInput, Keyboard, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import { Ionicons, AntDesign, MaterialIcons, Feather, Entypo, } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableRipple, Avatar, Card, IconButton, Title, Paragraph, Dialog, Portal, TextInput as Tin } from 'react-native-paper';
import SwitchSelector from 'react-native-switch-selector';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import SwipeButton from 'rn-swipe-button';


var logopso = require('./logopso.png');

const Change = createStackNavigator();

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

function NaviUser() {

    return (
        <Change.Navigator initialRouteName="create" screenOptions={{ headerShown: false, animationEnabled: false, }}>

            <Change.Screen name="create" component={SignUpPage} />
            <Change.Screen name="sign" component={SignInPage} />
            <Change.Screen name="tnc" component={TermPage} />
            <Change.Screen name="forgetpass" component={ForgetPass} />
            <Change.Screen name="createuacc" component={CreateUserAcc} />


        </Change.Navigator>
    );
}

export default class CreateAcc extends Component {

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width }}><NaviUser /></View>
            </View>

        );
    }
}

class SignUpPage extends Component {
    state = {
        email: null,
        password: null,
        confirmpass: null,
        error: ''
    }

    onButtonPress = () => {

        var passlen = JSON.stringify(this.state.password);
        var passw = passlen.length;

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (this.state.email != null && reg.test(this.state.email) === true && passw > 7 && this.state.password != null && this.state.confirmpass == this.state.password) {

            this.props.navigation.navigate('createuacc', { email: this.state.email, password: this.state.password });

        } else (this.setState({ error: 'Blank Fields / Email is not Valid / Password Must be 6 digits or Password Mismatch. Try Again' }))
    }

    render() {

        return (
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', backgroundColor: "#fff" }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', }}>

                    <Image source={logopso} style={{ height: 100, width: 260, marginBottom: 9 }} />

                    <TextInput style={styles.inputViewCreate}
                        placeholder="Enter Email"
                        placeholderTextColor="#333333"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />

                    <TextInput style={styles.inputViewCreate}
                        placeholder="Enter Password"
                        placeholderTextColor="#333333"
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />

                    <TextInput style={styles.inputViewCreate}

                        placeholder="Confirm Password"
                        placeholderTextColor="#333333"
                        secureTextEntry={true}
                        value={this.state.confirmpass}
                        onChangeText={confirmpass => this.setState({ confirmpass })}
                    />

                    <Text style={{ marginTop: 10, marginBottom: 10, color: '#c0c0c0', fontSize: 13 }}><Feather name="check-square" size={14} color="#21b3eb" /> I agree <Text style={{ textDecorationLine: "underline", color: '#21b3eb', fontSize: 13 }} onPress={() => this.props.navigation.navigate("tnc")}>Terms & Conditions</Text></Text>

                    <TouchableRipple onPress={this.onButtonPress} rippleColor="#fff" borderless={true}>
                        <Text style={styles.buttonText}>
                            Create My Account
                      </Text>
                    </TouchableRipple>


                    <Text style={{ marginTop: 30, color: '#c0c0c0' }}>Already have Account?  <Text style={{ textDecorationLine: "underline", fontWeight: 'bold', color: '#00cafd' }} onPress={() => this.props.navigation.navigate("sign")}>Sign In</Text></Text>

                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#DC143C' }}>{this.state.error}</Text>
                </View>
            </ScrollView>

        );
    }
}

class SignInPage extends Component {
    state = {
        email: '',
        password: '',
        error: ''
    }

    onButtonPress = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(this.onLoginSuccess)
            .catch(err => {
                this.setState({
                    error: err.message
                })
            });
    }

    onLoginSuccess = () => {
        this.setState({
            error: ''
        })
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', backgroundColor: "#fff" }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', }}>

                    <Image source={logopso} style={{ height: 100, width: 260, marginBottom: 9 }} r />

                    <TextInput style={styles.inputView}
                        placeholder="Enter Email"
                        placeholderTextColor="#333333"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />

                    <TextInput style={styles.inputView}
                        placeholder="Enter Password"
                        placeholderTextColor="#333333"
                        secureTextEntry={true}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />


                    <TouchableRipple onPress={this.onButtonPress} rippleColor="#fff" borderless={true}>
                        <Text style={styles.buttonText}>
                            SIGN IN
                      </Text>
                    </TouchableRipple>



                    <Text style={{ marginTop: 30, color: '#c0c0c0', alignSelf: 'center' }}>Create New Account !  <Text style={{ textDecorationLine: "underline", fontWeight: 'bold', color: '#00cafd' }} onPress={() => this.props.navigation.navigate("create")}>Sign Up</Text></Text>
                    <Text style={{ color: "#00cafd", marginBottom: 20, marginTop: 50 }} onPress={() => this.props.navigation.navigate('forgetpass')}>Forgot Password ?</Text>
                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#DC143C' }}>{this.state.error}</Text>
                </View>
            </ScrollView>


        );
    }
}

class TermPage extends React.Component {
    render() {
        return (
            <ScrollView style={{ backgroundColor: "#ffffff", }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", paddingTop: 18, }} >


                    <View style={{ flex: 3, marginLeft: 20, marginTop: -5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 21, color: '#00cafd', letterSpacing: -0.4, fontFamily: 'dmcapf' }}>Terms & Conditions</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', right: 0, justifyContent: 'center', marginTop: -3 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('create')}><View><Ionicons name="close" size={30} color='#00cafd' style={{ alignItems: 'flex-end' }} /></View></TouchableOpacity></View>
                </View>
                <View>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>By using this application, you agree with our terms and conditions.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>1. Be Kind and Courteous.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>2. No Hate Speech, Bullying or Indecent Behaviour.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>3. Shadee.org name, brand and all digital assets belongs to their respective owners.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>4. Shadee.org will not be responsible for any conflict or dispute between one, two or more people or group of people. This application is only for age 21 and above.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>5. Shadee.org is software as a service application. We charge service fees as membership from individual person by their own will and once charges or fees are paid cannot be refunded or return in any case.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>6. Shadee.org reserve the right to ban / delete account / delete data of any individual member.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>7. Communication via messages on our platform should be in decency limits. Communication via messages between two individuals are with their consent and responsibility.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>8. Shadee.org cannot be held accountable legally in any case from members perspective and usage of application.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>9. User of application must have to follow our in app guidelines.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>10. Shadee.org reserve the right to change / modify our terms and conditions anytime.</Text>
                    <Text style={{ marginTop: 10, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>11. You agree with all terms and conditions stated above and by using application you agree with our policy and terms.</Text>
                    <Text style={{ marginTop: 10, marginBottom: 30, fontSize: 16, color: '#909090', textAlign: 'justify', marginLeft: 20, marginRight: 20, lineHeight: 27 }}>I agree with all terms and conditions.</Text>
                </View>
            </ScrollView>
        );
    }
}

class ForgetPass extends Component {

    state = {
        email: '',
        errors: '',
        confirmsent: ''
    }

    resetpass = () => {
        var auth = firebase.auth();
        var emailAddress = this.state.email;

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        try {
            if (this.state.email != null && reg.test(this.state.email) === true) {

                auth.sendPasswordResetEmail(emailAddress).then(() => {
                    ToastAndroid.show("Email Sent!", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                }).catch(function (err) {
                    this.setState({ error: err })
                });
            } else {this.setState({ error: 'Email is invalid' })}7
        } catch (err) {
            this.setState({ error: err })
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', backgroundColor: "#fff" }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', }}>

                    <Image source={logopso} style={{ height: 100, width: 260, marginBottom: 9 }} r />

                    <TextInput style={styles.inputView}
                        placeholder="Enter Email"
                        placeholderTextColor="#333333"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />

                    <TouchableOpacity onPress={this.resetpass} >
                        <Text style={styles.buttonText}>
                            Reset Password
                    </Text>
                    </TouchableOpacity>

                    <Text style={{ marginTop: 30, color: '#c0c0c0' }}>Create New Account !  <Text style={{ textDecorationLine: "underline", fontWeight: 'bold', color: '#00cafd' }} onPress={() => this.props.navigation.navigate("create")}>Sign Up</Text></Text>

                    <Text style={{ textAlign: 'center', marginTop: 20, color: '#DC143C' }}>{this.state.error}</Text>
                </View>
            </ScrollView>
        );
    }
}

class CreateUserAcc extends React.Component {
    state = {
        errors: '',
        setid: '',
        uid: null,
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
        citizenship: null,
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
        dwnlink: '',
        color: '#00cafd',
        colortwo: '#fb0d9b'
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
        }

    }

    uploadImage = async (cuid, uri, name) => {

        const response = await fetch(uri);
        const blob = await response.blob();

        var ref = firebase.storage().ref('users/' + cuid).child('userimage');

        ref.put(blob).then(() => firebase.storage().ref('users/' + cuid).child('userimage').getDownloadURL()).then((usrimg) => firebase.firestore().collection("users").doc(cuid).update({ 'profileimage': usrimg }));

    }



    onButtonPress = () => {


        if (this.state.username !== null && this.state.gender !== null && this.state.age !== null && this.state.house !== null && this.state.city !== null && this.state.height !== null && this.state.heightin !== null && this.state.weight !== null && this.state.complexion !== null && this.state.education !== null && this.state.degree !== null && this.state.occupation !== null && this.state.monthlyincome !== null && this.state.religion !== null && this.state.caste !== null && this.state.smoke !== null && this.state.maritalstatus !== null && this.state.noofb !== null && this.state.noofs !== null && this.state.lookingfor !== null && this.state.pcomplexion !== null && this.state.ppage !== null && this.state.ppheight !== null && this.state.ppeducation !== null && this.state.ppnationality !== null && this.state.citizenship !== null) {
            this.setState({ errors: '' });
            this.proceedButton();

        } else {
            this.setState({ errors: 'All Fields Required, Please Add and Try Again.' });
        }
    }

    proceedButton = () => {
        const { route, navigation } = this.props;
        const uemail = route.params.email;
        const upass = route.params.password;


        const uprofilecreatedby = this.state.profilecreatedby; const umemberStatus = this.state.memberStatus; const ucitizen = this.state.citizenship;
        const uname = this.state.username; const ugender = this.state.gender; const uage = this.state.age; const uhouse = this.state.house; const ucity = this.state.city;
        const uheight = this.state.height; const uheightin = this.state.heightin; const uweight = this.state.weight; const ucomplexion = this.state.complexion; const ueducation = this.state.education; const udegree = this.state.degree;
        const uoccupation = this.state.occupation; const umonthlyincome = this.state.monthlyincome; const ureligion = this.state.religion; const ucaste = this.state.caste; const usmoke = this.state.smoke;
        const umaritalstatus = this.state.maritalstatus; const unoofb = this.state.noofb; const unoofs = this.state.noofs; const unoofmb = this.state.noofmb; const unoofms = this.state.noofms;
        const ulookingfor = this.state.lookingfor; const upcomplexion = this.state.pcomplexion; const uppage = this.state.ppage; const uppheight = this.state.ppheight; const uppeducation = this.state.ppeducation; const uppnationality = this.state.ppnationality;

        var db = firebase.firestore();

        firebase.auth().createUserWithEmailAndPassword(uemail, upass).then((res) => {
            var cuid = res.user.uid;
            var uri = this.state.imgurl;

            var data = {
                accountStatus: 'notverified',
                memberStatus: 'nothide',
                userid: res.user.uid,
                profileimage: this.state.primaryimg,
                profilecreatedby: uprofilecreatedby,
                name: uname,
                gender: ugender,
                age: uage,
                house: uhouse,
                city: ucity,
                height: uheight,
                citizenship: ucitizen,
                heightin: uheightin,
                weight: uweight,
                complexion: ucomplexion,
                education: ueducation,
                degree: udegree,
                occupation: uoccupation,
                monthlyincome: umonthlyincome,
                religion: ureligion,
                caste: ucaste,
                smoke: usmoke,
                maritalstatus: umaritalstatus,
                noofb: unoofb,
                noofs: unoofs,
                noofmb: unoofmb,
                noofms: unoofms,
                lookingfor: ulookingfor,
                ppcomplexion: upcomplexion,
                ppage: uppage,
                ppheight: uppheight,
                ppeducation: uppeducation,
                ppnationality: uppnationality,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                updatetime: firebase.firestore.FieldValue.serverTimestamp()
            };


            var setUserData = db.collection("users").doc(cuid);
            setUserData.set(data);
            this.uploadImage(cuid, uri, "userprofile");

        }).catch(
            err => {
                this.setState({
                    errors: err.message
                })
            }
        );

    }

    render() {

        const facebookIcon = () => (
            <AntDesign name="arrowright" size={24} color={this.state.color} />
        );

        return (
            <ScrollView style={{ backgroundColor: '#fff', }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <View style={{ paddingTop: 30, marginBottom: 30 }}>
                    <View style={{ flexDirection: "row", height: 40, }} >

                        <View style={{ flex: 2, marginLeft: 20, flexDirection: 'row', marginTop: 8 }} >
                            <Ionicons name="arrow-back-circle" size={32} color={this.state.color} style={{ marginTop: 1, }} onPress={() => this.props.navigation.goBack()} />
                            <Text style={{ color: this.state.color, fontSize: 25, letterSpacing: -0.3 }}>  Create Profile</Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 20, width: '20%', marginTop: 9, right: 0, justifyContent: 'center' }}>
                            <TouchableOpacity onPress={this.showDialog}><Feather name="info" size={27} color={this.state.color} style={{ alignItems: 'flex-end' }} /></TouchableOpacity></View>
                        <Portal>
                            <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{ borderRadius: 18 }} >
                                <Dialog.Title style={{ marginTop: 18, marginLeft: 14, color: "#04b3df" }}> <MaterialIcons name="drag-indicator" size={14} color="#04b3df" /> Info  <Feather name="info" size={16} color="#04b3df" /> </Dialog.Title>
                                <Dialog.Content style={{ marginTop: -18, marginLeft: -6 }}>
                                    <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Build Profile in 2 mins.</Paragraph>
                                    <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Add your great profile picture or</Paragraph>
                                    <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Profile pic that gives glimpse of you.</Paragraph>
                                    <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Hide your profile when signed in.</Paragraph>
                                    <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Profile pic cannot be zoomed.</Paragraph>
                                    <Paragraph style={{ paddingTop: 10, color: "#787878" }}><Entypo name="dot-single" size={16} color="#787878" /> Secure and privacy oriented app.</Paragraph>
                                </Dialog.Content>
                            </Dialog>
                        </Portal>
                    </View>
                    <View style={{ marginLeft: '5%', marginRight: '5%', marginBottom: 10, marginTop: 0 }}>
                        <TouchableRipple style={{ width: '90%', height: 45, backgroundColor: this.state.color, justifyContent: 'center', borderRadius: 90, marginTop: 18, borderTopLeftRadius: 18, borderBottomLeftRadius: 18, borderTopRightRadius: 90, borderBottomRightRadius: 90 }}>
                            <Text style={{ fontSize: 17, paddingLeft: 48, color: '#fff' }}>Lets' Build Profile ...</Text>
                        </TouchableRipple>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
                        <View style={{ borderWidth: 4, borderRadius: 300, borderColor: this.state.color }}>
                            <View style={{ borderColor: '#fff', borderWidth: 4, borderRadius: 300 }}>
                                {(this.state.imgurl == null) ?
                                    <Avatar.Image style={{ backgroundColor: "#eeeeee" }} size={200} source={{ uri: this.state.primaryimg }} />
                                    :
                                    <Avatar.Image style={{ backgroundColor: "#eeeeee" }} size={200} source={{ uri: this.state.imgurl }} />
                                }
                            </View>
                        </View>

                        <View style={{ borderWidth: 2, padding: 5, marginTop: 3, borderRadius: 20, borderColor: this.state.color, backgroundColor: this.state.color, marginTop: 6, marginBottom: 6 }}>
                            <Text style={{ color: "#fff", paddingLeft: 9, paddingRight: 8 }} onPress={this.onUploadPic} > Add / Change Profile </Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 3, alignContent: 'center', padding: 3, height: 40 }}>
                        <Text style={{ fontSize: 14, color: '#d3d3d3', letterSpacing: -0.4, alignSelf: 'center' }}>CLICK <AntDesign name="infocirlce" size={15} color="#d3d3d3" /> ICON ABOVE FOR INFO.</Text>
                    </View>

                    <Text style={{ fontSize: 18, color: this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>BASIC DETAILS</Text>
                    <Tin
                        underlineColor="#fff"
                        label="NAME"
                        value={this.state.username}
                        placeholder={this.state.username}
                        mode="outlined"
                        theme={{ colors: { text: '#7e7e7e', primary: '#939393', underlineColor: 'transparent', background: '#ffffff', height: 80 }, roundness: 8, height: 80 }}
                        style={styles.txtinput}
                        onBlur={() => Keyboard.dismiss()}
                        onChangeText={value => { this.setState({ username: value }); }}
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

                            if (value == 'Female') {
                                this.setState({ color: '#fb0d9b' });
                                this.setState({ colortwo: '#00cafd' })
                            }
                            else {
                                this.setState({ color: '#00cafd' });
                                this.setState({ colortwo: '#fb0d9b' })
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
                            ;
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
                            { label: '47', value: 42 },
                            { label: '48', value: 43 },
                            { label: '49', value: 49 },
                            { label: '50', value: 50 },
                        ]}

                        onValueChange={value => {
                            if (value) {
                                this.setState({
                                    age: value,
                                });

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

                    <Text style={{ fontSize: 18, color: this.state.color, letterSpacing: -0.4, paddingLeft: 22, marginBottom: 6, marginTop: 10 }}>EDUCATION & OCCUPATION</Text>

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
                            { label: 'None', value: 'None' },
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
                            { label: 'Govt. Emp', value: 'Govt. Employee' },
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
                            { label: 'Private Employee', value: 'Private Employee' },
                            { label: 'Science', value: 'Science' },

                        ]}

                        onValueChange={value => {
                            this.setState({
                                degree: value,
                            });

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
                            { label: '- OR -', value: 'N.A' },
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

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                        <TouchableOpacity style={{ width: '63%', borderColor: this.state.colortwo, justifyContent: 'flex-end', marginRight: 8, height: 36, marginTop: 2, backgroundColor: this.state.colortwo, alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginBottom: 9 }} onPress={() => { this.props.navigation.navigate('LatestU') }}>
                            <Text style={{ fontSize: 16, alignItems: 'center', justifyContent: 'center', color: '#fff', flexDirection: 'row' }}><MaterialIcons name="label-important" size={12} color="#fff" />  PARTNER PREFERENCE</Text>
                        </TouchableOpacity>
                    </View>

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
                                pcomplexion: value,
                            });

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

                    <Text style={{ textAlign: 'center', marginTop: 10, color: '#DC143C', marginBottom: 10, marginLeft: 10, marginRight: 10 }}>{this.state.errors}</Text>
                    <Text style={{ paddingLeft: 20, fontSize: 18, color: this.state.color, letterSpacing: -0.4, marginBottom: 5, marginTop: 5, marginLeft: 4 }}>CREATE MY PROFILE </Text>

                    <View style={{ marginRight: 12, marginLeft: 12, marginTop: 0, marginBottom: 0 }}>

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
    buttonText: {
        borderRadius: 30,
        padding: 14,
        width: 200,
        borderColor: 'black',
        backgroundColor: '#21b3eb',
        fontSize: 16,
        textAlign: 'center',
        color: "#FFF",
        marginBottom: 30,
        marginTop: 10,
    },
    inputView: {
        backgroundColor: "#F7f7f7",
        borderRadius: 80,
        width: 340,
        height: 66,
        marginBottom: 12,
        paddingLeft: 40,
        alignItems: 'flex-start',
        fontSize: 17
    },
    inputViewCreate: {
        backgroundColor: "#f7f7f7",
        borderRadius: 80,
        width: 340,
        height: 66,
        marginBottom: 12,
        paddingLeft: 40,
        alignItems: 'flex-start',
        fontSize: 17,
    },
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
