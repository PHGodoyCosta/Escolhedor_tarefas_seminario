import JobberDAL from "../Repositories/JobberDAL"
import JobDAL from "../Repositories/JobDAL"

export type userPropertiesType = {
    t: number,
    d: number
}

class AlgorithmController {

    public orderList(list: userPropertiesType[]) {
        list.sort((a, b) => {
            if (a.t !== b.t) return a.t - b.t;
            return a.d - b.d;
        })

        return list
    }

    public async makeMatrix(task_id: number) {

    }

    public async chooseTasks(workspace_id: number) {
        const jobs = await JobDAL.getAll()
        //const jobbers = await JobberDAL.getAll()
        
        
        for (let i=0;i<jobs.length;i++) {
            const job = jobs[i]
            const jobbers = await JobberDAL.getAllForJob(job)
            console.log(jobbers)
        }
    }
}

export default new AlgorithmController()