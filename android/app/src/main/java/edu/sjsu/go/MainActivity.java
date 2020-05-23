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

    public void clickLogin(View v) {
        Intent i = new Intent(this, LoginActivity.class);
        startActivity(i);
    }

    public void clickSignup(View v) {
        Intent i = new Intent(this, SignupActivity.class);
        startActivity(i);
    }
}
