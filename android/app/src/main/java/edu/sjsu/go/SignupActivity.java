package edu.sjsu.go;

import androidx.appcompat.app.AppCompatActivity;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

import com.google.android.material.snackbar.Snackbar;
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

import org.json.JSONException;
import org.json.JSONObject;

public class SignupActivity extends AppCompatActivity {

    private EditText mIDView;
    private EditText mFNameView;
    private EditText mLNameView;
    private EditText mEmailView;
    private EditText mPasswordView;
    private EditText mMajorView;
    private EditText mYearView;
    private View mProgressView;
    private View mSignupFormView;
    private Button mSignUpButton;
    private Spinner mMajorSpinner;
    private Spinner mYearSpinner;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        mIDView = findViewById(R.id.sjsuId);
        mFNameView = findViewById(R.id.firstname);
        mLNameView = findViewById(R.id.lastname);
        mEmailView = findViewById(R.id.emailId);
        mPasswordView = findViewById(R.id.password);
        mMajorView = findViewById(R.id.major);
        mYearView = findViewById(R.id.year);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.majors, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        mSignUpButton = (Button)
                findViewById(R.id.sign_up_button);
        mSignUpButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        attemptSignup();
                    }
                });

        mSignupFormView = findViewById(R.id.signup_form);
        mProgressView = findViewById(R.id.signup_progress);

    }

    private void attemptSignup() {
        if (!mSignUpButton.isEnabled()) {
            return;
        }

        // Reset errors.
        mIDView.setError(null);
        mPasswordView.setError(null);

        // Store values at the time of the login attempt.
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
            jsonReq.addProperty("lname", mLNameView.getText().toString());
            jsonReq.addProperty("email", mEmailView.getText().toString());
            jsonReq.addProperty("password", mPasswordView.getText().toString());
            jsonReq.addProperty("major", mMajorView.getText().toString());
            jsonReq.addProperty("year", mYearView.getText().toString());

            Ion.with(this)
                    .load("POST", ConstantUtils.DOMAIN_URL + "user/signup")
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
                                    Intent i = new Intent(SignupActivity.this, LoginActivity.class);
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
        }
    }

    private boolean isIDValid(String id) {
        return id.length() == 9;
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

            mSignupFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mSignupFormView
                    .animate()
                    .setDuration(shortAnimTime)
                    .alpha(show ? 0 : 1)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            mSignupFormView.setVisibility(show ? View.GONE : View.VISIBLE);
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
            mSignupFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }
}
