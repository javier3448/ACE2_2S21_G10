import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export default function TimeView() {
  // Establece el formato de la fecha
  const formatDate = "es-GT";
  // Establece la zona horaria
  const timeZone = "America/Guatemala";
  // Hook para actualizar la fecha/hora
  const [date, setDate] = useState(new Date(new Date().toLocaleString("en-US",{timeZone: "America/Guatemala"})));
  //// Hook para establecer la fecha/hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date(new Date().toLocaleString("en-US",{timeZone: "America/Guatemala"})));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="col-lg-2 col-xs-12 col-sm-12" align="center">
      <span className="text-right h5">
        {!date
          ? "Cargando..."
          : date.toLocaleTimeString()}
      </span>
      <br></br>
      <span className="text-right h6">
        {!date
          ? "Cargando..."
          : date.toLocaleDateString()}
      </span>
    </div>
  );
}
