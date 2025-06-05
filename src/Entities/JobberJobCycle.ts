import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Jobber } from "./Jobber";
import { JobCycle } from "./JobCycle";

@Entity()
export class JobberJobCycle {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Jobber, jobber => jobber.jobCycles)
    jobber: Jobber;

    @ManyToOne(() => JobCycle, cycle => cycle.jobbers)
    cycle: JobCycle;
}