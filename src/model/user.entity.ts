import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Unique
  } from 'typeorm';
  
  @Entity('user')
  @Unique(['identification'])
  export class User {
  
    @PrimaryGeneratedColumn({
      name: 'user_id'
    })
    user_Id: number;
  
    @Column()
    identification: string;
  
    @Column({
      name: 'firstName'
    })
    firstName: string;

    @Column({
      name: 'lastName'
    })
    lastName: string;
  
    @Column()
    email: string;

    @Column()
    password: string;
}
  