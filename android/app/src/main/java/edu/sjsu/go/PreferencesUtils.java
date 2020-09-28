package edu.sjsu.go;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import org.json.JSONException;
import org.json.JSONObject;

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

    public static boolean savePointsEarned(int points, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putInt(ConstantUtils.KEY_USER_POINTS_EARNED, points);
        prefsEditor.apply();
        return true;
    }

    public static int getPointsEarned(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getInt(ConstantUtils.KEY_USER_POINTS_EARNED, 0);
    }

    public static boolean savePointsSpent(int points, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putInt(ConstantUtils.KEY_USER_POINTS_SPENT, points);
        prefsEditor.apply();
        return true;
    }

    public static int getPointsSpent(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getInt(ConstantUtils.KEY_USER_POINTS_SPENT, 0);
    }

    public static boolean saveEventsSubCount(int points, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putInt(ConstantUtils.KEY_USER_EV_SUB_COUNT, points);
        prefsEditor.apply();
        return true;
    }

    public static int getEventsSubCount(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getInt(ConstantUtils.KEY_USER_EV_SUB_COUNT, 0);
    }

    public static boolean saveEventsAppCount(int points, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putInt(ConstantUtils.KEY_USER_EV_APP_COUNT, points);
        prefsEditor.apply();
        return true;
    }

    public static int getEventsAppCount(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getInt(ConstantUtils.KEY_USER_EV_APP_COUNT, 0);
    }

    public static boolean savePrizesCount(int points, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();
        prefsEditor.putInt(ConstantUtils.KEY_USER_PRIZES_COUNT, points);
        prefsEditor.apply();
        return true;
    }

    public static int getPrizesCount(Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        return prefs.getInt(ConstantUtils.KEY_USER_PRIZES_COUNT, 0);
    }

    public static boolean saveUserData(JSONObject userData, Context context) {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor prefsEditor = prefs.edit();

        String id = userData.optString("id");
        String fname = userData.optString("fname");
        String lname = userData.optString("lname");
        String email = userData.optString("email");
        String major = userData.optString("major");
        String year = userData.optString("year");

        prefsEditor.putString(ConstantUtils.KEY_USER_ID, id);
        prefsEditor.putString(ConstantUtils.KEY_USER_FNAME, fname);
        prefsEditor.putString(ConstantUtils.KEY_USER_LNAME, lname);
        prefsEditor.putString(ConstantUtils.KEY_USER_EMAIL, email);
        prefsEditor.putString(ConstantUtils.KEY_USER_MAJOR, major);
        prefsEditor.putString(ConstantUtils.KEY_USER_YEAR, year);
        prefsEditor.apply();
        return true;
    }

    public static JSONObject getUserData(Context context) throws JSONException {
        SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(context);
        String id = prefs.getString(ConstantUtils.KEY_USER_ID, null);
        String fname = prefs.getString(ConstantUtils.KEY_USER_FNAME, null);
        String lname = prefs.getString(ConstantUtils.KEY_USER_LNAME, null);
        String email = prefs.getString(ConstantUtils.KEY_USER_EMAIL, null);
        String major = prefs.getString(ConstantUtils.KEY_USER_MAJOR, null);
        String year = prefs.getString(ConstantUtils.KEY_USER_YEAR, null);

        JSONObject userData = new JSONObject();
        userData.put("id", id);
        userData.put("fname", fname);
        userData.put("lname", lname);
        userData.put("email", email);
        userData.put("major", major);
        userData.put("year", year);

        return userData;
    }
}
