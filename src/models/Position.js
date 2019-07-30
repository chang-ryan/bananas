import {
  Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export @Entity() class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;
}
