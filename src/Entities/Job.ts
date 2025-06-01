import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Workspace } from './Workspace';
import { RelationJobberJob } from './RelationJobberJob';

@Entity('jobs')
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hash: string;

    @Column()
    name: string;

    @Column({
        default: 1
    })
    num_jobbers: number

    @ManyToOne(() => Workspace, workspace => workspace.jobs, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'workspace_id' })
    workspace: Workspace;

    @OneToMany(() => RelationJobberJob, relation => relation.job)
    relations: RelationJobberJob[];
}
