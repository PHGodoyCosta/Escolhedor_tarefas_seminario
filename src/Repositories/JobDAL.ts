import { Equal } from "typeorm";
import { dataSource } from "../ormconfig";
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

    getById = (id: number) => {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .findOne(Job, {
                    where: {
                        id: Equal(id)
                    }
                })
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
                    },
                    order: {
                        sort_order: "ASC"
                    }
                })
                .then((data: any) => resolve(data))
                .catch((err: Error) => reject(err))
        })
    }

}

export default new JobDAL()