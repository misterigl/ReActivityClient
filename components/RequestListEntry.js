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
import {
  FontAwesome,
} from '@exponent/vector-icons';

import { store } from '../lib/reduxStore';
import { api } from '../lib/ajaxCalls';

export default class RequestListEntry extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.request.profileUrl) {
      this.props.request.profileUrl = "https://s3.amazonaws.com/uifaces/faces/twitter/aaronkwhite/128.jpg";
    }
  }

  accept() {
    console.log('accept');
  }

  reject() {
    console.log('reject');
  }
  
  render() {
    // console.log('test request', this.props.request);
    var that = this;
    var user = this.props.request;
    return (
        <View style={styles.container}>
          <TouchableOpacity
            onPress = {
              function() {
                console.log('User id is:', user.id);
                api.getUserByUsername(user.id, function(user) {
                  store.dispatch({
                    type: 'UPDATE_USER_VIEWING_PROFILE',
                    viewing: user.id
                  })
                  that.props.navigator.push('otherUserProfile');
                })
              }
            }
            >
          <View style={styles.creator}>
            <Image
              style={styles.creatorPhoto}
              source={{uri: this.props.request.profileUrl || 'https://s3.amazonaws.com/uifaces/faces/twitter/aaronkwhite/128.jpg'}}
              />
          </View >
        </TouchableOpacity>
          <View style={styles.details}>
            <Text>{this.props.request.firstName} {this.props.request.lastName}</Text>
            <Text>
              <FontAwesome name='check' size={32} color='green' onPress={this.accept} />
              <Text>   </Text>
              <FontAwesome name='times' size={32} color='red'  onPress={this.reject} />
            </Text>
          </View>
      </View>
    );
  }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#fbfbfb',
    paddingVertical: 6,
    minHeight: 95,
    marginBottom: 3,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  creator: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: width * .22,
    borderRightColor: '#D3D3D3',
    borderStyle: 'solid',
    borderRightWidth: 1,
  },
  creatorPhoto: {
    width: 50,
    height: 50,
  },
  creatorName: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '300',
  },
  details: {
    marginLeft: width * .02,
    width: width * .76,
  },
  title: {
    fontSize: 17
  },
  description: {
    color: 'darkslategray',
    marginTop: 5,
    marginRight: 3,
    fontSize: 13,
    fontWeight: '100'
  },
});
