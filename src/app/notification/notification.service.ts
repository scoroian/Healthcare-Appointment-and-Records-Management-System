import { Service } from 'typedi';

@Service()
export class NotificationService {
    /**
     * Simular el envío de una notificación.
     * @param userId ID del usuario destinatario.
     * @param message Mensaje de la notificación.
     */
    public sendNotification(userId: number | undefined, message: string): void {
        console.log(`📬 Notificación enviada al usuario ${userId}: ${message}`);
    }
}
