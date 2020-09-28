package edu.sjsu.go;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.database.Cursor;
import android.icu.text.SimpleDateFormat;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.snackbar.Snackbar;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static edu.sjsu.go.RedeemFragment.EXTRA_ID;
import static edu.sjsu.go.RedeemFragment.EXTRA_IDS;
import static edu.sjsu.go.RedeemFragment.EXTRA_NAME;
import static edu.sjsu.go.RedeemFragment.EXTRA_POINTS;
import static edu.sjsu.go.RedeemFragment.EXTRA_QUANTITIES;
import static edu.sjsu.go.RedeemFragment.EXTRA_SIZES;
import static edu.sjsu.go.RedeemFragment.EXTRA_URL;

public class SubmitOrderActivity extends AppCompatActivity {

    private String TAG_ACTIVITY = "SubmitEventActivity";

    private View mProgressView;
    private View mSubmitFormView;
    private Button mSubmitButton;
    private ImageView imageView;
    private TextView nameText;
    private TextView pointsText;
    private TextView sizeText;

    String imageURL;
    String itemName;
    String itemPoints;
    String itemID;
    String[] itemAttributes;
    String[] itemSizes;
    int[] itemQuantities;

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_submit_order);

        Intent intent = getIntent();
        imageURL = intent.getStringExtra(EXTRA_URL);
        itemName = intent.getStringExtra(EXTRA_NAME);
        itemPoints = intent.getStringExtra(EXTRA_POINTS);
        itemID = intent.getStringExtra(EXTRA_ID);

        Bundle b = this.getIntent().getExtras();
        itemAttributes = b.getStringArray(EXTRA_IDS);
        itemSizes = b.getStringArray(EXTRA_SIZES);
        itemQuantities = b.getIntArray(EXTRA_QUANTITIES);

        imageView  = findViewById(R.id.itemImage);
        nameText   = findViewById(R.id.itemName);
        pointsText = findViewById(R.id.itemPoints);
        sizeText = findViewById(R.id.itemSize);

        Picasso.with(this).load(imageURL).fit().centerInside().into(imageView);
        nameText.setText(itemName);
        pointsText.setText("Points Required: " + itemPoints);
        sizeText.setText("Size: " + itemSizes[0]);

        /* Setup submit button listener */
        mSubmitButton = (Button)
                findViewById(R.id.submit_button);
        mSubmitButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        try {
                            attemptSubmission();
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });

        mSubmitFormView = findViewById(R.id.submit_form);
        mProgressView = findViewById(R.id.signup_progress);

    }

    private void attemptSubmission() throws JSONException {
        if (!mSubmitButton.isEnabled()) {
            return;
        }

        //showProgress(true);
        JsonParser jsonParser = new JsonParser();

        JSONObject stuObj = PreferencesUtils.getUserData(this);
        JsonObject stuGsonObject = (JsonObject) jsonParser.parse(stuObj.toString());

        // orderItems array with itemID, size and quantity
        JsonObject orderObj = new JsonObject();
        orderObj.addProperty("item", itemID);
        orderObj.addProperty("size", itemSizes[0]);
        orderObj.addProperty("quantity", "1");

        // inventoryItems array with itemID, attributeID? and quantity - 1
        JsonObject inventoryObj = new JsonObject();
        inventoryObj.addProperty("itemId", itemID);
        inventoryObj.addProperty("attributeId", itemAttributes[0]);
        inventoryObj.addProperty("newQuantity", itemQuantities[0] - 1);

        JsonObject jsonReq = new JsonObject();

        jsonReq.add("student", stuGsonObject);

        // Add order and inventory as an array and not as an object
        // Mobile app will not have the concept of a cart
        // Only one order at a time

        JsonArray orderArr = new JsonArray();
        orderArr.add(orderObj);
        jsonReq.add("orderItems", orderArr);

        JsonArray invArr = new JsonArray();
        invArr.add(inventoryObj);
        jsonReq.add("inventoryItems", invArr);

        jsonReq.addProperty("points", Integer.parseInt(itemPoints));

        Ion.with(this)
                .load("POST", ConstantUtils.DOMAIN_URL + "student/createOrder")
                .setHeader("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this))
                .setJsonObjectBody(jsonReq)
                .asString()
                .setCallback(new FutureCallback<String>() {
                    @Override
                    public void onCompleted(Exception e, String result) {
                        Log.d(TAG_ACTIVITY, result);
                        if (e == null) {
                            JSONObject o = new JSONObject();
                            try {
                                o = new JSONObject(result);
                            } catch (JSONException ex) {
                                //e.printStackTrace();
                            }
                            String error = o.optString("error");

                        } else {
                            Log.d(TAG_ACTIVITY, "Error not null");
                        }
                        //showProgress(false);
                        //Snackbar mySnackbar = Snackbar.make(findViewById(R.id.submit_form),
                               // "Order submitted", Snackbar.LENGTH_SHORT);

                        Intent i = new Intent(SubmitOrderActivity.this, WebActivity.class);
                        startActivity(i);
                    }
                });
        //}
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >=
                Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(
                    android.R.integer.config_shortAnimTime);

            mSubmitFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mSubmitFormView
                    .animate()
                    .setDuration(shortAnimTime)
                    .alpha(show ? 0 : 1)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            mSubmitFormView.setVisibility(show ? View.GONE : View.VISIBLE);
                        }
                    });

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mSubmitFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }
}