import React from "react";
import { View, Text, Image } from "react-native";
import { Card} from "react-native-paper";
import firebase from 'firebase';

const ChatBox = ({ sendby, msg,timestamp,altercolor }) => {
    const suid = firebase.auth().currentUser.uid;  
  let isCurrentUser = suid === sendby ? true : false;

  let chatcolor = altercolor;
  
  return (
    <View
      transparent
      style={{
        alignSelf: isCurrentUser ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={[
          isCurrentUser ? ({
            marginTop:2,marginBottom:2,marginRight:20,marginLeft:100,
            
          }):({marginTop:2,marginBottom:2,marginLeft:20,marginRight:100,
            color:'#f00'})
        ]}
      >
        {
        <View>
          <Text
            style={[isCurrentUser ? {  borderRadius:30,padding:14, backgroundColor: chatcolor, color: '#fff',fontSize:16,lineHeight:21,paddingLeft:18 }:{  borderRadius:30,padding:14,backgroundColor: '#f0f0f0', color: '#707070',fontSize:16,lineHeight:21,paddingLeft:18 }]}
          >
            {msg}
          </Text>
           <Text
           style={[isCurrentUser ? { marginRight:9,backgroundColor: '#fff', color: '#d3d3d3',fontSize:13,marginBottom:9,marginTop:2,alignSelf:'flex-end' }:{ marginLeft:9, marginBottom:9,backgroundColor: '#fff', color: '#c9c9c9',fontSize:13 }]}
         >
           {timestamp}
         </Text>
         </View>
          
        }
      </View>
    </View>
  );
};

export default ChatBox;