import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { RelationJobberJob } from "./RelationJobberJob";
import { JobberJobCycle } from "./JobberJobCycle";

@Entity('jobber')
export class Jobber {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    hash: string

    @Column()
    name: string

    @OneToMany(() => RelationJobberJob, relation => relation.jobber)
    relations: RelationJobberJob[];

    @OneToMany(() => JobberJobCycle, jjc => jjc.jobber)
    jobCycles: JobberJobCycle[];
}
