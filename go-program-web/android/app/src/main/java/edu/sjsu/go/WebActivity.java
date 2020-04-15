/* Dummy Activity for testing */

package edu.sjsu.go;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class WebActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);

        WebView w = (WebView) findViewById(R.id.wV);
        w.getSettings().setJavaScriptEnabled(true);
        w.loadUrl("http://3.87.55.24:3000/#/login");

        WebSettings settings = w.getSettings();
        settings.setDomStorageEnabled(true);
    }


}
