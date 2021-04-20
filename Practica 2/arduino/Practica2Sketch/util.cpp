#include "util.h"

// NO SIRVE TODAVIA
float asciiHexToFloat(char* str)
{
    byte temp[4];
    for(int i = 0; i < 4; i++){
        temp[i] = asciiHexToByte(&str[i * 2]);
        Serial.print("i ");
        Serial.print(i);
        Serial.print(": ");
        Serial.println(temp[i], HEX);
    }

    float result;
    memcpy((void*) &result, (void*) temp, 4);
    return result;
}

// NO SIRVE TODAVIA
// el tamanno de str debe ser: 2
byte asciiHexToByte(char* str)
{
    byte result = 0;

    { // first nibble (most significant)
        if(str[0] >= '0' && str[0] <= '9'){
            result += (str[0] - '0') * 16;
        }
        else if(str[0] >= 'a' && str[0] <= 'f'){
            result += (str[0] - 'a' + 10) * 16;
        }
        else if(str[0] >= 'A' && str[0] <= 'F'){
            result += (str[0] - 'A' + 10) * 16;
        }
        // else{
        //     assert(false);
        // }
    }

    { // second nibble (least significant)
        if(str[1] >= '0' && str[1] <= '9'){
            result += str[1] - '0';
        }
        else if(str[1] >= 'a' && str[1] <= 'f'){
            result += str[1] - 'a' + 10;
        }
        else if(str[1] >= 'A' && str[1] <= 'F'){
            result += str[1] - 'A' + 10;
        }
        // else{
        //     assert(false);
        // }
    }



    return result;
}