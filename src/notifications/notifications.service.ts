import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { Twilio } from "twilio"

@Injectable()
export class NotificacionesService {
    private readonly logger = new Logger(NotificacionesService.name)
    private twilioClient: Twilio

    constructor(private configService: ConfigService) {
        const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID")
        const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN")

        if (accountSid && authToken) {
            this.twilioClient = new Twilio(accountSid, authToken)
        } else {
            this.logger.warn("Twilio credentials not configured")
        }
    }

    async enviarSMS(telefono: string, mensaje: string): Promise<boolean> {
        if (!this.twilioClient) {
            this.logger.error("Twilio client not initialized")
            return false
        }

        try {
            const message = await this.twilioClient.messages.create({
                body: mensaje,
                from: this.configService.get<string>("TWILIO_PHONE_NUMBER"),
                to: telefono,
            })

            this.logger.log(`SMS enviado exitosamente: ${message.sid}`)
            return true
        } catch (error) {
            this.logger.error(`Error enviando SMS: ${error instanceof Error ? error.message : "Error desconocido"}`)
            return false
        }
    }

    async enviarAlertaZonaRemota(telefono: string, ubicacion: string): Promise<boolean> {
        const mensaje = `🌄 ¡Bienvenido a ${ubicacion}! 
Estás en una zona remota. Mantente en contacto y disfruta tu experiencia cultural de manera segura. 
Para emergencias: 123. 
¡Que tengas un viaje memorable! 🇨🇴`

        return this.enviarSMS(telefono, mensaje)
    }

    async enviarConfirmacionReserva(telefono: string, ruta: string, fecha: string): Promise<boolean> {
        const mensaje = `✅ Reserva confirmada para "${ruta}" el ${fecha}. 
Recibirás más detalles por email. 
¡Prepárate para una experiencia transformadora! 🌟`

        return this.enviarSMS(telefono, mensaje)
    }

    async enviarCodigoQR(telefono: string, codigoQR: string): Promise<boolean> {
        const mensaje = `🎫 Tu código QR para descuentos locales: ${codigoQR}
Muéstralo en negocios participantes para obtener beneficios especiales. 
¡Apoya la economía local! 💚`

        return this.enviarSMS(telefono, mensaje)
    }

    async enviarRecordatorioViaje(telefono: string, ruta: string, dias: number): Promise<boolean> {
        const mensaje = `⏰ Recordatorio: Tu viaje "${ruta}" es en ${dias} día(s). 
Revisa las recomendaciones y prepara tu equipaje. 
¡Te esperamos! 🎒`

        return this.enviarSMS(telefono, mensaje)
    }
}
