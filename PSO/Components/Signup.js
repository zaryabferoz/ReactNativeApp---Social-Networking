import React, { Component } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity,StatusBar, } from 'react-native';
import firebase from 'firebase'
import Login from './Login.js';
import CreateAcc from './CreateAcc.js';

export default class Signup extends Component {
    state = {
        loggedIn: null
    }

    componentDidMount() {
        var firebaseConfig = {
            apiKey: "/Your Credentials here/",
            authDomain: "/Your Credentials here/",
            databaseURL: "/Your Credentials here/",
            projectId: "/Your Credentials here/",
            storageBucket: "/Your Credentials here/",
            messagingSenderId: "/Your Credentials here/",
            appId: "/Your Credentials here/"
        };
   
        if(!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
        }else{
            firebase.app();
        }


        firebase.auth().onAuthStateChanged(user => {
            
            if (user) {
                this.setState({
                    loggedIn: true
                })
            } else {
                this.setState({
                    loggedIn: false
                })
            }
        })
    }
    
    renderContent = () => {
        
        switch (this.state.loggedIn) {
            case false:
                return <CreateAcc/>

            case true:
                return <Login/>

        }
    }

    render() {
        return (
            
                <View style={{ flex: 1, paddingTop:StatusBar.currentHeight,alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                    {this.renderContent()}
                </View>
           
        );
    }
}

