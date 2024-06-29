import React,{Component} from 'react';
import {View, Text,Image} from 'react-native';
import * as Font from 'expo-font';

var logo=require('./psologo.png');

export default class Splash extends Component{
    constructor(props){
        super(props);
            setTimeout(()=>{
                this.props.navigation.replace("Signup");
            }, 2000);    
    }
    state = {
        cfontsLoaded: false
    };

    async componentDidMount() {
        await Font.loadAsync({
            dmcapf: require('.././assets/fonts/dmcapf.ttf')
        });

        this.setState({ cfontsLoaded: true });
    }
    
    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                <Image source={logo} style={{height:110,width:110,}}>
                </Image>
            </View>
        );
    }
}