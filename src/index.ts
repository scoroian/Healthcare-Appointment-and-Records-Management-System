import 'reflect-metadata';
import { Container } from 'typedi';
import { DatabaseService } from './database/database.service';
import { Server } from './server/server';

async function init(): Promise<void> {
    try {
        const databaseService = Container.get(DatabaseService);
        await databaseService.initializeDatabase(); // Inicializa la base de datos

        Container.get(Server); // Arranca el servidor
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        process.exit(1); // Finaliza el proceso si ocurre un error crítico
    }
}

(async () => {
    await init();
})();
