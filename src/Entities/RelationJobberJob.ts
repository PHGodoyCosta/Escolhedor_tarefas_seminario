import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm';
import { Job } from './Job';
import { Jobber } from './Jobber';

@Entity('relation_jobber_jobs')
export class RelationJobberJob {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Jobber, jobber => jobber.relations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobber_id' })
    jobber: Jobber;

    @ManyToOne(() => Job, job => job.relations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @CreateDateColumn()
    created_at: Date
}
