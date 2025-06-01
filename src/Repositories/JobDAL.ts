import { Equal } from "typeorm";
import { dataSource } from "../../ormconfig";
import { Job } from "../Entities/Job";

export class JobDAL {
    getAll = () => {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .find(Job)
                .then((data: any) => resolve(data))
                .catch((err: Error) => reject(err))
        })
    }

    getAllByWorkspace = (workspace_id: number): Promise<Job[]> => {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .find(Job, {
                    where: {
                        workspace: Equal(workspace_id)
                    }
                })
                .then((data: any) => resolve(data))
                .catch((err: Error) => reject(err))
        })
    }

}

export default new JobDAL()