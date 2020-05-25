package edu.sjsu.go;

import android.app.DownloadManager;
import android.content.Intent;
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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class RedeemFragment extends Fragment implements ItemsAdapter.OnItemClickListener {
    public static final String EXTRA_URL = "imageURL";
    public static final String EXTRA_NAME = "itemName";
    public static final String EXTRA_POINTS = "itemPoints";
    public static final String EXTRA_ID = "itemID";
    public static final String EXTRA_SIZES = "itemSizes";
    public static final String EXTRA_IDS = "itemIDs";
    public static final String EXTRA_QUANTITIES = "itemQuantities";

    private RecyclerView mRecyclerView;
    private ItemsAdapter mAdapter;
    private RequestQueue mRequestQueue;
    private ArrayList<ItemsItem> itemsList = new ArrayList<>();

    private String TAG_ACTIVITY = "RedeemFragment";

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_redeem, container, false);

        mRecyclerView = (RecyclerView) rootView.findViewById(R.id.rdRecylerView);
        mRecyclerView.setHasFixedSize(true);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        mRequestQueue = Volley.newRequestQueue(getActivity());

        parseJSON();

        return rootView;
    }

    private void parseJSON() {
        Log.d(TAG_ACTIVITY, "Maling network call");

        String url = ConstantUtils.DOMAIN_URL + "admin/items";

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG_ACTIVITY, response.toString());
                        try {
                            JSONArray jsonArray = response.getJSONArray("items");
                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject item = jsonArray.getJSONObject(i);

                                String name = item.getString("name");
                                String category = item.getString("points");
                                String imageURL = item.getJSONArray("images").get(0).toString();
                                String itemID   = item.getString("_id");

                                //ArrayList<String> sizes = new ArrayList<String>();
                                //ArrayList<String> IDs = new ArrayList<String>();
                                //ArrayList<String> quantities = new ArrayList<String>();

                                // Get sizes, their respective IDs and quantities from attributes
                                JSONArray att = item.getJSONArray("attributes");
                                String[] sizes = new String[att.length()];
                                String[] IDs = new String[att.length()];
                                int[] quantities = new int[att.length()];

                                Log.d(TAG_ACTIVITY, att.toString() + att.length());

                                for (int j = 0; j < att.length(); j++) {

                                    JSONObject atb = att.getJSONObject(j);
                                    Log.d(TAG_ACTIVITY, atb.toString());
                                    //IDs.add(atb.getString("_id"));
                                    //sizes.add(atb.getString("size"));
                                    //quantities.add(atb.getString("quantity"));
                                    IDs[j] = atb.getString("_id");
                                    sizes[j] = atb.getString("size");
                                    quantities[j] = atb.getInt("quantity");
                                }

                                Log.d(TAG_ACTIVITY, name + category + imageURL + IDs.length);

                                itemsList.add(new ItemsItem(imageURL, name, category, itemID,
                                        sizes, IDs, quantities));
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                        mAdapter = new ItemsAdapter(getActivity(), itemsList);
                        mAdapter.setOnItemClickListener(RedeemFragment.this);
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
        ItemsItem clickedItem = itemsList.get(position);
        Log.d(TAG_ACTIVITY, "Cliked " + clickedItem.getItemTitle());

        Intent orderIntent = new Intent(getActivity(), SubmitOrderActivity.class);
        orderIntent.putExtra(EXTRA_URL, clickedItem.getImageResource());
        orderIntent.putExtra(EXTRA_NAME, clickedItem.getItemTitle());
        orderIntent.putExtra(EXTRA_POINTS, clickedItem.getItemCategory());
        orderIntent.putExtra(EXTRA_ID, clickedItem.getItemID());
        orderIntent.putExtra(EXTRA_IDS, clickedItem.getmItemAttributes());
        orderIntent.putExtra(EXTRA_SIZES, clickedItem.getItemSizes());
        orderIntent.putExtra(EXTRA_QUANTITIES, clickedItem.getmItemQuantities());
        startActivity(orderIntent);
    }
}
