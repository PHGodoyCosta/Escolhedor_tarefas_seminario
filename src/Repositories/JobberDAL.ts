import { dataSource } from "../../ormconfig";
import { Jobber } from "../Entities/Jobber";
import { RelationJobberJob } from "../Entities/RelationJobberJob";
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

    getAllForJob = (job_id: number) => {
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
    }

    getTandD = async(jobId: number, jobberId: number) => {
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
                d = 0;
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
    }
}

export default new JobberDAL()