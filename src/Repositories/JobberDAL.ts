import { dataSource } from "../../ormconfig";
import { Jobber } from "../Entities/Jobber";
import { RelationJobberJob } from "../Entities/RelationJobberJob";
import { JobberJobCycle } from "../Entities/JobberJobCycle";
import { JobCycle } from "../Entities/JobCycle";
import { Equal, MoreThan, Not } from "typeorm";

export class JobberDAL {
    getAll = () => {
        return new Promise(async(resolve, reject) => {
            dataSource.manager
                .find(Jobber)
                .then((data: any) => resolve(data))
                .catch((err: Error) => reject(err))
        })
    }

    /*getAllForJob = (job_id: number) => {
        return new Promise(async(resolve, reject) => {
            const jobbers = await dataSource.manager
                                .find(Jobber)
                                .then((data: any) => resolve(data))
                                .catch((error: Error) => reject(error))

            jobbers.forEach(jobber => {
                jobber.push(this.getTandD(job_id, jobber.id))
            });

            return jobbers;
        })
    }*/

    getAllForJob = async(job_id: number) => {
        try {
            const jobbers = await dataSource.manager.find(Jobber)

            const full_jobbers = await Promise.all(
                jobbers.map(async(jobber) => {
                    const { t, d } = await this.getTandD(job_id, jobber.id)
                    return {...jobber, t, d}
                })
            )

            return full_jobbers

        } catch (error) {
            throw new Error(error)
        }
    }

    getJobberByJob = async(job_id: number, jobber_id: number) => {
        try {
            const jobber = await dataSource.manager
                                    .find(Jobber, {
                                        where: {
                                            id: Equal(jobber_id)
                                        }
                                    })

            const { t, d } = await this.getTandD(job_id, jobber_id)
            return {...jobber, t, d}

        } catch (error) {
            throw new Error(error)
        }
    }

    getTandD = async(jobId: number, jobberId: number) => {
        try {
            let d;
            let t = await dataSource
                    .getRepository(JobberJobCycle)
                    .createQueryBuilder("jjc")
                    .innerJoin("jjc.cycle", "cycle")
                    .innerJoin("cycle.job", "job")
                    .where("jjc.jobber.id = :jobberId", { jobberId })
                    .andWhere("job.id = :jobId", { jobId })
                    .getCount();
            
            const cycles = await dataSource
                .getRepository(JobCycle)
                .createQueryBuilder("cycle")
                .where("cycle.job.id = :jobId", { jobId })
                .orderBy("cycle.date", "DESC")
                .getMany();
            
            //console.log(cycles)

            for (let i=0;i<cycles.length;i++) {
                const lastParticipation = await dataSource
                    .getRepository(JobberJobCycle)
                    .createQueryBuilder("jjc")
                    .where("jjc.cycleId = :cycleId", { cycleId: cycles[i].id })
                    .andWhere("jjc.jobberId = :jobberId", { jobberId })
                    .orderBy("jjc.date", "DESC") // ou outro campo de data
                    .getCount();
                
                //console.log(lastParticipation)

                if (lastParticipation > 0) {
                    d = i
                    break
                }
            }

            if (d == undefined) {
                if (cycles.length > 0) {
                    d = cycles.length
                } else {
                    d = 4
                }
            }

            return {
                t: t,
                d: d
            }

        } catch (error) {
            throw new Error(error)
        }
    }
    

    /*getTandD = async(jobId: number, jobberId: number) => {
        try {
            let t = await dataSource.manager.count(RelationJobberJob, {
                where: {
                    job: {
                        id: Equal(jobId)
                    },
                    jobber: {
                        id: Equal(jobberId)
                    }
                }
            })

            if (!t) {
                t = 0
            }

            const lastRelation = await dataSource.manager.findOne(RelationJobberJob, {
                where: {
                    job: { id: jobId },
                    jobber: { id: jobberId }
                },
                order: {
                    created_at: 'DESC'
                }
            });

            let d;

            if (!lastRelation) {
                d = await dataSource.manager.count(RelationJobberJob, {
                    where: {
                        job: {id: jobId}
                    }
                })
            } else {
                d = await dataSource.manager.count(RelationJobberJob, {
                    where: {
                        job: { id: jobId },
                        created_at: MoreThan(lastRelation.created_at),
                        jobber: { id: Not(jobberId) }
                    }
                });
            }

            return {
                t: t,
                d: d
            }

            

        } catch (error) {
            throw new Error(error)
        }
    }*/
}

export default new JobberDAL()
