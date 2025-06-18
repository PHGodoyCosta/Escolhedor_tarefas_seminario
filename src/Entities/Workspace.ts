import { PrimaryGeneratedColumn, Entity, Column, OneToMany } from "typeorm";
import { Job } from "./Job";

@Entity('workspaces')
export class Workspace {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: false
    })
    hash: string

    @Column({
        nullable: false
    })
    name: string

    @OneToMany(() => Job, job => job.workspace)
    jobs: Job[];
}