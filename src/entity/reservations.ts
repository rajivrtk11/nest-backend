import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Bike from "./bike";
import User from "./user";

@Entity({ name: 'reservation'})
export default class Reservation extends BaseEntity{
    @PrimaryGeneratedColumn() id: number;
    @Column() userId: number;
    @Column() bikeId: number;
    @Column() fromDate: string;
    @Column() toDate: string;
    @Column({ default: 'ACTIVE'}) status: 'ACTIVE' | 'INACTIVE';
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId', referencedColumnName: 'id'})
    user: User;

    @ManyToOne(() => Bike)
    @JoinColumn({ name: 'bikeId', referencedColumnName: 'id'})
    bike: Bike;
}