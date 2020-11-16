package edu.sjsu.go;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.database.Cursor;
import android.icu.text.SimpleDateFormat;
import android.net.Uri;
import android.os.AsyncTask;
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

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
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
        //imageURL = "https://twitter-prototype-project.s3.us-west-1.amazonaws.com/sjsu_go%3A1590134760619.png";
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(TAG_ACTIVITY, "onActivityResult " + resultCode);

        Uri selectedImageUri = data.getData();
        imageURL = getRealPathFromURI(selectedImageUri);
        Log.d(TAG_ACTIVITY, imageURL);

        /*showProgress(true);
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

        // Start ann AsyncTask to upload the image
        final AsyncTask<Void, Void, Void> mTask = new ImageUploadTask();
        mTask.execute();

        showProgress(true);
    }

    private class ImageUploadTask extends AsyncTask<Void, Void, Void>
    {

        @Override
        protected void onPostExecute(Void result) {
            // Post event after image upload is complete
            try {
                postEvent();
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

    private void uploadImage() {
        // Upload image and then call post event

        String fileName = imageURL;
        HttpURLConnection conn = null;
        DataOutputStream dos = null;
        String lineEnd = "\r\n";
        String twoHyphens = "--";
        String boundary = "------sjsuGO";
        int bytesRead, bytesAvailable, bufferSize;
        byte[] buffer;
        int maxBufferSize = 1 * 1024 * 1024;
        int serverResponseCode;
        File sourceFile = new File(fileName);
        Log.v(TAG_ACTIVITY, "Uploading: sourcefileURI, " + fileName);

        if (!sourceFile.isFile()) {
            Log.e(TAG_ACTIVITY, "Source File not exist");//FullPath);
            runOnUiThread(new Runnable() {
                public void run() {
                    //messageText.setText("Source File not exist :"
                }
            });
            return;  //RETURN #1
        }
        else{
            try{

                FileInputStream fileInputStream = new FileInputStream(sourceFile);
                URL url = new URL(ConstantUtils.DOMAIN_URL + "upload/images");
                Log.v(TAG_ACTIVITY,url.toString());

                // Open a HTTP  connection to  the URL
                conn = (HttpURLConnection) url.openConnection();
                conn.setDoInput(true); // Allow Inputs
                conn.setDoOutput(true); // Allow Outputs
                conn.setUseCaches(false); // Don't use a Cached Copy            s
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this));
                conn.setRequestProperty("Connection", "Keep-Alive");
                conn.setRequestProperty("ENCTYPE", "multipart/form-data");
                conn.setRequestProperty("Content-Type", "multipart/form-data;boundary=" + boundary);
                conn.setRequestProperty("file", fileName);

                dos = new DataOutputStream(conn.getOutputStream());
                dos.writeBytes(twoHyphens + boundary + lineEnd);
                dos.writeBytes("Content-Disposition: form-data; name=\"file\";filename=\"" + fileName + "\"" + lineEnd);
                dos.writeBytes(lineEnd);

                // create a buffer of  maximum size
                bytesAvailable = fileInputStream.available();
                bufferSize = Math.min(bytesAvailable, maxBufferSize);
                buffer = new byte[bufferSize];
                // read file and write it into form...
                bytesRead = fileInputStream.read(buffer, 0, bufferSize);

                while (bytesRead > 0) {
                    dos.write(buffer, 0, bufferSize);
                    bytesAvailable = fileInputStream.available();
                    bufferSize = Math.min(bytesAvailable, maxBufferSize);
                    bytesRead = fileInputStream.read(buffer, 0, bufferSize);
                    Log.i(TAG_ACTIVITY,"->");
                }

                // send multipart form data necesssary after file data...
                dos.writeBytes(lineEnd);
                dos.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);

                // Responses from the server (code and message)
                serverResponseCode = conn.getResponseCode();
                String serverResponseMessage = conn.getResponseMessage().toString();
                Log.i(TAG_ACTIVITY, "HTTP Response is : "  + serverResponseMessage + ": " + serverResponseCode);

                // ------------------ read the SERVER RESPONSE
                DataInputStream inStream;
                try {
                    inStream = new DataInputStream(conn.getInputStream());
                    String str;
                    while ((str = inStream.readLine()) != null) {
                        Log.e(TAG_ACTIVITY, "SOF Server Response" + str);
                    }
                    inStream.close();
                }
                catch (IOException ioex) {
                    Log.e(TAG_ACTIVITY, "SOF error: " + ioex.getMessage(), ioex);
                }

                //close the streams //
                fileInputStream.close();
                dos.flush();
                dos.close();

                if(serverResponseCode == 200){
                    //Do something
                }//END IF Response code 200

            }//END TRY - FILE READ
            catch (MalformedURLException ex) {
                ex.printStackTrace();
                Log.e(TAG_ACTIVITY, "UL error: " + ex.getMessage(), ex);
            } //CATCH - URL Exception

            catch (Exception e) {
                e.printStackTrace();
                Log.e(TAG_ACTIVITY, "Exception : "+ e.getMessage(), e);
            } //

            return; //after try
        }//END ELSE, if file exists.

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

            URL url = new URL(ConstantUtils.DOMAIN_URL + "upload/images");
            connection = (HttpURLConnection) url.openConnection();

            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setUseCaches(false);

            connection.setRequestMethod("POST");
            connection.setRequestProperty("Connection", "Keep-Alive");
            connection.setRequestProperty("User-Agent", "Android Multipart HTTP Client 1.0");
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            connection.setRequestProperty("Authorization", "Bearer " + PreferencesUtils.getAuthToken(this));

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

            /* Upload POST Data
            //Iterator<String> keys = parmas.keySet().iterator();
            while (keys.hasNext()) {
                //String key = keys.next();
                //String value = parmas.get(key);

                outputStream.writeBytes(twoHyphens + boundary + lineEnd);
                outputStream.writeBytes("Content-Disposition: form-data; name=\"" + key + "\"" + lineEnd);
                outputStream.writeBytes("Content-Type: text/plain" + lineEnd);
                outputStream.writeBytes(lineEnd);
                outputStream.writeBytes(value);
                outputStream.writeBytes(lineEnd);
            }*/

            outputStream.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd);

            if (200 != connection.getResponseCode()) {
               Log.e(TAG_ACTIVITY, "Failed to upload code:" + connection.getResponseCode() + " " + connection.getResponseMessage());
            }

            inputStream = connection.getInputStream();

            result = this.convertStreamToString(inputStream);
            Log.d(TAG_ACTIVITY, "Response to image upload " + result);

            JSONObject obj = new JSONObject(result);
            imageURL = obj.getJSONArray("imagesName").getString(0);
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

    public void postEvent() throws JSONException {

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