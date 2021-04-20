#ifndef _UTIL_h
#define _UTIL_h

#include "pindefs.h"

// @TODO [!]: ver que en java y aqui manejemos el mismo endianess

// @Mejora estas funciones deberian ser inline

// NO SIRVEN TODAVIA!!!: 
// str es IEE754 en texto ascii (en hex), retornamos el float como tal
// ejemplo: str = '3F800000', retorna: 1.0f
// [!] trabaja con los primeros *8* bytes de str. UB si 'vienen' menos de 8 bytes
float asciiHexToFloat(char* str);
// str es texto ascii representado un valor hexagecimal, retornamos el byte que representa
// ejemplo: str = 'ff', retorna: 255
// [!] trabaja con los primeros *2* bytes de str. UB si 'vienen' menos de 2 bytes
byte asciiHexToByte(char* str);

#endif
