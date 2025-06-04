import JobberDAL from "../Repositories/JobberDAL"
import { Job } from "../Entities/Job"
import { Jobber } from "../Entities/Jobber"
import JobDAL from "../Repositories/JobDAL"
import { minWeightAssign } from 'munkres-algorithm'

export type userPropertiesType = Jobber & {
    t: number,
    d: number
}

class AlgorithmController {
    public PESO_T = 10
    public PESO_D = 20
    public MAX_D = 4

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
        const result = minWeightAssign(costMatrix)
        const assignments = result.assignments

        return assignments
    }

    public async buildCostMatrix(jobbers: Jobber[], jobs: Job[]): Promise<number[][]> {
        const matrix: number[][] = [];

        if (jobbers > jobs) {
            for (const jobber of jobbers) {
                const row: number[] = [];

                for (const job of jobs) {
                    const jobberForJob = await JobberDAL.getJobberByJob(job.id, jobber.id)
                    const cost = jobberForJob.t * this.PESO_T + (this.MAX_D - jobberForJob.d) * this.PESO_D;
                    row.push(cost);
                }

                const infinityQuantity = jobbers.length - jobs.length

                for (let i=0;i<infinityQuantity;i++) {
                    row.push(Infinity)
                }

                matrix.push(row);
            }
        } else if (jobs >= jobbers) {
            for (const jobber of jobbers) {
                const row: number[] = [];

                for (const job of jobs) {
                    const jobberForJob = await JobberDAL.getJobberByJob(job.id, jobber.id)
                    const cost = jobberForJob.t * this.PESO_T + (this.MAX_D - jobberForJob.d) * this.PESO_D;
                    row.push(cost);
                }

                matrix.push(row);
            }

            const infinityRowQuantity = jobs.length - jobbers.length

            for (let r=0;r<infinityRowQuantity;r++) {
                const row: number[] = [];

                for (let i=0;i<jobs.length;i++) {
                    row.push(Infinity)
                }

                matrix.push(row)
            }
            
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
        const jobbersData = await JobberDAL.getAll() as Jobber[]
        const jobbers = this.shuffleArray(jobbersData)

        const jobToJobbersAssigned = []
        const breno = await JobberDAL.getJobberByJob(1, 4)
        console.log(breno)
        const costMatrix = await this.buildCostMatrix(jobbers, jobs)
        console.log(costMatrix)
        const result = this.hungarianAlgorithm(costMatrix)

        for (let workerIndex = 0; workerIndex < result.length; workerIndex++) {
            const jobIndex = result[workerIndex];

            if (jobIndex !== null && workerIndex < jobbers.length) {
                const jobber = jobbers[workerIndex]; // sua lista original de jobbers
                const job = jobs[jobIndex];          // sua lista original de trabalhos
                console.log(`${jobber.name} → ${job.name}`);
            }
        }

        console.log(result)

    }
}

export default new AlgorithmController()