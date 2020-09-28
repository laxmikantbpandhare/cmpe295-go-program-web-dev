package edu.sjsu.go;

import android.content.Intent;
import android.icu.text.SimpleDateFormat;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class EventsFragment extends Fragment implements EventsAdapter.OnItemClickListener {

    private RecyclerView mRecyclerView;
    private EventsAdapter mAdapter;
    private RequestQueue mRequestQueue;
    private ArrayList<EventsItem> eventsList = new ArrayList<>();

    private String TAG_ACTIVITY = "EventsFragment";
    private String studentId;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_events, container, false);

        try {
            studentId = PreferencesUtils.getUserData(getActivity()).getString("id");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mRecyclerView = (RecyclerView) rootView.findViewById(R.id.evRecylerView);
        mRecyclerView.setHasFixedSize(true);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        mRequestQueue = Volley.newRequestQueue(getActivity());

        parseJSON();

        return rootView;

        /*
        View rootView = inflater.inflate(R.layout.fragment_events, container, false);

        ArrayList<EventsItem> eventsList = new ArrayList<>();
        eventsList.add(new EventsItem(R.drawable.ic_events, "Event 1", "Today"));
        eventsList.add(new EventsItem(R.drawable.ic_events, "Event 2", "Today"));
        eventsList.add(new EventsItem(R.drawable.ic_events, "Event 3", "Today"));

        mRecyclerView = (RecyclerView) rootView.findViewById(R.id.recylerView);
        mRecyclerView.setHasFixedSize(true);
        mAdapter = new EventsAdapter(eventsList);

        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mRecyclerView.setAdapter(mAdapter);

        return rootView;*/
    }

    private void parseJSON() {
        Log.d(TAG_ACTIVITY, "Making network call for " + studentId);

        String url = ConstantUtils.DOMAIN_URL + "student/ownEvents?id=" + studentId;

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        int appEventsCount = 0;
                        Log.d(TAG_ACTIVITY, response.toString());
                        try {
                            JSONArray jsonArray = response.getJSONArray("events");
                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject item = jsonArray.getJSONObject(i);

                                String imageURL    = item.getJSONArray("images").get(0).toString();
                                String itemID      = item.getString("_id");
                                String eventDesc   = item.getString("description");
                                String eventStatus = item.getString("status");

                                if (eventStatus.equals("Approved")) {
                                    appEventsCount += 1;
                                }

                                JSONObject event   = item.getJSONObject("event");
                                String eventID     = event.getString("_id");
                                String eventName   = event.getString("name");
                                String eventPts    = event.getString("points");
                                String eventCrDate = event.getString("createdDate");
                                String eventUpDate = event.getString("updatedDate");

                                if (i == 0) {
                                    JSONObject stu = item.getJSONObject("student");
                                    int pointsEarned = stu.getInt("pointsAccumulated");
                                    int pointsSpent = stu.getInt("pointsSpent");

                                    PreferencesUtils.savePointsEarned(pointsEarned, getActivity());
                                    PreferencesUtils.savePointsSpent(pointsSpent, getActivity());
                                }

                                SimpleDateFormat dateFormat = null;
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                    dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                                    Date date = dateFormat.parse(eventCrDate.substring(0, eventCrDate.indexOf('T')));
                                    dateFormat = new SimpleDateFormat("MM/dd/yyyy");
                                    eventCrDate = dateFormat.format(date);
                                }

                                Log.d(TAG_ACTIVITY,
                                        eventName + eventPts + imageURL + eventStatus);

                                eventsList.add(new EventsItem(imageURL, eventName, eventDesc,
                                        eventPts, eventCrDate, eventUpDate, eventStatus));
                            }

                            PreferencesUtils.saveEventsSubCount(jsonArray.length(), getActivity());
                            PreferencesUtils.saveEventsAppCount(appEventsCount, getActivity());

                        } catch (JSONException | ParseException e) {
                            e.printStackTrace();
                        }

                        mAdapter = new EventsAdapter(getActivity(), eventsList);
                        mAdapter.setOnItemClickListener(EventsFragment.this);
                        mRecyclerView.setAdapter(mAdapter);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        }) {
            // Add headers to the request
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("Content-Type", "application/json; charset=UTF-8");
                params.put("Authorization", "Bearer " + PreferencesUtils.getAuthToken(getActivity()));
                return params;
            }
        };

        mRequestQueue.add(request);
    }

    @Override
    public void onItemClick(int position) {
        // Go to event detail fragment
    }
}
