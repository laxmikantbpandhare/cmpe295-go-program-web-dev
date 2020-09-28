/* Dummy Activity for testing */

package edu.sjsu.go;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.google.android.material.navigation.NavigationView;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class WebActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    private String TAG_ACTIVITY = "WebActivity";
    private DrawerLayout drawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawer = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        /* To avoid reloading the fragment on screen rotation */
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction().replace(R.id.frame_container,
                    new DashboardFragment()).commit();
            navigationView.setCheckedItem(R.id.nav_dashboard);
        }
    }

    @Override
    public void onBackPressed() {
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {

        switch (menuItem.getItemId()) {
            case R.id.nav_dashboard:
                getSupportFragmentManager().beginTransaction().replace(R.id.frame_container,
                        new DashboardFragment()).commit();
                break;

            case R.id.nav_events:
                getSupportFragmentManager().beginTransaction().replace(R.id.frame_container,
                    new EventsFragment()).commit();
                break;

            case R.id.nav_redeem:
                getSupportFragmentManager().beginTransaction().replace(R.id.frame_container,
                        new RedeemFragment()).commit();
                break;

            case R.id.nav_orders:
                getSupportFragmentManager().beginTransaction().replace(R.id.frame_container,
                        new OrdersFragment()).commit();
                break;
        }

        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    public void submitEvent(View v) {
        String token = PreferencesUtils.getAuthToken(this);
        Log.d("EventsFragment", "Submit event with token " + token);

        /*ArrayList<EventUtils> eventUtilsList = new ArrayList<EventUtils>();
        EventUtils user1 = new EventUtils("Jim", "jim@gmail.com", 20);
        userList.add(user1);
        EventUtils user2 = new EventUtils("John", "john@gmail.com", 23);
        userList.add(user2);
        EventUtils user3 = new EventUtils("Jenny", "jenny@gmail.com", 25);
        userList.add(user3);

        Intent i = new Intent(this, SubmitEventActivity.class);
        Bundle b = new Bundle();
        b.putParcelableArrayList("events", userList);
        i.putExtras(b);
        startActivity(i);*/
        //showProgress(true);
        Ion.with(this)
                .load("GET", ConstantUtils.DOMAIN_URL + "admin/ActiveEvents")
                .setHeader("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this))
                .asString()
                .setCallback(new FutureCallback<String>() {
                    @Override
                    public void onCompleted(Exception e, String result) {
                        Log.d(TAG_ACTIVITY, result);
                        if (e == null) {
                            ArrayList<EventUtils> eventUtilsList = new ArrayList<EventUtils>();
                            JSONObject o = new JSONObject();

                            try {
                                o = new JSONObject(result);
                                JSONArray evArray = o.getJSONArray("events");
                                for (int i = 0; i < evArray.length(); i++) {
                                    o = evArray.getJSONObject(i);
                                    String id = o.getString("_id");
                                    String name = o.getString("name");
                                    int points = Integer.parseInt(o.getString("points"));
                                    EventUtils evUtils = new EventUtils(id, name, points);
                                    eventUtilsList.add(evUtils);
                                }

                                Log.d(TAG_ACTIVITY, String.valueOf(eventUtilsList));
                                Collections.sort(eventUtilsList);
                                Log.d(TAG_ACTIVITY, String.valueOf(eventUtilsList));

                                Intent i = new Intent(WebActivity.this, SubmitEventActivity.class);
                                Bundle b = new Bundle();
                                b.putParcelableArrayList("events", eventUtilsList);
                                i.putExtras(b);
                                startActivity(i);

                            } catch (JSONException ex) {
                                //e.printStackTrace();
                            }
                            String error = o.optString("error");

                            if (TextUtils.isEmpty(error)) {

                            } else {
                                //Show error
                                Log.d(TAG_ACTIVITY, "Error is empty");
                            }
                        } else {
                            Log.d(TAG_ACTIVITY, "Error not null");
                        }
                        //showProgress(false);
                    }
                });
        return ;
    }

}
