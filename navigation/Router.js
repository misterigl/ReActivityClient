import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import MapScreen from '../screens/MapScreen';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FriendsScreen from '../screens/FriendsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RootNavigation from './RootNavigation';
import CreateEventScreen from '../screens/CreateEventScreen';
import RealProfileScreen from '../screens/RealProfileScreen';
import EventViewScreen from '../screens/EventViewScreen';
import IntroScreen from '../screens/IntroScreen';
import OtherUserProfile from '../screens/OtherUserProfile';
import ProfileAvatar from '../components/ProfileAvatar';
import ImageUpload from '../components/ImageUpload';
import FilterOptions from '../screens/FilterOptions';

export default createRouter(() => ({
  home: () => HomeScreen,
  map: () => MapScreen,
  signin: () => SigninScreen,
  signup: () => SignupScreen,
  editprofile: () => EditProfileScreen,
  friends: () => FriendsScreen,
  links: () => LinksScreen,
  settings: () => SettingsScreen,
  rootNavigation: () => RootNavigation,
  createEvent: () => CreateEventScreen,
  realProfile: () => RealProfileScreen,
  eventView: () => EventViewScreen,
  intro: () => IntroScreen,
  otherUserProfile: () => OtherUserProfile,
  testProfileAvatar: () => ProfileAvatar,
  imageUpload: () => ImageUpload,
  filterOptions: () => FilterOptions,
}));
