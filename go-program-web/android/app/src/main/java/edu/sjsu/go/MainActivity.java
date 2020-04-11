/* Landing page */

package edu.sjsu.go;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /* Dummy method for testing */
    public void clickLogin(View v) {
        Intent i = new Intent(this, WebActivity.class);
        startActivity(i);
    }
}
