import { ObjectType, Field } from '@nestjs/graphql';
import { VehicleType } from './vehicle-type';


@ObjectType()
export class MakeType {
  @Field()
  makeId: string;

  @Field()
  makeName: string;

  @Field(() => [VehicleType])
  vehicleTypes: VehicleType[];
}
