import JobberDAL from "../Repositories/JobberDAL"
import { Job } from "../Entities/Job"
import { Jobber } from "../Entities/Jobber"
import JobDAL from "../Repositories/JobDAL"

export type userPropertiesType = Jobber & {
    t: number,
    d: number
}

class AlgorithmController {
    public PESO_T = 10
    public PESO_D = 20

    public shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    public orderingJobToJobbers(jobs: Job[]) {
        let jobToJobbers = {}

        jobs.forEach(async(job) => {
            const jobbers = await JobberDAL.getAllForJob(job.id)
            const jobbers_ordened = this.orderList(jobbers)
            jobToJobbers = Object.assign(jobToJobbers, {
                job: [...jobbers_ordened]
            })
        })

        return jobToJobbers
    }

    public hungarianAlgorithm(costMatrix: number[][]): number[] {
        const n = costMatrix.length;
        const m = costMatrix[0].length;

        const u = Array(n).fill(0);
        const v = Array(m).fill(0);
        const p = Array(m).fill(-1);
        const way = Array(m).fill(-1);

        for (let i = 0; i < n; i++) {
            const minv = Array(m).fill(Infinity);
            const used = Array(m).fill(false);
            let j0 = -1;
            let j1 = 0;

            p.fill(-1);
            way.fill(-1);
            const links = Array(m).fill(-1);
            const delta = Array(m).fill(0);

            let markedI = i, markedJ = -1;
            const dist = Array(m).fill(Infinity);
            const pre = Array(m).fill(-1);
            used.fill(false);

            for (let j = 0; j < m; j++) {
                dist[j] = costMatrix[markedI][j] - u[markedI] - v[j];
                way[j] = markedI;
            }

            do {
                used[j1] = true;
                let i0 = way[j1];
                let delta = Infinity;
                for (let j = 0; j < m; j++) {
                    if (!used[j]) {
                        const cur = costMatrix[i0][j] - u[i0] - v[j];
                        if (cur < minv[j]) {
                            minv[j] = cur;
                            links[j] = j1;
                        }
                        if (minv[j] < delta) {
                            delta = minv[j];
                            j0 = j;
                        }
                    }
                }

                for (let j = 0; j < m; j++) {
                    if (used[j]) {
                        u[way[j]] += delta;
                        v[j] -= delta;
                    } else {
                        minv[j] -= delta;
                    }
                }

                j1 = j0;
            } while (p[j1] !== -1);

            do {
                const jPrev = links[j1];
                p[j1] = p[jPrev];
                j1 = jPrev;
            } while (j1 !== -1);
        }

        const result = Array(n).fill(-1);
        for (let j = 0; j < m; j++) {
            if (p[j] !== -1) {
                result[p[j]] = j;
            }
        }

        return result;
    }

    public async buildCostMatrix(jobbers: Jobber[], jobs: Job[]): Promise<number[][]> {
        const matrix: number[][] = [];

        for (const jobber of jobbers) {
            const row: number[] = [];

            for (const job of jobs) {
                const jobberForJob = await JobberDAL.getJobberByJob(job.id, jobber.id)
                const cost = jobberForJob.t * this.PESO_T + jobberForJob.d * this.PESO_D;
                row.push(cost);
            }

            matrix.push(row);
        }

        return matrix;
    }

    public orderList(list: userPropertiesType[]) {
        list = this.shuffleArray(list)

        list.sort((a, b) => {
            if (a.t !== b.t) return a.t - b.t;
            return a.d - b.d;
        })

        return list
    }

    public async makeMatrix(task_id: number) {

    }

    public async chooseTasks(workspace_id: number) {
        const jobs = await JobDAL.getAllByWorkspace(workspace_id)
        //console.log(jobs)
        //const jobbers = await JobberDAL.getAll()

        /*jobs.forEach(async(job) => {
            const jobbers = await JobberDAL.getAllForJob(job.id)
            console.log(jobbers)
            console.log("===========\n\n")
        })*/
        //const jobbers = await JobberDAL.getAllForJob(jobs[0].id)
        //console.log(jobbers)
        //const jobber_ordened = this.orderList(jobbers)
        //console.log(jobber_ordened)

        const jobbers: any = await JobberDAL.getAll()
        const costMatrix = await this.buildCostMatrix(jobbers, jobs)
        const result = this.hungarianAlgorithm(costMatrix)
        console.log(result)

    }
}

export default new AlgorithmController()