export class UbicacionService {
    
    static API_URL = '/api/ubicacion/ciudades'; 

    static async buscarCiudades(termino) {
        if (!termino || termino.length < 3) return [];

        try {
            const response = await fetch(`${this.API_URL}?busqueda=${encodeURIComponent(termino)}`);
            
            if (!response.ok) return [];

            return await response.json(); 

        } catch (error) {
            console.error("Error buscando ciudad:", error);
            return [];
        }
    }
}