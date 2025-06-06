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

        if (jobbers.length > jobs.length) {
            for (const jobber of jobbers) {
                const row: number[] = [];

                for (const job of jobs) {
                    const jobberForJob = await JobberDAL.getJobberByJob(job.id, jobber.id)
                    let cost = jobberForJob.t * this.PESO_T + (this.MAX_D - jobberForJob.d) * this.PESO_D;

                    if (jobberForJob.d == 0) {
                        cost = Number.MAX_SAFE_INTEGER
                    }

                    row.push(cost);
                }

                /*const infinityQuantity = jobbers.length - jobs.length

                for (let i=0;i<infinityQuantity;i++) {
                    row.push(Infinity)
                }*/

                matrix.push(row);
            }
        } else if (jobs.length >= jobbers.length) {
            for (const jobber of jobbers) {
                const row: number[] = [];

                for (const job of jobs) {
                    const jobberForJob = await JobberDAL.getJobberByJob(job.id, jobber.id)
                    const cost = jobberForJob.t * this.PESO_T + (this.MAX_D - jobberForJob.d) * this.PESO_D;
                    row.push(cost);
                }

                matrix.push(row);
            }

            /*const infinityRowQuantity = jobs.length - jobbers.length

            for (let r=0;r<infinityRowQuantity;r++) {
                const row: number[] = [];

                for (let i=0;i<jobs.length;i++) {
                    row.push(Infinity)
                }

                matrix.push(row)
            }*/
            
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

    public async veriyResults(result: any) {
        Object.keys(result).map(async(job_id: string) => {
            result[job_id].map(async(jobber_id: number) => {
                const jobberVariables = await JobberDAL.getTandD(Number(job_id), jobber_id)
                console.log(jobberVariables)

                if (jobberVariables.d === 0) {
                    return false
                }
            })
        })

        return true
    }

    public async chooseTasks(workspace_id: number) {
        let jobs = await JobDAL.getAllByWorkspace(workspace_id)
        const jobbersData = await JobberDAL.getAll() as Jobber[]
        let jobbers = jobbersData
        //console.log(jobbers)
        //let jobbers = this.shuffleArray(jobbersData)

        const jobToJobbersAssigned = {}
        const breno = await JobberDAL.getJobberByJob(1, 4)
        //console.log(breno)

        while (jobs.length > 0) {
            const costMatrix = await this.buildCostMatrix(jobbers, jobs)
            console.log(costMatrix)
            const result = this.hungarianAlgorithm(costMatrix)

            console.log(result)

            for (let workerIndex = 0; workerIndex < result.length; workerIndex++) {
                const jobIndex = result[workerIndex];

                if (jobIndex !== null && workerIndex < jobbers.length) {
                    const jobber = jobbers[workerIndex]; // sua lista original de jobbers
                    const job = jobs[jobIndex];          // sua lista original de trabalhos

                    if (jobber != undefined && job != undefined) {
                        if (job.id in jobToJobbersAssigned) {
                            jobToJobbersAssigned[job.id].push(jobber.id)
                        } else {
                            jobToJobbersAssigned[job.id] = [jobber.id]
                        }

                        if (jobToJobbersAssigned[job.id].length == job.num_jobbers) {
                            jobs = jobs.filter(jobFilter => jobFilter.id !== job.id)
                        }

                        jobbers = jobbers.filter(jobberFilter => jobberFilter.id !== jobber.id)

                        console.log(`${jobber.name} → ${job.name}`);
                    }
                }
            }
        }

        console.log(jobToJobbersAssigned)
        const check = this.veriyResults(jobToJobbersAssigned)
        console.log(check)
        this.insertMatches(jobToJobbersAssigned)

    }
}

export default new AlgorithmController()
