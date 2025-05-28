import { DataSource } from 'typeorm';
import path from 'path'

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './src/Database/database.db',
    synchronize: true, // use com cuidado em produção
    logging: false,
    entities: [path.join(__dirname, "./src/Entities/*.ts")],
});
