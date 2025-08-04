import 'reflect-metadata';
import { dataSource } from './ormconfig';
import JobberDAL from './Repositories/JobberDAL';
import AlgorithimController from './Controllers/AlgorithimController';

async function getData() {
    AlgorithimController.chooseTasks(3)
}

dataSource.initialize()
    .then(async () => {
        console.log('📦 Banco conectado com sucesso!');
        await getData()
    // Aqui você pode executar seeders ou iniciar um servidor, etc.
    })
    .catch((error) => console.error('Erro ao conectar banco:', error));
