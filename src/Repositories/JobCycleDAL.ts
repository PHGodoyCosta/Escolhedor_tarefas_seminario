import { Equal } from "typeorm"
import { dataSource } from "../../ormconfig"
import { JobCycle } from "../Entities/JobCycle"

export class JobCycleDAL {
    public insert(job_id: number) {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .insert(JobCycle, {
                    job: { id: job_id },
                    date: new Date()
                })
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }

    public getById(id: number) {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .findOne(JobCycle, {
                    where: {
                        id: Equal(id)
                    }
                })
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }
}

export default new JobCycleDAL()