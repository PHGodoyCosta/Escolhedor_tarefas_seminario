import 'reflect-metadata';
import { dataSource } from '../ormconfig';
import JobberDAL from './Repositories/JobberDAL';
import AlgorithimController from './Controllers/AlgorithimController';

console.log("Eu sou o main")

async function getData() {
    /*const allJobbers = await JobberDAL.getAll()
    let firstJobber = allJobbers[0]
    console.log(allJobbers)
    console.log(firstJobber.name)*/
    AlgorithimController.chooseTasks(1)

    let t = await JobberDAL.getTandD(1, 2)
    //console.log(t)

}

dataSource.initialize()
    .then(async () => {
        console.log('📦 Banco conectado com sucesso!');
        await getData()
    // Aqui você pode executar seeders ou iniciar um servidor, etc.
    })
    .catch((error) => console.error('Erro ao conectar banco:', error));
