package edu.sjsu.go;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.Spinner;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.snackbar.Snackbar;
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SubmitEventActivity extends AppCompatActivity implements DatePickerDialog.OnDateSetListener {

    private EditText mDescView;
    private EditText mDateView;
    private Spinner mEventType;
    private View mProgressView;
    private View mSubmitFormView;
    private Button mSubmitButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_submit_event);

        mDateView = findViewById(R.id.eventDate);
        mDescView = findViewById(R.id.eventDesc);

        /* Setup spinner */
        mEventType = findViewById(R.id.eventType);
        List<EventUtils> eventUtilsList = populateEventTypes(mEventType);
        ArrayAdapter<EventUtils> adapter = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_item, eventUtilsList);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        mEventType.setAdapter(adapter);

        /* Setup submit button listener */
        mSubmitButton = (Button)
                findViewById(R.id.submit_button);
        mSubmitButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        attemptSubmission();
                    }
                });

        mSubmitFormView = findViewById(R.id.submit_form);
        mProgressView = findViewById(R.id.signup_progress);

    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    private ArrayList<EventUtils> populateEventTypes(Spinner spinner) {

        final List<EventUtils> evList = new ArrayList<EventUtils>();

        Ion.with(this)
                .load("GET", "http://10.0.0.89:3001/admin/ActiveEvents")
                .setHeader("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this))
                .asString()
                .setCallback(new FutureCallback<String>() {
                    @Override
                    public void onCompleted(Exception e, String result) {
                        Log.d("SubmitEventsActivity", result);
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
                                    evList.add(evUtils);
                                }

                                Log.d("SubmitEventActivity", String.valueOf(evList));
                                Collections.sort(evList);
                                Log.d("SubmitEventActivity", String.valueOf(evList));

                            } catch (JSONException ex) {
                                //e.printStackTrace();
                            }
                            String error = o.optString("error");

                            if (TextUtils.isEmpty(error)) {

                            } else {
                                //Show error
                                Log.d("SubmitEventActivity", "Error is empty");
                            }
                        } else {
                            Log.d("SubmitEventActivity", "Error not null");
                        }
                        showProgress(false);
                    }
                });
        return (ArrayList<EventUtils>) evList;
    }

    public void pickDate(View v) {

    }

    private void showDatePickerDialog() {
        DatePickerDialog datePickerDialog = new DatePickerDialog(this, this,
                Calendar.getInstance().get(Calendar.YEAR),
                Calendar.getInstance().get(Calendar.MONTH),
                Calendar.getInstance().get(Calendar.DAY_OF_MONTH));
        datePickerDialog.show();
    }

    private void attemptSubmission() {
        if (!mSubmitButton.isEnabled()) {
            return;
        }

        // Reset errors.
        mDateView.setError(null);
        mDescView.setError(null);

        /* Store values at the time of the login attempt.
        String id = mIDView.getText().toString();
        String password = mPasswordView.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check for a valid password, if the user entered one.
        if (!TextUtils.isEmpty(password) &&
                !isPasswordValid(password)) {
            mPasswordView.setError(
                    getString(R.string.error_invalid_password));
            focusView = mPasswordView;
            cancel = true;
        }

        // Check for a valid email address.
        if (TextUtils.isEmpty(id)) {
            mIDView.setError(
                    getString(R.string.error_invalid_id));
            focusView = mIDView;
            cancel = true;
        } else if (!isIDValid(id)) {
            mIDView.setError(
                    getString(R.string.error_invalid_id));
            focusView = mIDView;
            cancel = true;
        }

        if (cancel) {
            focusView.requestFocus();
        } else {
            showProgress(true);
            JsonObject jsonReq = new JsonObject();
            jsonReq.addProperty("id", mIDView.getText().toString());
            jsonReq.addProperty("fname", mFNameView.getText().toString());

            Ion.with(this)
                    .load("POST", "http://10.0.0.89:3001/user/signup")
                    .setJsonObjectBody(jsonReq)
                    .asString()
                    .setCallback(new FutureCallback<String>() {
                        @Override
                        public void onCompleted(Exception e, String result) {
                            if (e == null) {
                                JSONObject o = new JSONObject();
                                try {
                                    o = new JSONObject(result);
                                } catch (JSONException ex) {
                                    //e.printStackTrace();
                                }
                                String error = o.optString("error");

                                if (TextUtils.isEmpty(error)) {
                                    Intent i = new Intent(SubmitEventActivity.this, LoginActivity.class);
                                    startActivity(i);
                                } else {
                                    //Show error
                                    Snackbar.make(mIDView,
                                            error,
                                            Snackbar.LENGTH_SHORT)
                                            .show();
                                }
                            } else {
                                Snackbar.make(mIDView,
                                        "ERROR",
                                        Snackbar.LENGTH_SHORT)
                                        .show();
                            }
                            showProgress(false);
                        }
                    });
        }*/
    }

    private boolean isIDValid(String id) {
        return id.length() == 8;
    }

    private boolean isPasswordValid(String password) {
        return password.length() > 4;
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

    @Override
    public void onDateSet(DatePicker view, int year, int month, int dayOfMonth) {
        // Set text of textview to this date
    }
}
