import React from 'react';
import { Container, Header, Content, Text, Body, Icon } from 'native-base';
import { Picker, ScrollView, Switch, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, TouchableHighlight } from 'react-native';
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
          renderFeedback: false,
          notifications: false,
          autoUpdate: false,
          dbResponse: '',
          language: 'English',
          feedback: "",
          feedbackResponse: "",

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

  FeedbackOnPress() {
    this.setState({
      renderFeedback: !this.state.renderFeedback,
      feedbackResponse: ""
    })
  }

  sendFeedback() {
    fetch('http://18.163.180.15:8080/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({feedback: this.state.feedback})
    }).then((response) => response.text())
    .then((data) => {
      if(data="true") {
        this.setState({feedbackResponse: "Sent!"})
      } else {
        this.setState({feedbackResponse: "Error"})
      }
    })
    this.setState({
      feedback: "",
      renderFeedback: false,
    })

  }

  renderFeedback() {
    if(this.state.renderFeedback)
      return (
        <View style={styles.collapsedContent}>
          <TextInput
            multiline={true}
            numberofLines={4}
            onChangeText={(text) => this.setState({feedback:text})}
            value={this.state.feedback}
            style={styles.textInput}
            placeholder="Tell us what you think about Path Advisor 2.0"
          />
        </View>
      )
      else
        return null

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
          <Text style={[styles.text_title, styles.text_color]}>Who are we?</Text>
          <Text style={[styles.text_content, styles.text_color]}>
            By Hugo, Ernest, Alpha, Sam
          </Text>
          <Text style={[styles.text_content, styles.text_color]}>
            Thanks Raymond &lt;3
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


                <TouchableOpacity
                  onPress={() => this.FeedbackOnPress()}
                  style={styles.settingTab}
                >
                  <View style={styles.settingTabRow}>
                    <View style={styles.settingTabRowGroup}>
                      <Icon type='MaterialIcons' name='feedback' style={styles.settingTabIcon}></Icon>
                      <Text style={styles.settingTabTitle}>Feedback</Text>
                    </View>
                    {
                      !this.state.renderFeedback &&
                      <Text style={styles.feedbackResponse}>{this.state.feedbackResponse}</Text>
                    }
                    { this.state.renderFeedback &&
                      <TouchableHighlight
                        onPress={() => this.sendFeedback()}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>Send</Text>
                      </TouchableHighlight>
                    }
                  </View>
                  {this.renderFeedback()}
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
  feedbackResponse: {
    fontSize: 14,
    color: 'white'
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 80
  },
  buttonText: {
    color: '#003366',
    textAlign: 'center',
    fontSize: 12
  },
  textInput: {
    backgroundColor: 'white',
    padding: 15
  },
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
    alignItems: 'center'
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
