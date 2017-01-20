import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Components } from 'exponent';

import { store } from '../lib/reduxStore';
import { api } from '../lib/ajaxCalls';

export default class FriendListEntry extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.friend.profileUrl) {
      this.props.friend.profileUrl = "https://s3.amazonaws.com/uifaces/faces/twitter/aaronkwhite/128.jpg";
    }
  }

  goToProfilePage(user) {
    api.getUserByUsername(user.id, (user) => {
      store.dispatch({
        type: 'UPDATE_USER_VIEWING_PROFILE',
        viewing: user.id
      })
      this.props.navigator.push('otherUserProfile');
    })
  }

  render() {
    var that = this;
    var user = this.props.friend;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress = {this.goToProfilePage.bind(this, user)}
      >
        <Image
          style={styles.creatorPhoto}
          source={{uri: this.props.friend.profileUrl || 'https://s3.amazonaws.com/uifaces/faces/twitter/aaronkwhite/128.jpg'}}
        >
          <Components.LinearGradient
            colors={['transparent', 'rgba(0,0,0,1)']}
            style={styles.creatorNameGradient}
          >
            <Text numberOfLines={1} style={styles.creatorName}>{this.props.friend.firstName}</Text>
          </Components.LinearGradient>
        </Image>
    </TouchableOpacity>
    );
  }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: width * .245,
    width: width * .245,
  },
  creator: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width * .22,
  },
  creatorPhoto: {
    width: width * .22,
    height: width * .22,
    borderRadius: 5,
  },
  creatorNameGradient: {
    position: 'absolute',
    bottom: 0,
    width: width * .22,
    alignItems: 'center'
  },
  creatorName: {
    textAlign: 'center',
    fontSize: width/25,
    fontWeight: '300',
    color: 'azure',
    backgroundColor: 'transparent',
    fontFamily: 'rubik',

  },
});
