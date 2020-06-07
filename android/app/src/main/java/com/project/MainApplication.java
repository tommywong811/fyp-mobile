package com.project;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import org.reactnative.maskedview.RNCMaskedViewPackage;
import nl.lightbase.PanoramaViewPackage;
import org.wonday.pdf.RCTPdfView;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.rnfs.RNFSPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.realm.react.RealmReactPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SvgPackage(),
            new RNScreensPackage(),
            new SafeAreaContextPackage(),
            new RNBackgroundFetchPackage(),
            new RNCMaskedViewPackage(),
            new PanoramaViewPackage(),
            new RCTPdfView(),
            new RNCWebViewPackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new ReanimatedPackage(),
            new RNFSPackage(),
            new RNGestureHandlerPackage(),
            new RealmReactPackage(),
            new RNZipArchivePackage(),
            new AsyncStoragePackage(),
            new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
