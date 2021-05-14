package com.example.arqui2;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
     private EditText txtusername,txtpassword;
    private TextView btnLogin;
    public static String ideUser=""; //Identifcador del  usuario que se conectara (inicio de seseion)
    //variable para conexion con api y realizar login
    RequestQueue requestQueue;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //Inicializamos las variables
       txtusername=(EditText)findViewById(R.id.username);
       txtpassword=(EditText)findViewById(R.id.password);

       btnLogin=(TextView)findViewById(R.id.btnLogin);

       btnLogin.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View view) {
               login("https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/login/"+txtusername.getText()+"/"+txtpassword.getText());
           }
       });

    }
    public void login(String url){
   // Intent intent=new Intent(MainActivity.this,BluetoohConecta.class);
    //startActivity(intent);
    //Codigo para conectarse a la api y realizar el inicio de sesion
        JsonArrayRequest respuesta=new JsonArrayRequest(url, new Response.Listener<JSONArray>() {
            @Override
            public void onResponse(JSONArray response) {
                //response.getJSONArray(); para objetos en array
                JSONObject jsonObject = null;
                for (int i = 0; i < response.length(); i++) {
                    try {
                        jsonObject = response.getJSONObject(i);

                        ideUser=jsonObject.getString("IdUser");
                        Intent intent=new Intent(MainActivity.this,BluetoohConecta.class);
                        startActivity(intent);
                    } catch (JSONException e) {
                        Toast.makeText(getApplicationContext(), e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
              if(error.networkResponse !=null){
                  try {
                      byte[] errorByte= error.networkResponse.data;
                      String parseError=errorByte.toString();
                      JSONObject errorObject=new JSONObject(parseError);
                      String errorMessage=errorObject.getString("message");
                      Toast.makeText(getApplicationContext(),errorMessage,Toast.LENGTH_SHORT).show();
                  } catch (JSONException e) {
                      e.printStackTrace();
                  }
              }
              else{
                  Toast.makeText(getApplicationContext(),"Contraseña y/o usuario incorrecto",Toast.LENGTH_SHORT).show();
              }

            }
        });




       requestQueue=Volley.newRequestQueue(this);
       requestQueue.add(respuesta);
    }

}