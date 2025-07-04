import { dataSource } from "../ormconfig"
import { Workspace } from "../Entities/Workspace"
import { Equal } from "typeorm"

export class WorkspacesDAL {
    getAll = () => {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .find(Workspace)
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }

    getWorkspaceByHash = (hash: string) => {
        return new Promise((resolve, reject) => {
            dataSource.manager
                .find(Workspace, {
                    where: {
                        hash: Equal(hash)
                    }
                })
                .then((data: any) => resolve(data))
                .catch((error: Error) => reject(error))
        })
    }
}

export default new WorkspacesDAL()