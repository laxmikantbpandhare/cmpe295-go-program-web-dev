package edu.sjsu.go;

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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class OrdersFragment extends Fragment implements OrdersAdapter.OnItemClickListener {

    private RecyclerView mRecyclerView;
    private OrdersAdapter mAdapter;
    private RequestQueue mRequestQueue;
    private ArrayList<OrdersItem> ordersList = new ArrayList<>();

    private String TAG_ACTIVITY = "OrdersFragment";
    private String studentId;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_orders, container, false);

        try {
            studentId = PreferencesUtils.getUserData(getActivity()).getString("id");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        mRecyclerView = (RecyclerView) rootView.findViewById(R.id.orRecylerView);
        mRecyclerView.setHasFixedSize(true);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));

        mRequestQueue = Volley.newRequestQueue(getActivity());

        parseJSON();

        return rootView;

        /*
        View rootView = inflater.inflate(R.layout.fragment_Orders, container, false);

        ArrayList<OrdersItem> OrdersList = new ArrayList<>();
        OrdersList.add(new OrdersItem(R.drawable.ic_Orders, "Order 1", "Today"));
        OrdersList.add(new OrdersItem(R.drawable.ic_Orders, "Order 2", "Today"));
        OrdersList.add(new OrdersItem(R.drawable.ic_Orders, "Order 3", "Today"));

        mRecyclerView = (RecyclerView) rootView.findViewById(R.id.recylerView);
        mRecyclerView.setHasFixedSize(true);
        mAdapter = new OrdersAdapter(OrdersList);

        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mRecyclerView.setAdapter(mAdapter);

        return rootView;*/
    }

    private void parseJSON() {
        Log.d(TAG_ACTIVITY, "Making network call for " + studentId);

        String url = ConstantUtils.DOMAIN_URL + "student/ownOrders?id=" + studentId;

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.d(TAG_ACTIVITY, response.toString());
                        try {
                            int cancelledCount = 0;
                            JSONArray jsonArray = response.getJSONArray("orders");
                            for (int i = 0; i < jsonArray.length(); i++) {
                                JSONObject item = jsonArray.getJSONObject(i);

                                String orderID     = item.getString("id");
                                String orderStatus = item.getString("status");
                                String orderPts    = item.getString("points");
                                String orderCrDate = item.getString("createdDate");

                                if (orderStatus.equals("Cancelled")) {
                                    cancelledCount += 1;
                                }

                                JSONObject item1 = (JSONObject) item.getJSONArray("items").get(0);
                                JSONObject embeddedItem = item1.getJSONObject("item");
                                String imageURL = embeddedItem.getJSONArray("images").get(0).toString();

                                SimpleDateFormat dateFormat = null;
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                                    dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                                    Date date = dateFormat.parse(orderCrDate.substring(0, orderCrDate.indexOf('T')));
                                    dateFormat = new SimpleDateFormat("MM/dd/yyyy");
                                    orderCrDate = dateFormat.format(date);
                                }

                                Log.d(TAG_ACTIVITY,
                                        orderID + orderPts + imageURL + orderStatus);

                                ordersList.add(new OrdersItem(imageURL, orderID,
                                        orderPts, orderCrDate, orderStatus));
                            }

                            PreferencesUtils.savePrizesCount(jsonArray.length() - cancelledCount, getActivity());

                        } catch (JSONException | ParseException e) {
                            e.printStackTrace();
                        }

                        mAdapter = new OrdersAdapter(getActivity(), ordersList);
                        mAdapter.setOnItemClickListener(OrdersFragment.this);
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
        // Go to Order detail fragment
    }
}
