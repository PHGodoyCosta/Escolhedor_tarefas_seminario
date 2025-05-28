import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity('workspaces')
class Workspace {
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
}

export default Workspace