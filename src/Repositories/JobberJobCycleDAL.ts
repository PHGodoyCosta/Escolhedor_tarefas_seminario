import { JobberJobCycle } from "../Entities/JobberJobCycle";
import { dataSource } from "../../ormconfig";
import { Equal } from "typeorm";

export class JobberJobCycleDAL {
    public insert(jobber_id: number, cycle_id: number) {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .insert(JobberJobCycle, {
                    jobber: { id: jobber_id},
                    cycle: { id: cycle_id }
                })
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }

    public getById(id: number) {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .findOne(JobberJobCycle, {
                    where: {
                        id: Equal(id)
                    }
                })
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }
}

export default new JobberJobCycleDAL()