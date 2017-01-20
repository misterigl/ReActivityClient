import React from 'react';
import {
  Dimensions,
  Image,
  Button,
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';

import Backbar from '../components/Backbar';
import FriendStatus from '../components/FriendStatus';

import { store } from '../lib/reduxStore.js';
import { api } from '../lib/ajaxCalls.js';
import EventListEntry from '../components/EventListEntry';

/* IMPORTANT NOTE */
//
// If you've recently updated the database and you find this page not working, go to
// the reduxStore.js file and change the default state of 'userProfileCurrentlyViewing'
// to a name you can confirm is in the database. Name are newly generated each time, so
// you likely won't have duplicate names from the last seeding.
//
// This should be refactored to display a 'User Not Found' page, so that it's not necessary
// to update the redux default state every time we want to reseed the database.


export default class OtherUserProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: store.getState().userProfileCurrentlyViewing,
      user: {firstName: 'test', interests: [], activities: []},
      loaded: false
    }
    api.getUserByUsername(this.state.username, function(user) {
      console.log('This is running. Should resolve soon...');
      this.setState({user: user});
      this.setState({loaded: true});
    }.bind(this));

    // Replace the event history with more detailed events.
    // this.replaceEventHistory();

    // Function binding
    this.replaceEventHistory = this.replaceEventHistory.bind(this);
    this.thumbnailFromSport = this.thumbnailFromSport.bind(this);
  }


  // In the case where you try and click on an event, the EventListView attempts to display
  // it, but other user profiles do not come with detailed event information, but rather a somewhat
  // condensed version. It is necessary to replace these brief histories with full histories, since
  // we pass in the clicked event to the EventListView directly.
  replaceEventHistory() {
    // I see no reason why this would actually work.
    var that = this;
    var events = this.state.user.activities;
    for (var i = 0; i < events.length; i++) {
      api.getEventById(events[i].id, function(detailedEvent) {
        events[this] = detailedEvent;
        that.setState({activities: events});
      }.bind(i))
    }
  }

  thumbnailFromSport(sport) {
    var sports = {
      'baseball' : 'http://twinstrivia.com/wp-content/uploads/2011/11/Baseball1.png',
      'soccer' : 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Soccerball_mask.svg/50px-Soccerball_mask.svg.png',
      'basketball' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Basketball.png/50px-Basketball.png',
      'weight-training' : 'http://rlv.zcache.com/barbell_bodybuilding_classic_round_sticker-rec30a842558440b8956dc11143ca6a1c_v9waf_8byvr_50.jpg',
      'football' : 'http://cdn.bleacherreport.net/images/team_logos/50x50/college_football.png',
      'mountain-biking' : 'http://argos.scene7.com/is/image/Argos/3324680_R_Z002A_UC1385685?wid=50&hei=50',
      'running' : 'http://litbimg6.rightinthebox.com/images/50x50/201609/utmphm1473306095331.jpg'
    }
    return sports[sport];
  }





  


  render() {
    var that = this;

    if (this.state.loaded === false) {
          return (<Text></Text>);



    }
    else if (this.state.loaded === true) {
      console.log('The big block is trying to render...');

    return (

      <View style={styles.container}>
        <Backbar navigator={this.props.navigator} />
        <ScrollView style={styles.container}
          contentContainer={styles.contentContainer}>
          <View style={styles.formContainer}>
      
            <Image source = {{uri: this.state.user.profileUrl}} style={styles.profileImage}>
            </Image>
            <Text style={{fontFamily: 'rubik', fontSize: 25, marginLeft:3}}>
              {this.state.user.firstName + ' ' + this.state.user.lastName}
            </Text>

            <Text style={{fontFamily: 'rubik', color: '#444', marginLeft: 3}}>
              @{this.state.user.username}
            </Text>

            <FriendStatus status={that.state.user.relationship} friendId={that.state.user.id || null} />

            <View style={styles.activityContainer}>

            <Text style={{marginRight: 3, fontFamily: 'rubik', fontSize: 16, marginLeft: 3}}>
              Interests:  
            </Text>
              {this.state.user.interests.map( (interest) => {
                return (
                  <Image source={{uri: this.thumbnailFromSport(interest.sport)}} style={styles.thumb}></Image>
                )})
              }
            </View>

            <Text style={{fontFamily: 'rubik', fontSize: 16, marginBottom: 10, marginTop: 5, marginLeft: 20, color: '#333'}}>
              "{this.state.user.bioText}"
            </Text>
            <View style={styles.eventTitle}>
              <Text style={{fontFamily: 'rubik', fontSize: 18, marginLeft: 3}}>
              Events:
              </Text>
            </View>

            {this.state.user.activities.map((activity) => (
              <EventListEntry event={activity} key={activity.id} navigator={that.props.navigator} />
            ))}

          </View>
        </ScrollView>
      </View>
    
    )
  }}
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    contentContainer: {
      paddingTop: 80
    },
    formImageContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20
    },
    formContainer: {
      marginBottom: 20
    },
    profileImage: {
      width: width/1.5,
      height: width/1.5,
      alignSelf: 'center',

    },
    inputStyle: {
      height: 40
    },
    buttonContainer: {
      marginTop: 10,
      marginBottom: 20
    },
    profileName: {
      height: 20
    },
    feed: {
      color: '#66e',
      backgroundColor: '#fff',
      textAlign: 'center',
      height: 30,
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
      })
    },
    feedContainer: {
      borderWidth: 1,
      borderColor: '#333'
    },
    bio: {
      marginTop: 10,  
      fontStyle: 'italic',
      marginLeft: 10
    },
    username: {
      color: '#444',
      fontStyle: 'italic',
      fontSize: 10  
    },
    backButton: {
      alignItems: 'center',
      textAlign: 'center'
    },
    thumb: {
      width: 20,
      height: 20
    },
    activityContainer: {
      flex: 1, 
      flexWrap: 'wrap',
      flexDirection: 'row'
    },
    eventTitle: {
      backgroundColor: 'peachpuff',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: '#eee'
    }

})


