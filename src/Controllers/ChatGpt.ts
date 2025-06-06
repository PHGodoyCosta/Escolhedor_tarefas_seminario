import JobberDAL from "../Repositories/JobberDAL"
import { Job } from "../Entities/Job"
import { Jobber } from "../Entities/Jobber"
import JobDAL from "../Repositories/JobDAL"
import { minWeightAssign } from 'munkres-algorithm'
import RelationJobberJobDAL from "../Repositories/RelationJobberJobDAL"
import JobCycleDAL from "../Repositories/JobCycleDAL"
import JobberJobCycleDAL from "../Repositories/JobberJobCycleDAL"

export type userPropertiesType = Jobber & {
    t: number,
    d: number
}

class AlgorithmController {
    public PESO_T = 0
    public PESO_D = 20
    public MAX_D = 4

    public shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    public insertMatches(result: any) {
        Object.keys(result).map(async(job_id: string) => {
            const cycle: any = await JobCycleDAL.insert(Number(job_id))
            const cycleId = cycle.identifiers[0].id

            result[job_id].map(async(jobber_id: number) => {
                await JobberJobCycleDAL.insert(Number(jobber_id), cycleId)
                await RelationJobberJobDAL.insert(Number(job_id), jobber_id)
            })
        })
    }

    public orderList(list: userPropertiesType[]) {
        list = this.shuffleArray(list)
        list.sort((a, b) => {
            if (a.t !== b.t) return a.t - b.t;
            return a.d - b.d;
        })
        return list
    }

    public hungarianAlgorithm(costMatrix: number[][]): number[] {
        const result = minWeightAssign(costMatrix)
        return result.assignments
    }

    private async countValidJobbersPerJob(jobs: Job[], jobbers: Jobber[]): Promise<Job[]> {
        const result: [Job, number][] = []

        for (const job of jobs) {
            let count = 0
            for (const jobber of jobbers) {
                const { d } = await JobberDAL.getJobberByJob(job.id, jobber.id)
                if (d > 0) count++
            }
            result.push([job, count])
        }

        return result.sort((a, b) => a[1] - b[1]).map(([job]) => job)
    }

    public async buildCostMatrix(jobbers: Jobber[], jobs: Job[]): Promise<number[][]> {
        const matrix: number[][] = []

        for (const jobber of jobbers) {
            const row: number[] = []
            for (const job of jobs) {
                const jobberForJob = await JobberDAL.getJobberByJob(job.id, jobber.id)
                let cost = jobberForJob.t * this.PESO_T + (this.MAX_D - jobberForJob.d) * this.PESO_D
                if (jobberForJob.d === 0) cost = Number.MAX_SAFE_INTEGER
                row.push(cost)
            }
            matrix.push(row)
        }

        return matrix
    }

    public async chooseTasks(workspace_id: number) {
        const jobbers = await JobberDAL.getAll() as Jobber[]
        const rawJobs = await JobDAL.getAllByWorkspace(workspace_id)
        let jobs = await this.countValidJobbersPerJob(rawJobs, jobbers)
        let availableJobbers = [...jobbers]

        const jobToJobbersAssigned: Record<number, number[]> = {}

        while (jobs.length > 0 && availableJobbers.length > 0) {
            const costMatrix = await this.buildCostMatrix(availableJobbers, jobs)
            const result = this.hungarianAlgorithm(costMatrix)

            const assignedJobbers = new Set<number>()

            for (let workerIndex = 0; workerIndex < result.length; workerIndex++) {
                const jobIndex = result[workerIndex]
                const jobber = availableJobbers[workerIndex]

                if (jobIndex !== null && jobIndex < jobs.length && jobber) {
                    const job = jobs[jobIndex]

                    const cost = costMatrix[workerIndex][jobIndex]
                    if (cost === Number.MAX_SAFE_INTEGER) continue

                    if (!jobToJobbersAssigned[job.id]) {
                        jobToJobbersAssigned[job.id] = []
                    }
                    jobToJobbersAssigned[job.id].push(jobber.id)

                    assignedJobbers.add(jobber.id)

                    if (jobToJobbersAssigned[job.id].length >= job.num_jobbers) {
                        jobs = jobs.filter(j => j.id !== job.id)
                    }

                    console.log(`${jobber.name} → ${job.name}`)
                }
            }

            // Remove assigned jobbers
            availableJobbers = availableJobbers.filter(j => !assignedJobbers.has(j.id))
        }

        console.log(jobToJobbersAssigned)
        // this.insertMatches(jobToJobbersAssigned)
    }
}

export default new AlgorithmController()
