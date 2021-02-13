package com.example.arqui2;

import androidx.appcompat.app.AppCompatActivity;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
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
import java.nio.ByteBuffer; 
import java.nio.ByteOrder; 

public class ConectionApi extends AppCompatActivity {
    //variables de la interfaz
    Button IdDesconectar;
    TextView IdBufferIn; //texto donde se visualizaran los valores que se mandaran a la api
    //Variables que se mandaran a la api
    private String temperatura=" ";
    private String ritmoCardiaco=" ";
    private String oxigenoSangre=" ";

    //---------------Variables comunicacion. bluetooh----------------------------
    Handler bluetoothIn;
    final int handlerState = 0;
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

    private ArrayList<Byte> byteBuffer = new ArrayList<Byte>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_conection_api);
        /**
         * Inicializar las variables definidos en la interfaz
         */
         IdDesconectar=(Button)findViewById(R.id.IdDesconectar);
         IdBufferIn=(TextView)findViewById(R.id.IdBufferIn);

        /**
         *Comunicacion de bluetooh con arduino para leer los datos que se mandaran desde arduino
         *
         */
        bluetoothIn = new Handler() {
            public void handleMessage(android.os.Message msg) {
                if (msg.what == handlerState) {
                    // Segun un men en StackOverflow: 'There is no guarantee or 
                    // attempt to preserve packetization. So any number of writes 
                    // can result in any number of reads, just the stream of bytes 
                    // are guaranteed to be correct.'
                    // Lo que quiere decir que hay dos problemas que pueden 
                    // ocurrir:
                    // * Cuando hagamos un read desde el celular no estan los 12
                    //   bytes necesarios para sacar una medicion congruente.
                    // * Desconectamos el arduino justo cuando esta mandando el 
                    //   mensaje.

                    // Entonces:
                    // vamos a tener un buffer de bytes (lo vamos a llamar `byteBuffer`), 
                    // en el que vamos a meter todos los bytes que recibimos, 
                    // cuando recivamos al menos 12 bytes, vamos a construir los 
                    // floats con esos bytes y los vamos a sacar de buffer. Esto solucionara el primer
                    // problema
                    // Es muuuuy dificil que se de el seguno problema, pero creo
                    // que la solucion es muy simple,  solo es de vaciar el `byteBuffer`
                    // si perdemos la coneccion con el modulo solo es de vaciar
                    // el mensaje incompleto que quedo en el buffer. No se si hay
                    // un evento/callback/funcion o algo asi que se ejecute cuando
                    // suceda eso?

                    byteBuffer.addAll(Arrays.asList((Byte[]) msg.obj));

                    if(byteBuffer.size() >= 12){
                        byte[] bytesTemperaturaMedida = {byteBuffer.get(0), byteBuffer.get(1), byteBuffer.get(2), byteBuffer.get(3)}; 
                        byte[] byteRitmoCardiaco = {byteBuffer.get(4), byteBuffer.get(5), byteBuffer.get(6), byteBuffer.get(7)}; 
                        byte[] byteOxigeno = {byteBuffer.get(8), byteBuffer.get(9), byteBuffer.get(10), byteBuffer.get(11)}; 

                        float floatTemperaturaMedida = ByteBuffer.wrap(bytesTemperaturaMedida).order(ByteOrder.LITTLE_ENDIAN).getFloat();
                        float floatRitmoCardiaco = ByteBuffer.wrap(byteRitmoCardiaco).order(ByteOrder.LITTLE_ENDIAN).getFloat();
                        float floatOxigeno = ByteBuffer.wrap(byteOxigeno).order(ByteOrder.LITTLE_ENDIAN).getFloat();

                        // @TODO:
                        // De una se van todos al servidor

                        temperatura = Float.toString(floatTemperaturaMedida);
                        ritmoCardiaco = Float.toString(floatTemperaturaMedida);
                        oxigenoSangre = Float.toString(floatTemperaturaMedida);
                        //los datos obtenidos se enviaran al servidor
                        insercionMediciones("https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors");
                        // Quitamos los 12 bytes que ya leimos
                        byteBuffer = (ArrayList<Byte>) byteBuffer.subList(0, 12);
                    }

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
                Toast.makeText(getApplicationContext(),error.toString(),Toast.LENGTH_SHORT).show();
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
                    bytes = mmInStream.read(buffer);
                    String readMessage = new String(buffer, 0, bytes);
                    // Envia los datos obtenidos hacia el evento via handler
                    bluetoothIn.obtainMessage(handlerState, bytes, -1, readMessage).sendToTarget();
                } catch (IOException e) {
                    break;
                }
            }
        }
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