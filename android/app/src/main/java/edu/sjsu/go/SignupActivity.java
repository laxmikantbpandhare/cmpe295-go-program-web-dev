package edu.sjsu.go;

import androidx.appcompat.app.AppCompatActivity;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
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

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class SignupActivity extends AppCompatActivity {

    private String TAG_ACTIVITY = "SignupActivity";

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
    private String imageURL;
    private int CAMERA_REQUEST = 0;

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

    public void attachSJSUId(View v) {

        // Create a new Intent to open the picture selector:
        Intent loadPicture = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);

        // To start it, run the startActivityForResult() method:
        startActivityForResult(loadPicture, CAMERA_REQUEST);
        //imageURL = "https://twitter-prototype-project.s3.us-west-1.amazonaws.com/sjsu_go%3A1590134760619.png";
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(TAG_ACTIVITY, "onActivityResult " + resultCode);

        Uri selectedImageUri = data.getData();
        imageURL = getRealPathFromURI(selectedImageUri);
        Log.d(TAG_ACTIVITY, "onActivityResult " + imageURL);

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

        // Start an AsyncTask to upload the image
        final AsyncTask<Void, Void, Void> mTask = new SignupActivity.ImageUploadTask();
        mTask.execute();

        showProgress(true);
    }


        /*if (cancel) {
            focusView.requestFocus();
        } else {
            showProgress(true);*/

        public void postSignUpForm() throws JSONException {

            JsonObject jsonReq = new JsonObject();
            jsonReq.addProperty("id", mIDView.getText().toString());
            jsonReq.addProperty("fname", mFNameView.getText().toString());
            jsonReq.addProperty("lname", mLNameView.getText().toString());
            jsonReq.addProperty("email", mEmailView.getText().toString());
            jsonReq.addProperty("password", mPasswordView.getText().toString());
            jsonReq.addProperty("major", mMajorView.getText().toString());
            jsonReq.addProperty("year", mYearView.getText().toString());
            jsonReq.addProperty("imageName", imageURL);

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

private class ImageUploadTask extends AsyncTask<Void, Void, Void>
{

    @Override
    protected void onPostExecute(Void result) {
        // Post event after image upload is complete
        try {
            postSignUpForm();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected Void doInBackground(Void... params) {
        evImageUpload();
        return null;
    }
}

    public void evImageUpload() {
        HttpURLConnection connection = null;
        DataOutputStream outputStream = null;
        InputStream inputStream = null;

        String twoHyphens = "--";
        String boundary = "*****" + Long.toString(System.currentTimeMillis()) + "*****";
        String lineEnd = "\r\n";
        String filefield = "image";
        String fileMimeType = "image/jpg";

        String result = "";

        int bytesRead, bytesAvailable, bufferSize;
        byte[] buffer;
        int maxBufferSize = 1 * 1024 * 1024;

        String[] q = imageURL.split("/");
        int idx = q.length - 1;

        try {
            File file = new File(imageURL);
            FileInputStream fileInputStream = new FileInputStream(file);

            URL url = new URL(ConstantUtils.DOMAIN_URL + "upload/sjsuIdImage");
            connection = (HttpURLConnection) url.openConnection();

            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setUseCaches(false);

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("User-Agent", "Android Multipart HTTP Client 1.0");
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            outputStream = new DataOutputStream(connection.getOutputStream());
            outputStream.writeBytes(twoHyphens + boundary + lineEnd);
            outputStream.writeBytes("Content-Disposition: form-data; name=\"" + filefield + "\"; filename=\"" + q[idx] + "\"" + lineEnd);
            outputStream.writeBytes("Content-Type: " + fileMimeType + lineEnd);
            outputStream.writeBytes("Content-Transfer-Encoding: binary" + lineEnd);

            outputStream.writeBytes(lineEnd);

            bytesAvailable = fileInputStream.available();
            bufferSize = Math.min(bytesAvailable, maxBufferSize);
            buffer = new byte[bufferSize];

            bytesRead = fileInputStream.read(buffer, 0, bufferSize);
            while (bytesRead > 0) {
                outputStream.write(buffer, 0, bufferSize);
                bytesAvailable = fileInputStream.available();
                bufferSize = Math.min(bytesAvailable, maxBufferSize);
                bytesRead = fileInputStream.read(buffer, 0, bufferSize);
            }

            outputStream.writeBytes(lineEnd);

            // Upload POST Data.

            outputStream.writeBytes(twoHyphens + boundary + lineEnd);
            outputStream.writeBytes("Content-Disposition: form-data; name=\"id\"" + lineEnd);
            outputStream.writeBytes("Content-Type: text/plain" + lineEnd);
            outputStream.writeBytes(lineEnd);
            outputStream.writeBytes(mIDView.getText().toString());
            outputStream.writeBytes(lineEnd);

            Log.d(TAG_ACTIVITY, "Sending image for " + mIDView.getText().toString());

            outputStream.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);

            if (200 != connection.getResponseCode()) {
                Log.e(TAG_ACTIVITY, "Failed to upload code:" + connection.getResponseCode() + " " + connection.getResponseMessage());
            }

            inputStream = connection.getInputStream();

            result = this.convertStreamToString(inputStream);
            Log.d(TAG_ACTIVITY, "Response to image upload " + result);

            JSONObject obj = new JSONObject(result);
            imageURL = obj.getString("imageName");
            Log.d(TAG_ACTIVITY, "Uploaded image url is " + imageURL);

            fileInputStream.close();
            inputStream.close();
            outputStream.flush();
            outputStream.close();

            return ;
        } catch (Exception e) {
            Log.e(TAG_ACTIVITY, "Exception " + e.toString());
        }

    }

    private String convertStreamToString(InputStream is) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();

        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
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
