import { json, urlencoded } from 'body-parser';
import { Application, Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { Api } from './api/api';
import { config } from '../config/environment';

@Service()
export class Server {
  app: Application;

  constructor(private readonly api: Api) {
    this.app = express();
    this.setupServer();
  }

  private setupServer(): void {
    // Middlewares globales
    this.app.use(cors());
    this.app.use(json({ limit: '5mb' }));
    this.app.use(urlencoded({ extended: false }));
    this.app.use(morgan('dev'));

    // Rutas principales
    this.app.use('/api', this.api.getApiRouter());

    // Manejo de errores (opcional)
    this.app.use(this.errorHandler.bind(this));

    // Iniciar el servidor
    this.app.listen(config.port, this.onHttpServerListening.bind(this));
  }

  private onHttpServerListening(): void {
    console.log(`Server express started in ${config.env} mode (ip:${config.ip}, port:${config.port})`);
  }

  private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
