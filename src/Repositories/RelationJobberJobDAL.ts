import { RelationJobberJob } from "../Entities/RelationJobberJob"
import { dataSource } from "../../ormconfig"

type RelationInsertType = {
    job_id: number,
    jobber_id: number
}

export class RelationJobberJobDAL {
    insert = ({ job_id, jobber_id }: RelationInsertType) => {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .insert(RelationJobberJob, {
                    job: { id: job_id },
                    jobber: { id: jobber_id }
                })
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }
}

export default new RelationJobberJobDAL()