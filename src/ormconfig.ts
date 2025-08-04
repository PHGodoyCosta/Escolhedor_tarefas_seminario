import { DataSource } from 'typeorm';
import path from 'path'
import { Jobber } from './Entities/Jobber';
import { Job } from './Entities/Job';
import { Workspace } from './Entities/Workspace';
import { RelationJobberJob } from './Entities/RelationJobberJob';
import { JobberJobCycle } from './Entities/JobberJobCycle';
import { JobCycle } from './Entities/JobCycle';

export const dataSource = new DataSource({
    type: 'sqlite',
    database: './src/Database/database.db',
    //database: './src/Database/2_semestre.db',
    synchronize: true, // use com cuidado em produção
    logging: false,
    entities: [Job, Jobber, Workspace, RelationJobberJob, JobberJobCycle, JobCycle]
});
