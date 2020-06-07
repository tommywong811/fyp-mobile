

<h1> Path Advisor Mobile Version (Android Frontend Docs)</h1>

<h2>
    <ol>
        <a href="#Part1"><li>APIs</li></a>
        <a href="#Part2"><li>Getting Started</li></a>
        <a href="#Part3"><li>Potential Issue</li></a>
        <a href="#Part4"><li>Possible Future Features</li></a>
        <a href="#Part4"><li>How to Add Features</li></a>
    </ol>
</h2>


<h2 id="Part1">Part I: APIs</h2> 



<ol>
<li><h3><strong>Reducer</strong></h3>  
   <details id="FloorReducer">
   <summary>
   Floors
   </summary>
   <h3>Floor reducer provides data about the current floor.</h3>

   State:
   <pre>
   * data (Int): All maptile data of all floors.
   * currentFloor (String): The current floor ID.
   * currX (Int): The x coordinate of current node. 
   * currY (Int): The y coordinate of current node. 
   * sumX (Int): The number of maptiles in x direction of this floor. 
   * sumY (Int): The number of maptiles in y direction of this floor.
   * suggestedNodes (Object): The suggested node.
   * currentNode (Object): The current searched node. 
   * currentBuilding (String): The current Building.
   * renderLoadingPage (Boolean): Whether display the loading page.
   * mapTileCache (Array): A 2D array that stores the URIs of all maptiles in the floor.
   * previousNode (Object): The previous node.
   </pre>

   Actions:
   <pre>
   * CHANGE_FLOOR
   * CHANGE_BUILDING
   * CHANGE_CURRX
   * CHANGE_CURRY
   * CHANGE_SUMX
   * CHANGE_SUMY
   * CHANGE_NODE
   * UPDATE_FLOOR_DATA
   * UPDATE_CURRENT_FLOOR
   * RENDER_LOADING_PAGE
   * UPDATE_MAPTILE_CACHE
   * SAVE_PREVIOUS_NODE
   * CLEAR_NODE
   </pre>
   </details>

   <details><summary> Nodes</summary>
   <h3>Nodes</h3>
   State
   <pre>
   * data (Array): All node data.
   * currentNode (Object): The current node.
   </pre>

   Actions
   <pre>
   * FIND_NODE
   * UPDATE_NODE_DATA
   </pre>
   </details>   

   <details><summary> Path</summary>
   <h3>Path</h3>
   State
   <pre>
   * data (Array): A path of nodes from home to destination.  
   * fromNodeId (String): The ID of home node.
   * toNodeId (String): The ID of destination node.
   * floors (Array): The floors of home node and destination node.
   </pre>

   Actions
   <pre>
   * UPDATE_PATH 
   * CLEAR_PATH_STATE
   </pre>
   </details>
</li>

<li><h3><strong>Utility Plugin</strong> (Under plugins folder)</h3>
    <pre><h3>Notice</h3>
    In the following document, we will talk about "Maptile". There is a logical coordinate and real coordinate conversion for every maptile. You can understand this conversion by looking though <a href="#generateMapTiles">generateMapTiles()</a> funciton.    
    </pre>
    <ul>
    <li>
    <details><summary>
    <strong>dirToUri --function</strong>
    </summary>
    <pre>[Input]:
    dir (String): The direction identity of a maptile.
[Output]:
    uri (String): The unique identity of a maptile in database. 
    </pre>
    </details>
    </li> 
    <li>
    <details><summary>
    <strong>createImage --function</strong>
    </summary>
    <pre>[Input]:
    uri (String): The unique identity of a maptile in database.
[Output]:
    Image (JSX Component): an image component with specific uri.
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong id="generateMapTiles">generateMapTiles --function</strong></summary>
    <pre>[Input]:
    offsetX (Int): The x coordinate of the upper left corner.
    offsetY (Int): The y coordinate of the upper left corner.
    width (Int): The width of this floor.
    height (Int): The height of this floor.
    floor (String): The floor that is displayed.
    level (Int): Zoom level.
[Output]:
    {result, dimension}: 
    result (Array): It is a list of maptile. 
    dimension (Int, Int): It contains width and height of this floor.
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>getFloorDimension --function</strong></summary>
    <pre>[Input]:
    offsetX (Int): The x coordinate of the upper left corner.
    offsetY (Int): The y coordinate of the upper left corner.
    width (Int): The width of this floor.
    height (Int): The height of this floor.
[Output]:
    {left, top, width, height}: 
        left (Int): The logical x coordinate upper left, 
        top (Int): The logical y coordinate upper left, 
        width (Int): The logical width of this floor, 
        height (Int): The logical height of this floor  
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>mapTilesRefactor --function</strong></summary>
    <pre>[Input]:
    mapTiles (Array): A two dimensional array of maptiles.
[Output]:
    result (Array): A one dimensional array contains the same maptiles as mapTiles.
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>getMapTileDim --function</strong></summary>
    <pre>[Input]:
    maptiles (Array): A one dimensional array of maptiles.
[Output]:
    {width, height}:
        width (Int): The number of maptiles in x direction.
        height (Int): The number of maptiles in y direction.
    </pre></details>
    </li>
    <li>
    <details><summary>
    <strong>getDefualtView --function</strong></summary>
    <pre>[Input]:
    left (Int): The x of upper left corner. 
    top (Int): The y of upper left corner.
    numOfRow: The number of maptiles in y direction. 
    numOfCol (Int): The number of maptiles in x direction.
    floorId (String): The ID of the floor.
    zoomLevel (Int): Zoom level
    cacheImage (Array): A two dimensional array containing all URIs of maptiles in the floor. This parameter will be rewritten in the function. 
    </pre></detials>
    </li>
    <li>
    <details><summary>
    <strong>getNodeOffsetForEachFloor --function</strong></summary>
    <pre>[Input]:
    floorId (String): The ID of a floor.
[OutPut]:
    {x, y}:
        x (Int): The number of maptiles in x direction;
        y (Int): The number of maptiles in y direction;
    </pre></details>
    </li>
    <li>
    <details><summary>
    <strong>getNodeImageByConnectorId --function</strong></summary>
    <pre>[Input]:
    connectorId (String): The ID of a connector.
[Output]:
    image (Object): The image of that connector.
    </pre></details>
    </li>
    <li>
    <details><summary>
    <strong>getNodeImageByTagId --function</strong></summary>
    <pre>[Input]:
    tag (String): The ID of a tag.
[Output]:
    image (Object): The image of that tag.
    </pre></details>
    </li>
    </ul>
</li>

<li><h3><strong>Components(JSX)</strong></h3>
    <ul>
        <li><details><summary>
            EventListPage</summary>
            <pre>This Component is responsible to call HKUST event calendar to fetch recent events. After fetching events, it will display all events on a new page.
            </pre></details>    
        </li>
        <li><details><summary>
            FacilityInforPage</summary>
            <pre>This Component is used to store some real world pictures of the campus facility.(Still Updating)
            </pre></details>    
        </li>
        <li><details><summary>
            LoadingPage</summary>
            <pre>This Component shows when the content is loading, for example, switch to another floor.
            </pre></details>
        </li>
        <li><details><summary>
            MapTiles</summary>
            <pre>This component get the floor information from <a href="#FloorReducer">Floor Reducer</a>, which includes the dimension of the floor. We can make use of APIs from backend to find the uri of every maptile.
            </pre></details>
        </li>
        <li id="Navigator"><details><summary>
            Navigator</summary>
            <pre>This is the component is one of the main page of this app. It contains a left menu bar, a main map area, and a search bar reside here.
            </pre></details>
        </li>
        <li><details><summary>
            Progress</summary>
            <pre>This component is the loading page. It wrapped the Navigator component and initialize the app database or when the app launch at the first time.
            </pre></details>
        </li>
        <li><details><summary>
            PanoramaViewPage</summary>
            <pre>This component show the panorama view of searched location. It will be shown after clicked the "Street View" Button in Searched Location Box.
            </pre></details>
        </li>
        <li><details><summary>
            BarnHeatMapPage</summary>
            <pre>This component show the crowdedness of barns. It fetch the images from barn's surveillance camera and the busy level of barn calculated in server.
            </pre></details>
        </li>
        <li><details><summary>
            SettingsPage</summary>
            <pre>This component is the setting page that will display if the user click the "Gear" icon.
            </pre></details>
        </li>
        <li><details><summary>
            MainScreen</summary>
            <pre>This component is the pan gesture wrapper. It will handle gesture events.</pre></details>
        </li>
    </ul>
</li>

<li><h3><strong>Container</strong></h3>
    <ul>
        <li><details><summary>
            App</summary>
            <pre>It is the outermost container of the app. It consists of Router for switching each pages. It also check the latest database version when starting the app and call database update when needs. 
            </pre></details>    
        </li>
		</ul>
</ol>


<h2 id="Part2">Part II: Getting Started</h2> 

This Path Advisor mobile version application is developed with “React Native” If you do not have any experience in React Native, please visit its [website](https://reactnative.dev/). Here is the instructions on how to start building your project.  
<pre>1.Install React Native <br />Please read the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) thoroughly. Please install "React Native CLI" instead of "Expo CLI".</pre> 
<pre>2. Download this project. </pre>
<pre>3. Install Dependences and Run.<br /> 
a. Open a terminal and go the directory of the app 
b. Enter "npm install --save-dev jetifier" to install dependences. 
c. Enter "npx jetify".  
d. Enter "npx react-native run-android" to run the application. 
</pre> 


<h2 id="Part3">Part III: Potential Issues</h2>   

<ul>
    <li id="PI1">
        <h3>Backend Performance</h3>
        Now, the speed of querying a certain MapTile is quite slow due to realm database tool limitation. To improve it, please read the files under "backend" folder. If you have any question, please contact Huang Zeyu (huangbi@connect.ust.hk).
    </li>
</ul>

 

<h2 id="Part4">Part IV: Possible Future Features</h2>    

<ul>
    <li>
        <h3>Improvement on Querying Performance</h3>
        Currently, the speed of switching between floors is slow due to <a href="#PI1">"Backend Performance"</a>.
    </li>
    <li>
        <h3>Indoor Navigation</h3>
    </li>
</ul>


<h2 id="Part5">Part V: How to Add Plugin</h2>

<h3>Add your component</h3>

Add a new folder which contains the PluginPage component to component folder. 
```
├── frontend
|	├── components
|	│   ├── NewPluginPage
|	|	│   └── NewPluginPage.js
...
```


<h3>Edit your plugin page</h3>
Below are the template for the plugin component page

```javascript
export default class NewPluginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // react state
    }
  }

  componentWillMount() {
    // action before DOM mount
  }

  componentDidMount() {
    // action after DOM mount
  }

  componentWillReceiveProps(nextProps) {
    // action when props will be updated
  }
  
  componentDidUpdate(nextProps, nextState) {
    // action when DOM rerender
  }

  // There are other lifecyle method in React. Please check https://reactjs.org/docs/react-component.html

  render() {
    return (
      // JSX, wrapped by "single" root element
    )
  }
}

const styles = StyleSheet.create({
    // style you want to use in the page
 })
```
<br/>


 <h3>Add your plugin page to route and app menu</h3>

In ```/App.js```, add your plugin page.
```javascript

import NewPluginPage from './frontend/components/NewPluginPage';
// ... 
export default class App extends Component {
  // ...
  render() {
    // ...
    return (
      <Provider store={store}>
        <Router
          navigationBarStyle={styles.navBar}
          titleStyle={styles.navTitle}
          headerTintColor="#003366"
        >
          <Scene key="root">
            // ...
            <Scene key='NewPluginPage'
              component={NewPluginPage}
              title='NewPluginPage'>
            </Scene>
          </Scene>
        </Router>
      </Provider>
    )
  }
}
// ...

```

<br/>

In ```/frontend/components/Navigator/navigator.js```, add your plugin page to the app menu in ```_renderDrawer``` function.
```javascript
// ...
class Navigator extends React.Component {
  // ...
  _renderDrawer() {
    return (
      <View style={styles.drawerContainer}>
        <ScrollView>
          /// ...
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Actions.NewPluginPage()}
          >
            <Text style={styles.drawerSubSection}>
              New Plugin Page
            </Text>
            <Icon type='Ionicons' name='ios-arrow-forward' style={styles.menuItemArrowRight}></Icon>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
  // ...
}
// ...

```
<br/>
<h3>Create Redux State for your plugin (If needed)</h3>

Redux is a predictable state container for JavaScript apps. It allows state share between components. When a component update the redux state, other component with that state will be updated as well.

To create and use redux state, there are a few steps.

1.  Add a new reducer and its folder in ```/frontend/reducer/ ```
```
├── reducer
│   ├── newPlugin
│   |	└── actionList.js
│   |	└── index.js
```
- actionList.js
```javascript
export  const  ACTION_1 = 'ACTION_1';
// ...
```
- actionList.js
```javascript
import {api} from '../../../backend'

import {
// action 
  ACTION1,
} from './actionList'

import AsyncStorage from '@react-native-community/async-storage';

let initialState = {
  // initial state of redux
  state1 : null
}

function someActions(_id) {
  // do some process (e.g. query) and return something
  // ...
  return _id;
}

export default newPluginReducer = (state = initialState, action) => {
    switch(action.type){
        //
        case ACTION1:
            return {
                ...state,
                'state1': someActions(action._id)
            };
        default:
            return state;
    }
}

```

2.  Attach the reducer to redux state in ```/frontend/reducer/index.js```
```
	import { combineReducers } from 'redux';
	// ...
	import newPluginReducer from './newPlugin'
	export default combineReducers({
		   // ...
		   newPluginReducer,
	});
```
3.  In your plugin page ```/frontend/components/NewPluginPage/NewPluginPage.js```, create function ```mapDispatchToProps``` and ```mapStateToProps```, and export the component with function ```connect``` from ```react-redux``` modules. 
For more details of how redux works, please read [https://redux.js.org/basics/reducers](https://redux.js.org/basics/reducers)

```javascript
import { connect } from  'react-redux';
import {
ACTION1,
} from  '../../reducer/newPlugin/actionList';

// ...

function  mapStateToProps(state) {
	return{
		state1:  state.newPluginReducer.state1,
	}
} 

function  mapDispatchToProps(dispatch) {
	return{
		ACTION1: () =>  dispatch({type:  ACTION1, payload:  {_id: 2 // example}}),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPluginPage)
```
