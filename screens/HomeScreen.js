import React from 'react';

import {
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';

import Router from '../navigation/Router'
import EventListEntry from '../components/EventListEntry';
import EventTypeFilterBar from '../components/EventTypeFilterBar';
import HomeScreenHeader from '../components/HomeScreenHeader';
import dummyEventData from './dummyData/dummyEventData';

import { MonoText } from '../components/StyledText';
import { api } from '../lib/ajaxCalls'
import { store } from '../lib/reduxStore'
import { loader } from '../lib/loader';

export default class HomeScreen extends React.Component {

  static route = {
    navigationBar: {
      visible: false
    }
  }

  constructor() {
    super();
    this.state = {
      // It is unclear what these three properties are used for. Consider removal.
      refreshing: false,
      loaded: 0,
      rowData: Array.from(new Array(20)).map((val, i) => ({text: 'Initial row ' + i, clicks: 0})),

      // Four arrays which store a collection of all events in that list. Watched events
      // is not currently being used. Remove if never used.
      nearbyEvents: store.getState().nearbyEvents,
      friendsEvents: store.getState().friendsEvents,
      watchedEvents: store.getState().watchedEvents,
      myEvents: store.getState().myEvents,

      // This keeps reference to the list currently being used. It will be a string, so that it can be
      // passed back through this.state to reach the desired event array. Ie, 'nearbyEvents', 'friendsEvents',
      // 'watchedEvents', or 'myEvents'.
      currentlyViewing: store.getState().currentlyViewing
    };

    // Function binding.
    this._onRefresh = this._onRefresh.bind(this);
    this.hotRefresh = this.hotRefresh.bind(this);
  }

  // This is called when the user pulls down the page when they are already at the top.
  // (Scroll refresh.)
  _onRefresh() {
    var that = this;
    AsyncStorage.getItem('JWTtoken').then((token) => !token && that.props.navigator.push('signin'));

    loader.loadNearbyEvents(function(events) {
      that.setState({nearbyEvents: events});
    });

    loader.loadMyEvents(function(events) {
      that.setState({myEvents: events});
    });
  }

  // This occurs when the user pushes a button on the top navigator tab. It changes the
  // currently viewed list.
  hotRefresh() {
    this.setState({currentlyViewing: store.getState().currentlyViewing});
  }

  // We'll attempt to load our data when the component mounts. Note that there will be a brief moment
  // where the page is rendering and data is not present. Correctly reference objects to ensure that
  // you aren't attempting to access a property on an undefined value (left by the lack of data.)
  componentWillMount() {
    var that = this;

    AsyncStorage.getItem('JWTtoken').then((token) => !token && that.props.navigator.push('signin'));

    loader.loadNearbyEvents(function(events) {
      that.setState({nearbyEvents: events});
    });
    loader.loadMyEvents(function(events) {
      that.setState({myEvents: events});
    });
  }


  render() {
    var that = this;
    var toRender = that.state[that.state.currentlyViewing];
    console.log('toRender is:', toRender)
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={{flex: 0, height: 30, flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'paleturquoise'}}>
            <HomeScreenHeader/>
          </View>
            <View style={{height: 40}}>
              <EventTypeFilterBar action = {this.hotRefresh}/>
            </View>
          <View>
            <ScrollView
              style={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                  tintColor="silver"
                  title="Loading..."
                  titleColor="silver"
                />
              }>
              {toRender.map((event) => <EventListEntry event={event} key={event.id} navigator={that.props.navigator}/>)}
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}


var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingTop: 24,
    width: width,
  },
  scrollView: {
    minHeight: height,
  },
});
