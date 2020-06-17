package com.project;
import android.app.Activity;
import android.content.Intent;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.CatalystInstance;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;

import javax.annotation.Nonnull;

public class AdministrationModule extends  ReactContextBaseJavaModule{
    public AdministrationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "Administration";
    }

    @ReactMethod
    public void Navigation(String name) {
        MainActivity activity = (MainActivity) getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, ImageListActivity.class);
            intent.putExtra("roomName",name);
            activity.startActivity(intent);
        }
    }
}
