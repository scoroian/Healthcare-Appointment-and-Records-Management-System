import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { Service } from 'typedi';
import { config } from '../config/environment';
import path from 'path';
import { DBQuery } from './models/db-query';
import { DBQueryResult } from './models/db-query-result';

@Service()
export class DatabaseService {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  /**
   * Abre la conexión a la base de datos si no está ya abierta.
   */
  public async openDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
    if (this.db) {
      return this.db;
    }

    this.db = await open({
      filename: path.join(__dirname, `../data/${config.dbOptions.database}`),
      driver: sqlite3.Database,
    });

    await this.db.exec(`PRAGMA foreign_keys = ON;`);

    return this.db;
  }

  /**
   * Cierra la conexión a la base de datos.
   */
  public async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  /**
   * Ejecuta una consulta SQL y devuelve los resultados.
   */
  public async execQuery(query: DBQuery): Promise<DBQueryResult> {
    const dbClient = await this.openDatabase();
    const { sql, params } = query;

    try {
      const rows: [] = await dbClient.all(sql, params);

      return { rows: rows, rowCount: rows.length };
    } finally {
      await this.closeDatabase();
    }
  }

  /**
   * Ejecuta una consulta de inserción en la base de datos.
   */
  public async execInsert(query: DBQuery): Promise<DBQueryResult> {
    const dbClient = await this.openDatabase();
    const { sql, params } = query;

    try {
      const rows: [] = await dbClient.all(sql, params);

      return { rows: rows, rowCount: rows.length };
    } finally {
      await this.closeDatabase();
    }
  }

  /**
   * Inicializa la base de datos creando las tablas necesarias si no existen.
   */
  public async initializeDatabase(): Promise<void> {
    await this.openDatabase();

    // Crear tabla de usuarios
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS users (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         username TEXT NOT NULL UNIQUE,
                                         password TEXT NOT NULL,
                                         role TEXT NOT NULL, -- patient, doctor, admin
                                         email TEXT,
                                         createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla de citas
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                patientId INTEGER NOT NULL,
                                                doctorId INTEGER NOT NULL,
                                                dateTime DATETIME NOT NULL,
                                                reason TEXT,
                                                status TEXT DEFAULT 'confirmed',
                                                FOREIGN KEY(patientId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(doctorId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // Crear tabla de registros médicos
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS medical_records (
                                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   patientId INTEGER NOT NULL,
                                                   doctorId INTEGER NOT NULL,
                                                   diagnosis TEXT,
                                                   prescriptions TEXT,
                                                   notes TEXT,
                                                   testResults TEXT,
                                                   treatments TEXT,
                                                   createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                   FOREIGN KEY(patientId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(doctorId) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // Crear tabla de especialidades
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS specialties (
                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                               name TEXT NOT NULL UNIQUE,
                                               description TEXT
      );
    `);

    // Crear tabla de asociación de doctores con especialidades
    await this.db!.exec(`
      CREATE TABLE IF NOT EXISTS doctor_specialties (
                                                      doctorId INTEGER NOT NULL,
                                                      specialtyId INTEGER NOT NULL,
                                                      FOREIGN KEY(doctorId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(specialtyId) REFERENCES specialties(id) ON DELETE CASCADE,
        PRIMARY KEY(doctorId, specialtyId)
        );
    `);

    // Crear triggers para validar roles
    await this.db!.exec(`
    CREATE TRIGGER IF NOT EXISTS validate_medical_record_roles
    BEFORE INSERT ON medical_records
    FOR EACH ROW
    BEGIN
      SELECT CASE
        WHEN (SELECT role FROM users WHERE id = NEW.doctorId) != 'doctor' THEN
          RAISE(ABORT, 'Invalid doctorId: User is not a doctor')
      END;

      SELECT CASE
        WHEN (SELECT role FROM users WHERE id = NEW.patientId) != 'patient' THEN
          RAISE(ABORT, 'Invalid patientId: User is not a patient')
      END;
    END;
  `);

    await this.db!.exec(`
    CREATE TRIGGER IF NOT EXISTS validate_appointment_roles
    BEFORE INSERT ON appointments
    FOR EACH ROW
    BEGIN
      SELECT CASE
        WHEN (SELECT role FROM users WHERE id = NEW.doctorId) != 'doctor' THEN
          RAISE(ABORT, 'Invalid doctorId: User is not a doctor')
      END;

      SELECT CASE
        WHEN (SELECT role FROM users WHERE id = NEW.patientId) != 'patient' THEN
          RAISE(ABORT, 'Invalid patientId: User is not a patient')
      END;
    END;
  `);

    await this.db!.exec(`
    CREATE TRIGGER IF NOT EXISTS validate_doctor_specialty_roles
    BEFORE INSERT ON doctor_specialties
    FOR EACH ROW
    BEGIN
      SELECT CASE
        WHEN (SELECT role FROM users WHERE id = NEW.doctorId) != 'doctor' THEN
          RAISE(ABORT, 'Invalid doctorId: User is not a doctor')
      END;
    END;
  `);

    await this.closeDatabase();
    console.log('Base de datos inicializada con éxito.');
  }
}
