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
    Button IdDesconectar,btnEnvio;
    TextView IdBufferIn; //texto donde se visualizaran los valores que se mandaran a la api
    //Variables que se mandaran a la api
    // [?]: No seria mejor pasar estos 3 strings a la funcion `insercionMediciones` por parametro?
    private String temperatura=" ";
    private String ritmoCardiaco=" ";
    private String oxigenoSangre=" ";
    //Mediciones agregados para proyecto1
    private String repeticionAtleta=" ";
    private String velocidadAtleta=" ";
    private String distanciaAleta=" ";

    public String tiempoAtleta=" ";
    public String fallaAtleta=" ";
    public String rindioAtleta=" ";
    public String estadoAprobo=" ";
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
        //mediciones proyecto 1
        public int repeticion;
        public double velocidad;
        public double distancia;

        public double tiempo;

        // @TODO cambiar por un enum que indique: corriendo prueba, falla, exito, o rendicion
        public int falla;
        public int rindio;
        // 1 si Termino la prueba con exito
        public int aprobo;

        public Medicion(double temperatura, double ritmoCardiaco,  double oxigeno, int repeticion, double velocidad, double distancia, double tiempo, int falla, int rindio, int aprobo){
            this.temperatura = temperatura;
            this.ritmoCardiaco = ritmoCardiaco;
            this.oxigeno = oxigeno;
            this.repeticion=repeticion;
            this.velocidad=velocidad;
            this.distancia=distancia;

            this.tiempo=tiempo;
            this.falla=falla;
            this.rindio=rindio;
            this.aprobo=aprobo;
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
         btnEnvio=(Button)findViewById(R.id.btnEnvio);

         IdBufferIn=(TextView)findViewById(R.id.IdBufferIn);

         IdBufferIn.setText(MainActivity.pesoUsers);

        bluetoothIn = new Handler() {
            public void handleMessage(android.os.Message msg) {
                if (msg.what == handlerState) {

                    Medicion medicion = (Medicion) msg.obj;

                    // @debug
//                    System.out.println("Desde handleMessage:");
//                    System.out.println("temperatura" + medicion.temperatura);
//                    System.out.println("ritmoCardiaco" + medicion.ritmoCardiaco);
//                    System.out.println("oxigeno" + medicion.oxigeno);

                    temperatura = Double.toString(medicion.temperatura);
                    ritmoCardiaco = Double.toString(medicion.ritmoCardiaco);
                    oxigenoSangre = Double.toString(medicion.oxigeno);
                    //mediciones en proyecto1
                    repeticionAtleta=Integer.toString(medicion.repeticion);
                    velocidadAtleta=Double.toString(medicion.velocidad);
                    distanciaAleta=Double.toString(medicion.distancia);

                    tiempoAtleta=Double.toString(medicion.tiempo);
                    fallaAtleta=Integer.toString(medicion.falla);
                    rindioAtleta=Double.toString(medicion.rindio);
                    estadoAprobo=Integer.toString(medicion.aprobo);
                    //setear los valores para visualizarl los datos que se mandaran a la api
                    IdBufferIn.setText("Temp: "+temperatura+"\nritmo: "+ritmoCardiaco+"\noxigeno: "+
                            oxigenoSangre+"\nRepeticion: "+repeticionAtleta+
                            "\nVelocidad: "+velocidadAtleta+
                            "\nDistancia: "+distanciaAleta+
                            "\ntiempo: "+tiempoAtleta+
                            "\nfalla: "+fallaAtleta+
                            "\nrindio: "+rindioAtleta+
                            "\nAprobo: "+estadoAprobo);


                    //los datos obtenidos se enviaran al servidor
                   // insercionMediciones("https://anvw15k3m7.execute-api.us-east-2.amazonaws.com/ace2-dev/sensors");

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
        btnEnvio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                for(int i=0; i<MainActivity.pesoUsers.length(); i++){
                    char caracter=MainActivity.pesoUsers.charAt(i);
                   // IdBufferIn.setText(String.valueOf(caracter)+"\n");
                   MyConexionBT.write(String.valueOf(caracter));
                }
                MyConexionBT.write("#");
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
          //Parametro en proyecto (idUser ya estaba en practica1)
          parametros.put("repeticion",repeticionAtleta);
          parametros.put("velocidad",velocidadAtleta);
          parametros.put("distancia",distanciaAleta);

          parametros.put("tiempo",tiempoAtleta);
          parametros.put("falla",fallaAtleta);
          parametros.put("rindio",rindioAtleta);
          parametros.put("aprobo",estadoAprobo);

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
            //Se va estanr mandando el peso constantemente
            IdBufferIn.setText(MainActivity.pesoUsers);
            /*for(int i=0; i<MainActivity.peso.length(); i++){
                char caracter=MainActivity.peso.charAt(i);
                IdBufferIn.setText(caracter+"\n");
                IdBufferIn.setText(MainActivity.peso);

            }*/
            IdBufferIn.setText("#"); //indica final de carcteres que se mandara

            byte[] buffer = new byte[256];
            int bytes;

            // Se mantiene en modo escucha para determinar el ingreso de datos
            while (true) {
                try {
                    // Analiza el inputStream buscando estos patrones:

                    // '!' // PAQUETE: INICIAR_PRUEBA

                    // PAQUETE CORRIENDO: '#'{numeroEntero}'|'{numeroReal} '|'{numeroReal}'|'{numeroReal}'|'{numeroReal}'|'{numeroReal}'|'{numeroReal}';'
                    // descripcion:       '#'{distanciaTotalPrueba}'|'{repeticionActual}'|'{distanciaRepeticionActual}'|'{velocidadTiempoReal}'|'{temperatura}'|'{ritmo}'|'{oxigeno}';'

                    // '$' // PAQUETE: FIN_EXITO

                    // '%' // PAQUETE: FIN_RENDICION

                    // '&' // PAQUETE: FIN_FALLO

                    outer: while(true){
                        byte currByte = getNextByteFromInStream();

                        if(currByte == (byte) '!'){
                            // Por ahora lo ignoramos porque a la API no le importa cuando empezamos
                            // la prueba tampoco verificamos que venga uno de estos paquetes antes
                            // de empezar a leer paquetes '#'
                            System.out.println("Se empezo la prueba");
//                            bluetoothIn.obtainMessage(handlerState, -1, -1, new Medicion(0, 0, 0,
//                                    0,0,,tiempo,falla,rindio)).sendToTarget();
                        }
                        else if(currByte == (byte) '$'){
                            System.out.println("Se termino la prueba con Exito");
                            bluetoothIn.obtainMessage(handlerState, -1, -1, new Medicion(0, 0, 0,
                                    0,0,0,0,0, 0, 1)).sendToTarget();
                        }
                        else if(currByte == (byte) '%'){
                            System.out.println("Se termino la prueba Rindiendose");
                            bluetoothIn.obtainMessage(handlerState, -1, -1, new Medicion(0, 0, 0,
                                    0,0,0,0,0, 1, 0)).sendToTarget();
                        }
                        else if(currByte == (byte) '&'){
                            System.out.println("Se termino la prueba fallando");
                            bluetoothIn.obtainMessage(handlerState, -1, -1, new Medicion(0, 0, 0,
                                    0,0,0,0,1, 0, 0)).sendToTarget();
                        }
                        else if(currByte == (byte) '#'){
                            currByte = getNextByteFromInStream();
                            StringBuilder medicionesCrudas = new StringBuilder();
                            while (currByte != ';'){
                                // Caso especial de mensajes incompletos
                                if(currByte == '!' || currByte == '#' || currByte == '$' || currByte == '%' || currByte == '&'){
                                    throw new IOException("EROR: PRUEBA INCOMPLETA! NO APAGUE EL ARDUINO MIENTRAS SE ESTA HACIENDO UNA PRUEBA! char: " + currByte);
                                }

                                // Armamos el string que hay desde: '$' hasta ';'
                                medicionesCrudas.append((char)currByte);
                                currByte = getNextByteFromInStream();

                                if(medicionesCrudas.length() > 200){
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

                //{repeticionActual}'|'{tiempoRepeticionAcual}'|'{distanciaRepeticionActual}'|'{velocidadTiempoReal}'|'{temperatura}'|'{ritmo}'|'{oxigeno}';'
                            String[] medicionesSpliteadas = medicionesCrudas.toString().split("\\|");

                            // @debug:
                            System.out.println("Repeticion actual: " + medicionesSpliteadas[0]);
                            System.out.println("Tiempo repeticion actual: " + medicionesSpliteadas[1]);
                            System.out.println("Distacion repeticion actual: " + medicionesSpliteadas[2]);
                            System.out.println("Velocidad: " + medicionesSpliteadas[3]);
                            System.out.println("Temperatura: " + medicionesSpliteadas[4]);
                            System.out.println("Ritmo cardiaco: " + medicionesSpliteadas[5]);
                            System.out.println("Oxigeno: " + medicionesSpliteadas[6]);

                            int repeticion = Integer.parseInt(medicionesSpliteadas[0]);
                            double tiempo = Integer.parseInt(medicionesSpliteadas[1]) / 1000d;
                            double distancia = Double.parseDouble(medicionesSpliteadas[2]);
                            double velocidad = Double.parseDouble(medicionesSpliteadas[3]);
                            double temperatura = Double.parseDouble(medicionesSpliteadas[4]);
                            double ritmoCardiaco = Double.parseDouble(medicionesSpliteadas[5]);
                            double oxigeno = Double.parseDouble(medicionesSpliteadas[6]);

                            int falla = 0;
                            int rindio = 0;
                            int aprobo = 0;

                            bluetoothIn.obtainMessage(handlerState, -1, -1, new Medicion(temperatura, ritmoCardiaco, oxigeno,
                                    repeticion, velocidad, distancia, tiempo, falla, rindio, aprobo)).sendToTarget();
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