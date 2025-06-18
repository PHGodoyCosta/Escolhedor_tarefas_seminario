import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Job } from "./Job";
import { JobberJobCycle } from "./JobberJobCycle";

@Entity()
export class JobCycle {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Job, job => job.cycles)
    job: Job

    @Column()
    date: Date

    @OneToMany(() => JobberJobCycle, jjc => jjc.cycle)
    jobbers: JobberJobCycle[];
    
}