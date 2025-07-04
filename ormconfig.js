"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const Jobber_1 = require("./src/Entities/Jobber");
const Job_1 = require("./src/Entities/Job");
const Workspace_1 = require("./src/Entities/Workspace");
const RelationJobberJob_1 = require("./src/Entities/RelationJobberJob");
const JobberJobCycle_1 = require("./src/Entities/JobberJobCycle");
const JobCycle_1 = require("./src/Entities/JobCycle");
exports.dataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: './src/Database/database.db',
    synchronize: true, // use com cuidado em produção
    logging: false,
    entities: [Job_1.Job, Jobber_1.Jobber, Workspace_1.Workspace, RelationJobberJob_1.RelationJobberJob, JobberJobCycle_1.JobberJobCycle, JobCycle_1.JobCycle]
});
