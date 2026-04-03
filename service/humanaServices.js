const axios = require('axios');

class HumanaService {
    constructor() {
        this.apiKey = process.env.HUMANA_API_KEY;
        this.baseURL = 'https://humanapi.p.rapidapi.com/v1/human';
        this.headers = {
            'x-rapidapi-host': 'humanapi.p.rapidapi.com',
            'x-rapidapi-key': this.apiKey
        };
    }

    // Método para obtener datos DEMO (sin autenticación real)
    async getDatosDemo() {
        // Estos son datos de ejemplo para que la interfaz funcione
        return {
            perfil: {
                nombre: "Paciente Demo",
                edad: 35,
                peso: 70.5,
                altura: 170
            },
            heart_rate: [
                { time: "2026-03-27T08:00:00Z", value: 72 },
                { time: "2026-03-27T12:00:00Z", value: 85 },
                { time: "2026-03-27T18:00:00Z", value: 78 }
            ],
            blood_pressure: [
                { time: "2026-03-27T08:00:00Z", systolic: 118, diastolic: 76 },
                { time: "2026-03-27T18:00:00Z", systolic: 122, diastolic: 80 }
            ],
            sleep: {
                duration: 7.5,
                quality: "Buena"
            },
            activity: {
                steps: 8432,
                calories: 320
            }
        };
    }

    // Métodos reales (requieren OAuth)
    async getPerfil() {
        // Por ahora devuelve demo
        const demo = await this.getDatosDemo();
        return demo.perfil;
    }

    async getHeartRate() {
        const demo = await this.getDatosDemo();
        return demo.heart_rate;
    }

    async getBloodPressure() {
        const demo = await this.getDatosDemo();
        return demo.blood_pressure;
    }
}

module.exports = new HumanaService();