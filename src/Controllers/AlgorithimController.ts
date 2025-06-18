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

type Assignments = Record<number, number[]>;

class AlgorithmController {
    public PESO_T = 10
    public PESO_D = 20
    public MAX_D = 4
    public jobToJobbersAssigned = {}

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

    public async fixInvalidAssignments(assignments: Assignments): Promise<Assignments> {
        const fixed = Object.fromEntries(
            Object.entries(assignments).map(([jid, arr]) => [Number(jid), [...arr]])
        ) as Assignments;

        async function canDo(jobId: number, jobberId: number): Promise<boolean> {
            const { d } = await JobberDAL.getTandD(jobId, jobberId);
            return d > 0;
        }

        let madeSwap: boolean;
        do {
            madeSwap = false;

            for (const [jobA, listA] of Object.entries(fixed)) {
            const jA = Number(jobA);
            for (let i = 0; i < listA.length; i++) {
                const x = listA[i];
                const validInA = await canDo(jA, x);
                if (validInA) continue;

                for (const [jobB, listB] of Object.entries(fixed)) {
                const jB = Number(jobB);
                if (jA === jB) continue;
                if (!(await canDo(jB, x))) continue;

                const idxY = await (async () => {
                    for (let k = 0; k < listB.length; k++) {
                    const y = listB[k];
                    if (await canDo(jA, y)) return k;
                    }
                    return -1;
                })();

                if (idxY >= 0) {
                    const y = listB[idxY];
                    listA[i] = y;
                    listB[idxY] = x;
                    madeSwap = true;
                    break;
                }
                }

                if (madeSwap) break;
            }
            if (madeSwap) break;
            }
        } while (madeSwap);

        return fixed;
    }

    /*public fixReplayJobber(jobber: Jobber, exJob: number) {
        console.log("FIXING!")
        Object.keys(this.jobToJobbersAssigned).map(async(job) => {
            const variables = await JobberDAL.getTandD(Number(job), jobber.id)
            if (variables.d > 0) {
                this.jobToJobbersAssigned[job].forEach(async(jobberItem: number) => {
                    const testingNewJobber = await JobberDAL.getTandD(exJob, jobberItem)

                    if (testingNewJobber.d > 0) {
                        console.log("Consigo consertar:")
                        console.log(`JOB: ${job} => jobber: ${jobberItem}`)
                        this.jobToJobbersAssigned[job] = this.jobToJobbersAssigned[job].filter(item => item !== jobberItem)

                        this.jobToJobbersAssigned[job].push(jobber.id)
                        console.log(this.jobToJobbersAssigned)
                        return true
                    }
                })
            }
        })

        return this.jobToJobbersAssigned
    }*/

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

    public async showingResult(assignment: Assignments) {
        const jobs = await Promise.all(
            Object.keys(assignment).map(key => JobDAL.getById(Number(key)))
        );
        
        for (let i = 0; i < Object.entries(assignment).length; i++) {
            const [key, values] = Object.entries(assignment)[i]
            const job: any = jobs[i]
            
            for (const value of values) {
                const jobber: any = await JobberDAL.getById(Number(value))
                const variables = await JobberDAL.getTandD(Number(key), Number(value))
                
                console.log(`${jobber.name} => ${job.name}`)
                console.log(variables)
            }
        }
    }
    

    public async chooseTasks(workspace_id: number) {
        let jobs = await JobDAL.getAllByWorkspace(workspace_id)
        const jobbersData = await JobberDAL.getAll() as Jobber[]
        //let jobbers = jobbersData
        //console.log(jobbers)
        let jobbers = this.shuffleArray(jobbersData)

        //const jobToJobbersAssigned = {}
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
                        if (job.id in this.jobToJobbersAssigned) {
                            this.jobToJobbersAssigned[job.id].push(jobber.id)
                        } else {
                            this.jobToJobbersAssigned[job.id] = [jobber.id]
                        }

                        if (this.jobToJobbersAssigned[job.id].length == job.num_jobbers) {
                            jobs = jobs.filter(jobFilter => jobFilter.id !== job.id)
                        }

                        jobbers = jobbers.filter(jobberFilter => jobberFilter.id !== jobber.id)

                        const confirmRelation = await JobberDAL.getTandD(job.id, jobber.id)

                        console.log(`${jobber.name} → ${job.name}`);
                        console.log(confirmRelation)
                    }
                }
            }
        }

        console.log(this.jobToJobbersAssigned)
        //const check = await this.verifyResults(this.jobToJobbersAssigned)
        console.log("Checkando função")
        const test = await this.fixInvalidAssignments(this.jobToJobbersAssigned)
        console.log(test)
        console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=")
        this.showingResult(test)
    
        /*while (!await this.verifyResults(jobToJobbersAssigned)) {
            await this.chooseTasks(1)
        }*/
        setTimeout(() => {
            this.insertMatches(test)
        }, 200)

    }
}

export default new AlgorithmController()
