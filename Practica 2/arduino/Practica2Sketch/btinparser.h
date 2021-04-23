#ifndef BTINPARSER_h
#define BTINPARSER_h

// @MEJORA: deberiamos de recibir un float no un int, idealmente recibiriamos
// todo el float pero creo que al menos deberiamos de tratar de enviar los primeros
// dos decimales aunque sea

#include "pindefs.h"

// parsea la entrada de bluetooth, la cadena que parseariamos:
// !000;
// como 'expression regular': 
// '!'[0-9][0-9][0-9]';'

namespace BtInParser 
{

    struct BtInResult 
    {
        bool hasValue;
        float value;
    };

    // (currState = 0)    : se espera un '!'
    // (currState = 1-3)  : se espera un numero [0-9]
    // (currState = 4)    : se espera un ';'
    // Si en cualquier momento se obtiene un caracter no esperado, imprimimos un
    // mensaje de error en el Serial y regresamos al estado 0
    // Cuando complemetamos la cadena, retonamos un BtInResult con hasValue = true
    // y value igual itof de la cadena
    extern int8_t currParseState;

    // sabemos exactamente el tamano del string que vamos a recibir, entonces solo

    constexpr int8_t MSG_BUFFER_LENGTH = 9;
    extern char msgBuffer[MSG_BUFFER_LENGTH];

    BtInResult parse(char c);
};

#endif
