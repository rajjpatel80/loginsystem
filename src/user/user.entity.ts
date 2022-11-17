import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as crypto from 'crypto';

@Entity('usermaster')
export class userMasterEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({ length: 255 })
  @IsEmail()
  @IsNotEmpty()
  eMail: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  password: string;

  @Column({ nullable: false, length: 1, default: 'U'})
  userCat: string;

  @Column({ length: 50 })
  fName: string;

  @Column({ nullable: true, length: 50, default: '' })
  mName: string;

  @Column({ nullable: true, length: 50, default: '' })
  lName: string;

  @Column({ nullable: true, length: 30, default: 0 })
  mobileNo: string;

  @Column({ nullable: true, length: 500, default: '' })
  address: string;

  @Column({ nullable: true, default: 0 })
  city_Id: number;

  @Column({ nullable: true, default: 0 })
  pinCode: number;

  @Column({ nullable: true, default: 0 })
  state_Id: number;

  @Column({ nullable: true, default: 0 })
  country_Id: number;

  @Column({ nullable: true, default: 0 })
  comp_Id: number;

  @Column({ nullable: true, default: '' })
  rmk: string;

  @Column({ nullable: true, length: 100, default: 'T' })
  status: string;

  @Column({ nullable: false, default: '' })
  createDate: string;

  @Column({ nullable: false, default: '' })
  updateDate: string;
}

@Entity('passport')
export class passportEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column({ nullable: false, length: 255, default: '' })
  eMail: string;

  @Column({ nullable: false, length: 255 })
  password: string;

  @Column({ nullable: false, length: 1, default: 'U'})
  userCat: string;
    
  @Column({ nullable: false, length: 1000, default: '' })
  accessToken: string;

  @Column({ nullable: false, length: 1000, default: '' })
  refreshToken: string;

  @Column({ nullable: false, length: 100 })
  protocol: string;

  @Column({ nullable: true, length: 100, default: '' })
  provider: string;

  @Column({ nullable: true, length: 1, default: 'T' })
  status: string;

  @Column({ nullable: false, length: 25, default: '' })
  createDate: string;

  @Column({ nullable: false, length: 25, default: '' })
  updateDate: string;

  @Column({ nullable: true, length: 1000, default: '' })
  fireToken: String;
}

