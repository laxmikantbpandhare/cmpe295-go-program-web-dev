package edu.sjsu.go;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class PreferencesUtils {

    public PreferencesUtils() {

    }

    public static boolean saveAuthToken(String token, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putString(ConstantUtils.KEY_AUTH_TOKEN, token);
        prefsEditor.apply();
        return true;
    }

    public static String getAuthToken(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getString(ConstantUtils.KEY_AUTH_TOKEN, null);
    }
}
