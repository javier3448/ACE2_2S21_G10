package com.example.arqui2;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
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

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
     private EditText txtusername,txtpassword,txtPeso;
    private TextView btnLogin;
    private ListView lv;

    public static String ideUser=""; //Identifcador del  usuario que se conectara (inicio de seseion)
    public static  String pesoUsers="";

    private int bandera=0;
    //variable para conexion con api y realizar login
    RequestQueue requestQueue;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //Inicializamos las variables
       txtusername=(EditText)findViewById(R.id.username);
       txtpassword=(EditText)findViewById(R.id.password);
       txtPeso=(EditText)findViewById(R.id.txtPeso);
       lv=(ListView)findViewById(R.id.lv);

        // Initializing a new String Array
        String[] unitpeso = new String[] {
                "kg",
                "lb"
        };
        // Create a List from String Array elements
        final List<String> listUnit = new ArrayList<>(Arrays.asList(unitpeso));

        // Create an ArrayAdapter from List
        final ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>
                (this, android.R.layout.simple_list_item_1, listUnit);

        // DataBind ListView with items from ArrayAdapter
        lv.setAdapter(arrayAdapter);

       btnLogin=(TextView)findViewById(R.id.btnLogin);

       btnLogin.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View view) {
                if(bandera==0){
                    Toast.makeText(getApplicationContext(), "Seleccione unidad de peso", Toast.LENGTH_LONG).show();
                }else{
                    //Toast.makeText(getApplicationContext(), "Bienvenido", Toast.LENGTH_LONG).show();
                    login("https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/login/"+txtusername.getText()+"/"+txtpassword.getText());
                }

           }
       });
        lv.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                String s = lv.getItemAtPosition(i).toString();
                if(!txtPeso.getText().toString().equals("")){
                if(s.equals("kg")){
                    bandera=1;
                    double pesoaux=Double.parseDouble(txtPeso.getText().toString());
                    pesoUsers=String.valueOf(pesoaux);//String.valueOf(Math.round(pesoaux));
                    Toast.makeText(getApplicationContext(),"kilogramos: "+pesoUsers,Toast.LENGTH_SHORT).show();
                }else if(s.equals("lb")){
                    bandera=1;
                    double pesokg=Double.parseDouble(txtPeso.getText().toString())*0.45;
                    double formattedNumber = Double.parseDouble(new DecimalFormat("#.##").format(pesokg));
                    pesoUsers=String.valueOf(formattedNumber);//String.valueOf(Math.round(pesokg));

                    Toast.makeText(getApplicationContext(), "en kilogramos: "+pesoUsers, Toast.LENGTH_SHORT).show();
                }
                }else{
                    bandera=0;
                    Toast.makeText(getApplicationContext(),"Ingrese su peso en el campo requerido",Toast.LENGTH_SHORT).show();
                }
            }
        });

    }
    public void login(String url){
       /* pesoUsers=txtPeso.getText().toString();
        Toast.makeText(getApplicationContext(), pesoUsers, Toast.LENGTH_SHORT).show();
    Intent intent=new Intent(MainActivity.this,BluetoohConecta.class);
    startActivity(intent);*/

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
                      //  Toast.makeText(getApplicationContext(),"data: "+ideUser,Toast.LENGTH_SHORT).show();
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
     //getList
     private void getDataList(){

     }

}