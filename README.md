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
   * data: All maptile data of all floors.
   * currentFloor: The current floor ID.
   * currX: The x coordinate of current node. 
   * currY: The y coordinate of current node. 
   * sumX: The number of maptiles in x direction of this floor. 
   * sumY: The number of maptiles in y direction of this floor.
   * suggestedNodes: The suggested node.
   * currentNode: The current searched node. 
   * currentBuilding: The current Building.
   * renderLoadingPage: Whether display the loading page.
   * mapTileCache: A 2D array that stores the URIs of all maptiles in the floor.
   * previousNode: The previous node.
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
   * data: All node data.
   * currentNode: The current node.
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
   * data: A path of nodes from home to destination.  
   * fromNodeId: The ID of home node.
   * toNodeId: The ID of destination node.
   * floors: The floors of home node and destination node.
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
    <details><summary>
    <strong>dirToUri</strong>
    </summary>
    <pre>[Input]:
    dir: The direction identity of a maptile.
[Output]:
    uri: The unique identity of a maptile in database. 
    </pre>
    </details>
    </li> 
    <li>
    <details><summary>
    <strong>createImage</strong>
    </summary>
    <pre>[Input]:
    uri: The unique identity of a maptile in database.
[Output]:
    Image: an image component with specific uri.
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>generateMapTiles</strong></summary>
    <pre>[Input]:
    offsetX: The x coordinate of the upper left corner.
    offsetY: The y coordinate of the upper left corner.
    width: The width of this floor.
    height: The height of this floor.
    floor: The floor that is displayed.
    level: Zoom level.
[Output]:
    {result, dimension}: The "result" is a list of maptile. The "dimension" contains width and height of this floor.
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>getFloorDimension</strong></summary>
    <pre>[Input]:
    offsetX: The x coordinate of the upper left corner.
    offsetY: The y coordinate of the upper left corner.
    width: The width of this floor.
    height: The height of this floor.
[Output]:
    {left, top, width, height}: 
        left: The logical x coordinate upper left, 
        top: The logical y coordinate upper left, 
        width: The logical width of this floor, 
        height: The logical height of this floor  
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>mapTilesRefactor</strong></summary>
    <pre>[Input]:
    mapTiles: A two dimensional array of maptiles.
[Output]:
    result: A one dimensional array contains the same maptiles as mapTiles.
    </pre></details>
    </li> 
    <li>
    <details><summary>
    <strong>getMapTileDim</strong></summary>
    <pre>[Input]:
    maptiles: A one dimensional array of maptiles.
[Output]:
    {width, height}:
        width: The number of maptiles in x direction.
        height: The number of maptiles in y direction.
    </pre></details>
    </li>
    <li>
    <details><summary>
    <strong>getDefualtView</strong></summary>
    <pre>[Input]:
    left: The x of upper left corner. 
    top: The y of upper left corner.
    numOfRow: The number of maptiles in y direction. 
    numOfCol: The number of maptiles in x direction.
    floorId:
    zoomLevel: Zoom level
    cacheImage: A two dimensional array containing all URIs of maptiles in the floor. This parameter will be rewritten in the function. 
    </pre></detials>
    </li>
    <li>
    <details><summary>
    <strong>getNodeOffsetForEachFloor</strong></summary>
    <pre>[Input]:
    floorId: The ID of a floor.
[OutPut]:
    {x, y}:
        x: The number of maptiles in x direction;
        y: The number of maptiles in y direction;
    </pre></details>
    </li>
    <li>
    <details><summary>
    <strong>getNodeImageByConnectorId</strong></summary>
    <pre>[Input]:
    connectorId: The ID of a connector.
[Output]:
    image: The image of that connector.
    </pre></details>
    </li>
    <li>
    <details><summary>
    <strong>getNodeImageByTagId</strong></summary>
    <pre>[Input]:
    tag: The ID of a tag.
[Output]:
    image: The image of that tag.
    </pre></details>
    </li>
    </ul>
</li>

<li><h3><strong>Components</strong></h3>
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
            <pre>This component is the loading page. It will be used upon initializing the app or switching between floors.
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


<h2 id="Part5">Part V: How to Add Small Features</h2>
<ol>
<li>Create a folder under "frontent->component".</li>
<li>Write and export "index.js" that can render your componet.</li>
<li>Import your component to <a href="#Navigator">Navigator Component</a></li>
<li>Register your component inside "_renderDrawer()" in <a href="#Navigator">Navigator Component</a></li>
</ol>
