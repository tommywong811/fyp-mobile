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
   <details>
   <summary>
   Floors
   </summary>
   <h3 id="FloorReducer">Floor reducer provides data about the current floor.</h3>

   State:
   <pre>
   * data
   * currentFloor
   * currX
   * currY
   * sumX
   * sumY
   * suggestedNodes
   * currentNode
   * currentBuilding
   * renderLoadingPage
   * mapTileCache
   * previousNode
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
   * data
   * currentNode
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
   * data
   * fromNodeId
   * toNodeId
   * floors
   </pre>

   Actions
   <pre>
   * UPDATE_PATH 
   * CLEAR_PATH_STATE
   </pre>
   </details>
</li>

<li><h3><strong>Utility Plugin</strong> (Under plugins folder)</h3>
    <ul>
    <li>
        <strong>getMapTileNumber(x, y)</strong>
    </li>
    <li><strong>getMapTileDir</strong></li> 
    <li><strong>dirToUri</strong></li> 
    <li><strong>createImage</strong></li> 
    <li><strong>generateMapTiles</strong></li> 
    <li><strong>getFloorDimension</strong></li> 
    <li><strong>mapTilesRefactor</strong></li> 
    <li><strong>getMapTileDim</strong></li>
    <li><strong>getDefualtView</strong></li>
    <li><strong>getNodeOffsetForEachFloor</strong></li>
    <li><strong>getNodeImageByConnectorId</strong></li>
    <li><strong>getNodeImageByTagId</strong></li>
    </ul>
</li>

<li><h3><strong>Components</strong></h3>
    <ul>
        <li>
            EventListPage
            <pre>This Component is responsible to call HKUST event calendar to fetch recent events. After fetching events, it will display all events on a new page.
            </pre>    
        </li>
        <li>
            FacilityInforPage
            <pre>This Component is used to store some real world pictures of the campus facility.(Still Updating)
            </pre>    
        </li>
        <li>
            LoadingPage
            <pre>This Component shows when the content is loading, for example, switch to another floor.
            </pre>
        </li>
        <li>MapTiles
            <pre>This component get the floor information from <a href="#FloorReducer">Floor Reducer</a>, which includes the dimension of the floor. We can make use of APIs from backend to find the uri of every maptile.
            </pre>
        </li>
        <li>Navigator</li>
        <li>Progress</li>
        <li>SettingsPage</li>
        <li>MainScreen</li>
    </ul>
</li>
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


<h2 id="Part5">Part V: How to Add Features</h2>
