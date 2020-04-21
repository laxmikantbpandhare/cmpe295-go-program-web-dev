package edu.sjsu.go;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class Preferences {

    public Preferences() {

    }

    public static boolean saveAuthToken(String token, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putString(Constants.KEY_AUTH_TOKEN, token);
        prefsEditor.apply();
        return true;
    }

    public static String getAuthToken(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getString(Constants.KEY_AUTH_TOKEN, null);
    }
}
