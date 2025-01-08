import { Service } from 'typedi';
import { DatabaseService } from '../../database/database.service';
import { User } from './user.model';

@Service()
export class UserService {
    constructor(private readonly databaseService: DatabaseService) {}

    // Registrar un nuevo usuario
    public async register(username: string, password: string, role: string): Promise<number> {
        const query = {
            sql: `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
            params: [username, password, role],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rowCount;
    }

    // Buscar un usuario por nombre de usuario
    public async findByUsername(username: string): Promise<User | null> {
        const query = {
            sql: `SELECT * FROM users WHERE username = ?`,
            params: [username],
        };

        const result = await this.databaseService.execQuery(query);
        return result.rows.length > 0 ? (result.rows[0] as User) : null;
    }

    // Validar la contraseña de un usuario
    public async validatePassword(username: string, password: string): Promise<boolean> {
        const user = await this.findByUsername(username);
        return user ? user.password === password : false;
    }

    // Obtener todos los usuarios
    public async getAllUsers(): Promise<User[]> {
        const query = { sql: `SELECT id, username, role, email, createdAt FROM users` };
        const result = await this.databaseService.execQuery(query);
        return result.rows as User[];
    }
}
