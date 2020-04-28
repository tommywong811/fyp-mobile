import React from 'react';
import { Container, Header, Content, Text, Body, Icon } from 'native-base';
import { Picker, ScrollView, Switch, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { api } from '../../../backend';
import AsyncStorage from '@react-native-community/async-storage';
import autoUpdateHandler from "../../../backend/utils/autoUpdate";

const SUPPORT_LANGUAGES = [
  {label: 'English', value: 'english'}
]
export default class EventListPage extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          isLoading: false,
          keepLoading: true,
          renderHelp: false,
          renderAboutUs: false,
          renderTAS: false,
          notifications: false,
          autoUpdate: false,
          dbResponse: '',
          language: 'English'

      }
  }

  componentDidMount() {
    AsyncStorage.getItem('autoUpdate', (err, result) => {
      if(!err) {
        if(result !== null) {
          this.setState({autoUpdate: JSON.parse(result)})
        }
      }
    })
    AsyncStorage.getItem('notifications', (err, result) => {
      if(!err) {
        if(result !== null) {
          this.setState({notifications: JSON.parse(result)})
        }
      }
    })
  }

  componentWillMount() {
      try {
          this.setState({isLoading: true})
      } catch (err) {
          alert(JSON.stringify(err, null, 2))
      }
  }

  async notificationsOnPress() {
    var notifications = !this.state.notifications
    await AsyncStorage.setItem('notifications', JSON.stringify(notifications))
    this.setState({
      notifications: notifications
    })
  }

  async autoUpdateOnPress() {
    var autoUpdate = !this.state.autoUpdate
    await AsyncStorage.setItem('autoUpdate', JSON.stringify(autoUpdate))
    this.setState({autoUpdate: autoUpdate})
    if(autoUpdate) {
      autoUpdateHandler.configure()
    } else {
      autoUpdateHandler.stop()
    }
  }

  TASOnPress() {
    this.setState({
      renderTAS: !this.state.renderTAS
    })
  }

  HelpOnPress() {
    this.setState({
      renderHelp: !this.state.renderHelp
    })
  }

  AboutUsOnPress() {
    this.setState({
      renderAboutUs: !this.state.renderAboutUs
    })
  }

  renderHelp() {
    if(this.state.renderHelp)
      return(
        <View style={styles.collapsedContent}>
          <Text style={[styles.text_title, styles.text_color]}>Need help on Path Advisor?</Text>
          <Text style={[styles.text_subtitle, styles.text_color]}>Useful Tips</Text>
          <Text style={[styles.text_content, styles.text_color]}>
            1. xxx{'\n'}
            2. xxx{'\n'}
            3. xxx{'\n'}
            4. xxx{'\n'}
            5. xxx
          </Text>
        </View>
      )
    else {
      return null
    }
  }

  renderAboutUs() {
    if(this.state.renderAboutUs)
      return(
        <View style={styles.collapsedContent}>
          <Text style={[styles.text_title, styles.text_color]}>About Us</Text>
          <Text style={[styles.text_subtitle, styles.text_color]}>What is Path Advisor</Text>
          <Text style={[styles.text_content, styles.text_color]}>
          Path Advisor is a ....Path Advisor is a ....Path Advisor is a ....Path Advisor is a ....Path Advisor is a ....Path Advisor is a ....Path Advisor is a ....
          </Text>
        </View>
      )
    else {
      return null
    }
  }

  renderTAS() {
    if(this.state.renderTAS)
      return(
        <View style={styles.collapsedContent}>
          <Text style={[styles.text_title, styles.text_color]}>Terms and Condition</Text>
          <Text style={[styles.text_content, styles.text_color]}>
            1. xxx{'\n'}
            2. xxx{'\n'}
            3. xxx{'\n'}
            4. xxx{'\n'}
            5. xxx
          </Text>

        </View>
      )
    else
      return null
  }

  render() {
      return(
          <View style={styles.container}>
              <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.settingTab}>
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='FontAwesome5' name='language' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Language</Text>
                    </View>
                    <Picker
                      selectedValue={this.state.language}
                      style={styles.languagePicker}
                      onValueChange={(value, index) => {this.setState({language: value})}}
                    >
                      {SUPPORT_LANGUAGES.map((item) => {
                        return (<Picker.Item label={item.label} value={item.value}/>)
                      })}
                    </Picker>
                  </View>
                </View>

                <View
                  style={styles.settingTab}
                >
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='AntDesign' name='bells' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Auto Update</Text>
                    </View>
                    <Text style={styles.settingTabTitle}>{this.state.dbResponse}</Text>
                    <Switch
                      onValueChange={(value) => this.autoUpdateOnPress()}
                      value={this.state.autoUpdate}
                      thumbColor='white'
                      trackColor={{true: '#003366', false: 'grey'}}
                    >
                    </Switch>
                  </View>
                </View>


                <TouchableOpacity style={styles.settingTab}>
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='MaterialIcons' name='feedback' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Feedback</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View
                  style={styles.settingTab}
                >
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='AntDesign' name='bells' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Notifications</Text>
                    </View>
                    <Switch
                      onValueChange={(value) => this.notificationsOnPress()}
                      value={this.state.notifications}
                      thumbColor='white'
                      trackColor={{true: '#003366', false: 'grey'}}
                    >
                    </Switch>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => this.HelpOnPress()}
                  style={styles.settingTab}
                >
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='AntDesign' name='questioncircleo' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Help</Text>
                    </View>
                  </View>
                  {this.renderHelp()}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.TASOnPress()}
                  style={styles.settingTab}
                >
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='Entypo' name='text-document' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Terms and Condition</Text>
                    </View>
                  </View>
                  {this.renderTAS()}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.AboutUsOnPress()}
                  style={styles.settingTab}
                >
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='MaterialIcons' name='people' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>About Us</Text>
                    </View>
                  </View>
                  {this.renderAboutUs()}
                </TouchableOpacity>
              </ScrollView>
          </View>
      );
  }
}

const styles = StyleSheet.create({
  languagePicker: {
    width: 120,
    color: 'white'
  },

  collapsedContent: {
    marginTop: 20
  },

  text_color: {
    color: 'white'
  },

  text_title: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  text_subtitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },

  text_content: {
    fontSize: 16
  },


  scrollView: {
    flexGrow: 1
  },

  container: {
    padding: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  settingTab: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: '#003366',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 20,
  },

  settingTabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  settingTabRowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingTabTitle: {
    marginLeft: 25,
    color: 'white'
  },

  settingTabIcon: {
    color: 'white'
  },
})
