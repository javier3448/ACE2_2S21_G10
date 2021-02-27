package com.example.arqui2;

import androidx.appcompat.app.AppCompatActivity;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;
import org.w3c.dom.Text;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import java.util.ArrayList;
import java.util.Arrays;
import java.nio.ByteBuffer; 
import java.nio.ByteOrder; 

public class ConectionApi extends AppCompatActivity {
    //variables de la interfaz
    Button IdDesconectar;
    TextView IdBufferIn; //texto donde se visualizaran los valores que se mandaran a la api
    //Variables que se mandaran a la api
    // [?]: No seria mejor pasar estos 3 strings a la funcion `insercionMediciones` por parametro?
    private String temperatura=" ";
    private String ritmoCardiaco=" ";
    private String oxigenoSangre=" ";

    //---------------Variables comunicacion. bluetooh----------------------------
    Handler bluetoothIn;
    public static final int handlerState = 0;
    private BluetoothAdapter btAdapter = null;
    private BluetoothSocket btSocket = null;
    private StringBuilder DataStringIN = new StringBuilder();
    private ConnectedThread MyConexionBT;
    // Identificador unico de servicio - SPP UUID
    private static final UUID BTMODULEUUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    // String para la direccion MAC
    private static String address = null;
    //variables de comunicacion con api para mandar informacion
    RequestQueue requestQueue;

    private class Medicion {
        public double temperatura;
        public double ritmoCardiaco;
        public double oxigeno;

        public Medicion(double temperatura, double ritmoCardiaco,  double oxigeno){
            this.temperatura = temperatura;
            this.ritmoCardiaco = ritmoCardiaco;
            this.oxigeno = oxigeno;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_conection_api);
        /**
         * Inicializar las variables definidos en la interfaz
         */
         IdDesconectar=(Button)findViewById(R.id.IdDesconectar);
         IdBufferIn=(TextView)findViewById(R.id.IdBufferIn);


        bluetoothIn = new Handler() {
            public void handleMessage(android.os.Message msg) {
                if (msg.what == handlerState) {

                    Medicion medicion = (Medicion) msg.obj;

                    // @debug
                    System.out.println("Desde handleMessage:");
                    System.out.println("temperatura" + medicion.temperatura);
                    System.out.println("ritmoCardiaco" + medicion.ritmoCardiaco);
                    System.out.println("oxigeno" + medicion.oxigeno);

                    temperatura = Double.toString(medicion.temperatura);
                    ritmoCardiaco = Double.toString(medicion.ritmoCardiaco);
                    oxigenoSangre = Double.toString(medicion.oxigeno);
                    //setear los valores para visualizarl los datos que se mandaran a la api
                    IdBufferIn.setText("Temp: "+temperatura+" ritmo: "+ritmoCardiaco+" oxigeno: "+oxigenoSangre);
                    //los datos obtenidos se enviaran al servidor
                    insercionMediciones("https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors");

                }
            }
        };
        //configuracion de mantener conexion a bluetooh
        btAdapter = BluetoothAdapter.getDefaultAdapter(); // get Bluetooth adapter
        VerificarEstadoBT();


        IdDesconectar.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                if (btSocket!=null)
                {
                    try {btSocket.close();}
                    catch (IOException e)
                    { Toast.makeText(getBaseContext(), "Error", Toast.LENGTH_SHORT).show();;}
                }
                finish();
            }
        });

    }
    /**
     *
     * -------------------COMUNICACON DE LOS DATOS A LA API----------------------------------------
     *
     */
      public void insercionMediciones(String url){
          Map<String,String> parametros=new HashMap<String,String>();
          parametros.put("temperatura",temperatura);
          parametros.put("ritmo",ritmoCardiaco);
          parametros.put("oxigeno",oxigenoSangre);
          parametros.put("idUser",MainActivity.ideUser);
          JSONObject objeto=new JSONObject(parametros);

          JsonObjectRequest respuesta=new JsonObjectRequest(Request.Method.POST, url, objeto, new Response.Listener<JSONObject>() {
              @Override
              public void onResponse(JSONObject response) {
                  Toast.makeText(getApplicationContext(), "Registro exitoso de mediciones", Toast.LENGTH_SHORT).show();
              }
          }, new Response.ErrorListener() {
              @Override
              public void onErrorResponse(VolleyError error) {
                //  Toast.makeText(getApplicationContext(),String.valueOf(error.getSuppressed()),Toast.LENGTH_SHORT).show();
              }
          }
          );
          requestQueue= Volley.newRequestQueue(this);
          requestQueue.add(respuesta);

      }


    /***********************************************************************************************
     *
     *              metodos para conexion bluetooh
     *
     * *********************************************************************************************
     */
    private BluetoothSocket createBluetoothSocket(BluetoothDevice device) throws IOException
    {
        //crea un conexion de salida segura para el dispositivo
        //usando el servicio UUID
        return device.createRfcommSocketToServiceRecord(BTMODULEUUID);
    }

    @Override
    public void onResume()
    {
        super.onResume();
        //Consigue la direccion MAC desde DeviceListActivity via intent
         Intent intent = getIntent();
        //Consigue la direccion MAC desde DeviceListActivity via EXTRA
        address = intent.getStringExtra(BluetoohConecta.EXTRA_DEVICE_ADDRESS);//<-<- PARTE A MODIFICAR >->->
        //address=BluetoohConecta.address;
        //Setea la direccion MAC
        BluetoothDevice device = btAdapter.getRemoteDevice(address);

        try
        {
            btSocket = createBluetoothSocket(device);
        } catch (IOException e) {
            Toast.makeText(getBaseContext(), "La creacción del Socket fallo", Toast.LENGTH_LONG).show();
        }
        // Establece la conexión con el socket Bluetooth.
        try
        {
            btSocket.connect();
        } catch (IOException e) {
            try {
                btSocket.close();
            } catch (IOException e2) {}
        }
        MyConexionBT = new ConnectedThread(btSocket);
        MyConexionBT.start();
    }

    @Override
    public void onPause()
    {
        super.onPause();
        try
        { // Cuando se sale de la aplicación esta parte permite
            // que no se deje abierto el socket
            btSocket.close();
        } catch (IOException e2) {}
    }

    //Comprueba que el dispositivo Bluetooth Bluetooth está disponible y solicita que se active si está desactivado
    private void VerificarEstadoBT() {

        if(btAdapter==null) {
            Toast.makeText(getBaseContext(), "El dispositivo no soporta bluetooth", Toast.LENGTH_LONG).show();
        } else {
            if (btAdapter.isEnabled()) {
            } else {
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                startActivityForResult(enableBtIntent, 1);
            }
        }
    }



    /************************************************************************************************
     *
     *      Clase para crear vento de  conexion que recibira y enviara por medio de bluetooh
     *
     *
     * **********************************************************************************************
     */
    private class ConnectedThread extends Thread
    {
        private final InputStream mmInStream;
        private final OutputStream mmOutStream;

        public ConnectedThread(BluetoothSocket socket)
        {
            InputStream tmpIn = null;
            OutputStream tmpOut = null;
            try
            {
                tmpIn = socket.getInputStream();
                tmpOut = socket.getOutputStream();
            } catch (IOException e) { }
            mmInStream = tmpIn;
            mmOutStream = tmpOut;
        }

        public void run()
        {
            byte[] buffer = new byte[256];
            int bytes;

            // Se mantiene en modo escucha para determinar el ingreso de datos
            while (true) {
                try {
                    // Analiza el inputStream buscando este patron:
                    // '$' {numeroReal} | {numeroReal} | {numeroReal} ';'
                    // cada vez que encuentra dicho patron en via los numeros reales a un handler

                    outer: while(true){
                        byte currByte = getNextByteFromInStream();

                        if(currByte == (byte) '$'){
                            currByte = getNextByteFromInStream();
                            StringBuilder medicionesCrudas = new StringBuilder();
                            while (currByte != ';'){
                                // Armamos el string que hay desde: '$' hasta ';'
                                medicionesCrudas.append((char)currByte);
                                currByte = getNextByteFromInStream();

                                if(medicionesCrudas.length() > 100){
                                    System.err.println("'$' sin terminacion ';' :`" + medicionesCrudas.toString() + "`");

                                    //Print toast
                                    Toast.makeText(
                                            getApplicationContext(),
                                            "FATAL:\n '$' sin terminacion ';' :`" + medicionesCrudas.toString() + " `",
                                            Toast.LENGTH_LONG
                                    ).show();

                                    continue outer;
                                }
                            }

                            String[] medicionesSpliteadas = medicionesCrudas.toString().split("\\|");

                            // @debug:
                            System.out.println("Temperatura: " + medicionesSpliteadas[0]);
                            System.out.println("Ritmo cardiaco: " + medicionesSpliteadas[1]);
                            System.out.println("Oxigeno: " + medicionesSpliteadas[2]);

                            double temperatura =  Double.parseDouble(medicionesSpliteadas[0]);
                            double ritmoCardiaco =  Double.parseDouble(medicionesSpliteadas[1]);
                            double oxigeno =  Double.parseDouble(medicionesSpliteadas[2]);

                            bluetoothIn.obtainMessage(handlerState, -1, -1, new Medicion(temperatura, ritmoCardiaco, oxigeno)).sendToTarget();
                        }
                    }
                } catch (IOException e) {
                    break;
                }
            }
        }

        // Si queremos llevarnoslas de OOP y de java el estado la funcion getNextByteFromInStream
        // y su estado deberian estar en una Inner class :/
        // private final NextByteGetter nextByteGetter = new NextByteGetter();
        // private class NextByteGetter{
            byte[] readBuffer = new byte[256];
            int readBufferCurrentIndex = 0;
            int readBufferLength = 0;
            private byte getNextByteFromInStream() throws IOException{
                if(readBufferCurrentIndex >= readBufferLength){
                    readBufferLength = mmInStream.read(readBuffer);
                    readBufferCurrentIndex = 0;
                }

                byte result = readBuffer[readBufferCurrentIndex];
                readBufferCurrentIndex += 1;
                return result;
            }
        // }

        //Envio de trama
        public void write(String input)
        {
            try {
                mmOutStream.write(input.getBytes());
            }
            catch (IOException e)
            {
                //si no es posible enviar datos se cierra la conexión
                Toast.makeText(getBaseContext(), "La Conexión fallo", Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }
}