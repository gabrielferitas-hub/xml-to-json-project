import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { VehicleType } from './vehicle-type.entity';

@Entity()
export class Make {
  @PrimaryColumn()
  makeId: number;

  @Column()
  makeName: string;

  @ManyToMany(() => VehicleType, vehicleType => vehicleType.makes, { cascade: true })
  @JoinTable({
    name: 'make_vehicle_type_relation',
    joinColumn: {
      name: 'makeId',
      referencedColumnName: 'makeId'
    },
    inverseJoinColumn: {
      name: 'typeId',
      referencedColumnName: 'typeId'
    }
  })
  vehicleTypes: VehicleType[];
}
