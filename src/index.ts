import 'reflect-metadata';
import { dataSource } from './ormconfig';
import JobberDAL from './Repositories/JobberDAL';
import AlgorithimController from './Controllers/AlgorithimController';
import WhatsappController from './Controllers/WhatsappController';
import { Assignments } from './Controllers/AlgorithimController';

async function selectTrabalhosInternos() {
    const trabalhosInternosGeral: Assignments = await AlgorithimController.chooseTasks(1) //Workspace Trabalhos Internos
    const trabalhosInternosOracao: Assignments = await AlgorithimController.chooseTasks(3) //Worksapce Oração/Missa

    const message = await WhatsappController.createWhatsappMessage(trabalhosInternosGeral)
}

dataSource.initialize()
    .then(async () => {
        console.log('📦 Banco conectado com sucesso!');
        await selectTrabalhosInternos()
    // Aqui você pode executar seeders ou iniciar um servidor, etc.
    })
    .catch((error) => console.error('Erro ao conectar banco:', error));
