import 'reflect-metadata';
import { AppDataSource } from '../ormconfig';

AppDataSource.initialize()
    .then(() => {
    console.log('📦 Banco conectado com sucesso!');
    // Aqui você pode executar seeders ou iniciar um servidor, etc.
    })
    .catch((error) => console.error('Erro ao conectar banco:', error));
