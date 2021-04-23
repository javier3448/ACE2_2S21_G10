#include "btinparser.h"

int8_t BtInParser::currParseState = 0;

char BtInParser::msgBuffer[BtInParser::MSG_BUFFER_LENGTH];

// expectedChar es un cstring porque a veces lo que se espera se expresa mejor
// con una expression regular
static void printError(int8_t state, const char * expectedChar, char actualChar)
{
    Serial.print("BtInParser::parse state ");
    Serial.print(state);
    Serial.print(" : Error se esperaba ");
    Serial.print(expectedChar);
    Serial.print(", se obtuvo: '");
    Serial.print(actualChar);
    Serial.println('\'');
}

BtInParser::BtInResult BtInParser::parse(char c)
{
    switch(currParseState)
    {
        case 0:
        {
            if(c == '!'){
                msgBuffer[currParseState] = c;
                currParseState++;
            }
            else{
                printError(currParseState, "'!'", c);
                currParseState = 0;
            }
        }break;

        case 1:
        case 2:
        case 3:
        {
            if(c >= '0' && c <= '9'){
                msgBuffer[currParseState] = c;
                currParseState++;
            }
            else{
                printError(currParseState, "[0-9]", c);
                currParseState = 0;
            }
        }break;

        case 4:
        {
            if(c == ';'){
                msgBuffer[currParseState] = c;
                currParseState = 0;
                return {
                    .hasValue = true, 
                    // el primer caracter de msgBuffer es '!', por eso mandamos
                    // a atof un puntero al segundo caracter
                    .value = atof(&msgBuffer[1])
                };
            }
            else{
                printError(currParseState, "'.'", c);
                currParseState = 0;
            }
        }break;
    }

    return {.hasValue = false, .value = -1};
}
