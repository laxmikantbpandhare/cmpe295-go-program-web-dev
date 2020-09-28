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
import android.text.TextUtils;
import android.util.JsonWriter;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SubmitEventActivity extends AppCompatActivity implements DatePickerDialog.OnDateSetListener {

    private String TAG_ACTIVITY = "SubmitEventActivity";
    private int CAMERA_REQUEST = 0;

    private EditText mDescView;
    private TextView mDateView;
    private Spinner mEventSpinner;
    private View mProgressView;
    private View mSubmitFormView;
    private Button mSubmitButton;
    private EventUtils mSelectedEvent;
    private List<EventUtils> eventUtilsList;
    private String imageURL;
    private String completedDate;

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_submit_event);

        Bundle bundle = getIntent().getExtras();
        ArrayList<EventUtils> userList = null;
        if (bundle != null) {
            userList = bundle.getParcelableArrayList("events");
        } else {
            Log.d(TAG_ACTIVITY, "Bundle is null, events not received");
        }

        mDateView = findViewById(R.id.eventDate);
        mDescView = findViewById(R.id.eventDesc);

        mEventSpinner = findViewById(R.id.eventType);

        /*
        EventUtils user1 = new EventUtils("Jim", "jim@gmail.com", 20);
        userList.add(user1);
        EventUtils user2 = new EventUtils("John", "john@gmail.com", 23);
        userList.add(user2);
        EventUtils user3 = new EventUtils("Jenny", "jenny@gmail.com", 25);
        userList.add(user3);*/

        /* Setup spinner */
        ArrayAdapter<EventUtils> adapter = new ArrayAdapter<EventUtils>(this,
                android.R.layout.simple_spinner_item, userList);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mEventSpinner.setAdapter(adapter);
        mEventSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                mSelectedEvent = (EventUtils) parent.getSelectedItem();
                Log.d("Activity", mSelectedEvent.toString());
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

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

    private void showDatePickerDialog() {
        DatePickerDialog datePickerDialog = new DatePickerDialog(this, this,
                Calendar.getInstance().get(Calendar.YEAR),
                Calendar.getInstance().get(Calendar.MONTH),
                Calendar.getInstance().get(Calendar.DAY_OF_MONTH));
        datePickerDialog.show();
    }

    public void pickDate(View v) {
        showDatePickerDialog();
    }

    public void attachImage(View v) {

        // Create a new Intent to open the picture selector:
        Intent loadPicture = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);

        // To start it, run the startActivityForResult() method:
        startActivityForResult(loadPicture, CAMERA_REQUEST);
        imageURL = "https://twitter-prototype-project.s3.us-west-1.amazonaws.com/sjsu_go%3A1590134760619.png";
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(TAG_ACTIVITY, "onActivityResult " + resultCode);

        /*Uri selectedImageUri = data.getData();
        String s = getRealPathFromURI(selectedImageUri);
        Log.d(TAG_ACTIVITY, s);

        showProgress(true);
        Ion.with(this)
                .load("POST",ConstantUtils.DOMAIN_URL + "upload/images")
                //.uploadProgressBar(uploadProgressBar)
                .setHeader("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this))
                .setMultipartFile("image", "application/jpg", new File(s))
                .asString()
                .setCallback(new FutureCallback<String>() {
                    @Override
                    public void onCompleted(Exception e, String result) {
                        Log.d(TAG_ACTIVITY, result);
                        if (e == null) {
                            Log.d(TAG_ACTIVITY, "REST successful");
                            JSONObject o;
                            JSONArray imagesArray;
                            try {
                                o = new JSONObject(result);
                                imagesArray = o.getJSONArray("imagesUrl");
                                imageURL = imagesArray.getString(0);
                            } catch (JSONException ex) {
                                //e.printStackTrace();
                            }

                        } else {
                            Log.d(TAG_ACTIVITY, "Error not null");
                        }
                        showProgress(false);
                    }
                });*/
    }

    public String getRealPathFromURI(Uri uri) {
        String[] projection = { MediaStore.Images.Media.DATA };
        @SuppressWarnings("deprecation")
        Cursor cursor = managedQuery(uri, projection, null, null, null);
        int column_index = cursor
                .getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        return cursor.getString(column_index);
    }

    private void attemptSubmission() throws JSONException {
        if (!mSubmitButton.isEnabled()) {
            return;
        }

        showProgress(true);
        JsonParser jsonParser = new JsonParser();

        JSONObject stuObj = PreferencesUtils.getUserData(this);
        JsonObject stuGsonObject = (JsonObject) jsonParser.parse(stuObj.toString());

        JsonArray imArray = new JsonArray();
        JsonPrimitive image = new JsonPrimitive(imageURL);
        imArray.add(image);
        JsonObject evObject = new JsonObject();
        evObject.addProperty("id", mSelectedEvent.getId());

        JsonObject jsonReq = new JsonObject();
        jsonReq.addProperty("description", mDescView.getText().toString());
        jsonReq.addProperty("completedDate", completedDate);
        jsonReq.add("student", stuGsonObject);
        jsonReq.add("event", evObject);
        jsonReq.add("images", imArray);

        Ion.with(this)
                .load("POST", ConstantUtils.DOMAIN_URL + "student/createEvent")
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
                        showProgress(false);
                        Snackbar mySnackbar = Snackbar.make(findViewById(R.id.submit_form),
                                "Event submitted", Snackbar.LENGTH_SHORT);

                        Intent i = new Intent(SubmitEventActivity.this, WebActivity.class);
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

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month, dayOfMonth);

        SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        String dateString = dateFormat.format(calendar.getTime());
        mDateView.setText("Completed Date - " + dateString);

        dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateString = dateFormat.format(calendar.getTime());
        completedDate = dateString + "T07:00:00.000Z";
    }
}

/*
    @RequiresApi(api = Build.VERSION_CODES.N)
    private void populateEventTypes(Spinner spinner, List<EventUtils> eventUtilsList) {
        showProgress(true);
        Ion.with(this)
                .load("GET", "http://10.0.0.89:3001/admin/ActiveEvents")
                .setHeader("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this))
                .asString()
                .setCallback(new FutureCallback<String>() {
                    @Override
                    public void onCompleted(Exception e, String result) {
                        Log.d(TAG_ACTIVITY, result);
                        if (e == null) {

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

                                ArrayAdapter<EventUtils> adapter = new ArrayAdapter<EventUtils>(SubmitEventActivity.this,
                                        android.R.layout.simple_spinner_item, eventUtilsList);
                                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                                mEventSpinner.setAdapter(adapter);

                                mEventSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                                    @Override
                                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                                        mSelectedEvent = (EventUtils) parent.getSelectedItem();
                                        Log.d(TAG_ACTIVITY, mSelectedEvent.toString());
                                    }

                                    @Override
                                    public void onNothingSelected(AdapterView<?> parent) {
                                        Log.d(TAG_ACTIVITY, "What the fuck");
                                    }
                                });

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
                        showProgress(false);
                    }
                });
        return ;
    }*/