# Image-based Indoor Positioning System(Administration Application)
## Introduction
Image-based indoor positioning system allowed user to know their location in HKUST by simply take a photo or upload a 
existing photo. This system consist of the following project:

* [Web Application Frontend]()
* [Mobile Application]()
* [Backend API]()
* [Image Extraction Program]()

## Getting Started
This project is develop using React Native framework, if you are not familiar with this framework, please visit their 
[website](https://reactnative.dev/) for more documentation.
#### Hardware Requirement
* Android Phone
* Ricoh Theta S
#### Setting up the development environment
Please followed this [documentation](https://reactnative.dev/docs/environment-setup) provided by React Native, for the 
installation of Node, please install **Node 10.x**.
#### Download this project
#### Install dependencies and run
Go to the project directory, you can install dependencies by the following command
```
npm install --save-dev jetifier
npx jetify
```
#### Android Phone Setup
   Enable the developer option of your Android phone, you can check the documentation [here](https://developer.android.com/studio/debug/dev-options).
   Enable USB debugging.
#### Run the application
Connect your phone to the computer via USB and then run the application using the following command:
```
react-native run-android
```
Go to Setting > Apps > project > Permissions and enable the permission of storage.
#### Connect mobile phone to the camera
You can check Ricoh Theta S's [User Manual](https://support.theta360.com/uk/manual/s/content/prepare/prepare_06.html) for the connection of the camera.
#### Take Photo
You can take photo of any room by pressing the label of the room. Wait for a while until the live preview prop out. Press the `shoot` button to take a photo. You can then press
`save` to save the photo to the phone.  
   All the photo taken will be stored at the `saved_images` folder on your phone's device storage
## Project Structure
#### Ricoh Theta SDK
```
android/app/src/main
├── java/com/project/
│   ├── GLPhotoActivity.java
│   ├── glview/
│   │   ├── GLPhotoView.java
│   │   ├── GLRenderer.java
│   │   ├── model/
│   │   │   ├── package-info.java
│   │   │   └── UVSphere.java
│   │   └── package-info.java
│   ├── ImageListActivity.java
│   ├── model/
│   │   ├── Constants.java
│   │   ├── ImageSize.java
│   │   ├── package-info.java
│   │   ├── Photo.java
│   │   └── RotateInertia.java
│   ├── network/
│   │   ├── DeviceInfo.java
│   │   ├── HttpConnector.java
│   │   ├── HttpDownloadListener.java
│   │   ├── HttpEventListener.java
│   │   ├── ImageData.java
│   │   ├── ImageInfo.java
│   │   ├── package-info.java
│   │   ├── StorageInfo.java
│   │   └── XMP.java
│   └── view/
│       ├── ConfigurationDialog.java
│       ├── ImageListArrayAdapter.java
│       ├── ImageRow.java
│       ├── ImageSizeDialog.java
│       ├── LogView.java
│       ├── MJpegInputStream.java
│       ├── MJpegView.java
│       └── package-info.java
└── res/
    ├── drawable/
    │   └── ic_launcher.png
    ├── layout/
    │   ├── activity_glphoto.xml
    │   ├── activity_object_list.xml
    │   ├── activity_photo.xml
    │   ├── connection_menu.xml
    │   ├── dialog_glphotoview_config.xml
    │   ├── dialog_image_size.xml
    │   └── listlayout_object.xml
    ├── menu/
    │   ├── configuration.xml
    │   └── connection.xml
    └── values/
        ├── dimens.xml
        └── strings.xml

```
#### Bridging Module
```
android/app/src/main/java/com/project
├── AdministrationModule.java
├── AdministrationReactPackage.java
```
