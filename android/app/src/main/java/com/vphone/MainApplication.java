package com.vphone;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.carusto.ReactNativePjSip.PjSipModulePackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.carusto.ReactNativePjSip.PjSipModulePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.zmxv.RNSound.RNSoundPackage;

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
            new PjSipModulePackage(),
            new RNNetworkInfoPackage(),
            new RNFirebasePackage(),
            new ReactNativeContacts(),
            new RNFirebasePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new ReactNativeContacts(),
            new PjSipModulePackage(),
            new RNSoundPackage()
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
