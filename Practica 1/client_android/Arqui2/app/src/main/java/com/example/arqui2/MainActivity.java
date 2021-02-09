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
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

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
               login("agregaremos url");
           }
       });

    }
    public void login(String url){
    Intent intent=new Intent(MainActivity.this,BluetoohConecta.class);
    startActivity(intent);
    //Codigo para conectarse a la api y realizar el inicio de sesion
        /*Map<String,String> parametros=new HashMap<String,String>();
    parametros.put("email",txtusername.getText().toString());
    parametros.put("password",txtpassword.getText().toString());

        JSONObject objeto=new JSONObject(parametros);

        JsonObjectRequest respuesta=new JsonObjectRequest(Request.Method.POST, url, objeto, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                //Agregaremos esto para ver el mensaje de retorno
                Toast.makeText(getApplicationContext(),response.toString(),Toast.LENGTH_SHORT).show();
                //Toast.makeText(getApplicationContext(), "Registro exitoso", Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(getApplicationContext(),error.toString(),Toast.LENGTH_SHORT).show();
            }
        }
        );
       requestQueue=Volley.newRequestQueue(this);
       requestQueue.add(respuesta);*/
    }

}