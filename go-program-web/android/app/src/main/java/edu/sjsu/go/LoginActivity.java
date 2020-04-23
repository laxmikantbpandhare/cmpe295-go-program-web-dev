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
import android.widget.Button;
import android.widget.EditText;

import com.google.android.material.snackbar.Snackbar;
import com.google.gson.JsonObject;
import com.koushikdutta.async.future.FutureCallback;
import com.koushikdutta.ion.Ion;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {
    // UI references.
    private EditText mIDView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;
    private Button mSignInButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Set up the login form.
        mIDView = findViewById(R.id.sjsuId);

        mPasswordView = (EditText) findViewById(R.id.password);
        /*mPasswordView.setOnEditorActionListener(
                new TextView.OnEditorActionListener() {
                    @Override
                    public boolean onEditorAction(TextView textView,
                                                  int id, KeyEvent keyEvent) {
                        if (id == R.id.login || id == EditorInfo.IME_NULL) {
                            attemptLogin();
                            return true;
                        }
                        return false;
                    }
                });*/

        mSignInButton = (Button)
                findViewById(R.id.sign_in_button);
        mSignInButton.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        attemptLogin();
                    }
                });

        mLoginFormView = findViewById(R.id.login_form);
        mProgressView = findViewById(R.id.login_progress);
    }

    private void attemptLogin() {
        if (!mSignInButton.isEnabled()) {
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
            jsonReq.addProperty("password", mPasswordView.getText().toString());

            Ion.with(this)
                    .load("POST", "http://10.0.0.89:3001/user/login")
                    .setJsonObjectBody(jsonReq)
                    .asString()
                    .setCallback(new FutureCallback<String>() {
                        @Override
                        public void onCompleted(Exception e, String result) {
                            Log.d("LoginActivity", "Result " + result);
                            if (e == null) {
                                JSONObject o = new JSONObject();
                                JSONObject u = new JSONObject();
                                try {
                                    o = new JSONObject(result);
                                    u = o.getJSONObject("user");
                                } catch (JSONException ex) {
                                    e.printStackTrace();
                                }
                                String error = o.optString("error");
                                String token = o.optString("token");

                                Log.d("LoginActivity", error);
                                if (TextUtils.isEmpty(error)) {
                                    Log.d("LoginActivity", token);
                                    Log.d("LoginActivity", u.toString());
                                    PreferencesUtils.saveAuthToken(token, LoginActivity.this);
                                    PreferencesUtils.saveUserData(u, LoginActivity.this);

                                    Intent i = new Intent(LoginActivity.this, WebActivity.class);
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

            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mLoginFormView
                    .animate()
                    .setDuration(shortAnimTime)
                    .alpha(show ? 0 : 1)
                    .setListener(new AnimatorListenerAdapter() {
                        @Override
                        public void onAnimationEnd(Animator animation) {
                            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
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
            mLoginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }
}
