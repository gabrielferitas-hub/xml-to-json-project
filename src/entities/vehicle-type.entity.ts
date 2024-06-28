import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Make } from './make.entity';

@Entity()
export class VehicleType {
  @PrimaryColumn()
  typeId: number;

  @Column()
  typeName: string;

  @ManyToMany(() => Make, make => make.vehicleTypes)
  makes: Make[];
}
