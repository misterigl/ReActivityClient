import React from 'react';
import {
  AsyncStorage,
  Button,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import {
  ExponentConfigView,
} from '@exponent/samples';

import { store } from '../lib/reduxStore'

export default class SettingsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Settings'
    },
  }

  constructor() {
    super();
    this.state = {
      token: 'none',
      userId: 0,
      username: ''
    }
  }

  componentWillMount() {
    var that = this;
    AsyncStorage.multiGet(['JWTtoken', 'userId', 'username']).then((array) => {
      that.setState({token: array[0][1], userId: array[1][1], username: array[2][1]});
    });
  }

  goToSignup = () => {
    this.props.navigator.push('signup');
  }

  goToEditProfile = () => {
    this.props.navigator.push('editprofile');
  }

  logout = () => {
    AsyncStorage.multiRemove(['JWTtoken','userId', 'username']).then(() => {
      console.log('token deleted');
    })
    store.dispatch({
      type: 'UPDATE_USER_INFO',
      token: null,
      userId: null,
      username: null
    });
    this.props.navigator.push('signin');
    // this.props.navigation.performAction(({ tabs, stacks }) => {
    //   tabs('main').jumpToTab('signin');
    //   stacks('home').push('signin');
    // });
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={this.props.route.getContentContainerStyle()}>
        <Text>current token: {this.state.token}</Text>
        <Text>current userId: {this.state.userId}</Text>
        <Text>current username: {this.state.username}</Text>
        <Button
          onPress={this.logout}
          title="Logout"
          color="#841584"
        />
        <Text onPress={this.goToSignup}>Signup</Text>
        <Text onPress={this.goToEditProfile}>Edit Profile</Text>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
