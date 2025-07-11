import { DataSource } from 'typeorm';
import path from 'path'
import { Jobber } from './src/Entities/Jobber';
import { Job } from './src/Entities/Job';
import { Workspace } from './src/Entities/Workspace';
import { RelationJobberJob } from './src/Entities/RelationJobberJob';
import { JobberJobCycle } from './src/Entities/JobberJobCycle';
import { JobCycle } from './src/Entities/JobCycle';

export const dataSource = new DataSource({
    type: 'sqlite',
    database: './src/Database/database.db',
    synchronize: true, // use com cuidado em produção
    logging: false,
    entities: [Job, Jobber, Workspace, RelationJobberJob, JobberJobCycle, JobCycle]
});
