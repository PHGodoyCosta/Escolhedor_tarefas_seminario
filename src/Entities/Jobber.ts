import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { RelationJobberJob } from "./RelationJobberJob";

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
}
