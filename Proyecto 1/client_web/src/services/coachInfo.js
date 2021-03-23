import axios from "axios";
import { urlServer } from "../config";

export async function getAthletes(username) {
    const result = await axios.get(urlServer + `users/show/${username}`)
    if (result.status === 200) {
        // El servidor está OK
        const data = result.data;
        if (typeof data === typeof []) {
            // La data recibida es un array
            return data;
        }
    }
    return [];
}