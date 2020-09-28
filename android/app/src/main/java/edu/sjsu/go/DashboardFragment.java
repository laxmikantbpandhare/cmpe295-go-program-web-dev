package edu.sjsu.go;

import android.icu.text.SimpleDateFormat;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class DashboardFragment extends Fragment {

    private String TAG_ACTIVITY = "DashboardFragment";
    private String studentId;
    private TextView tv;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View rootView =  inflater.inflate(R.layout.fragment_dashboard, container, false);

        int pE = PreferencesUtils.getPointsEarned(getActivity());
        int pS = PreferencesUtils.getPointsSpent(getActivity());
        String name = "";

        try {
            name = PreferencesUtils.getUserData(getActivity()).getString("fname");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        tv = (TextView) rootView.findViewById(R.id.greet);
        tv.setText("Welcome " + name);

        tv = (TextView) rootView.findViewById(R.id.db_pts_earn);
        tv.setText("Points earned: " + pE);

        tv = (TextView) rootView.findViewById(R.id.db_pts_spent);
        tv.setText("Points spent: " + pS);

        tv = (TextView) rootView.findViewById(R.id.db_pts_bal);
        tv.setText("Balance points: " + (pE - pS));

        tv = (TextView) rootView.findViewById(R.id.db_ev_sub);
        tv.setText("Events submitted: " + PreferencesUtils.getEventsSubCount(getActivity()));

        tv = (TextView) rootView.findViewById(R.id.db_ev_app);
        tv.setText("Events approved: " + PreferencesUtils.getEventsAppCount(getActivity()));

        tv = (TextView) rootView.findViewById(R.id.db_prizes);
        tv.setText("Prizes redeemed: " + PreferencesUtils.getPrizesCount(getActivity()));

        try {
            studentId = PreferencesUtils.getUserData(getActivity()).getString("id");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        //parsePointsJSON();

        //parseEventsJSON();

        //parseOrdersJSON();

        return rootView;
    }

}
