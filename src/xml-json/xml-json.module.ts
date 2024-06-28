import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XmlJsonService } from './xml-json.service';
import { XmlJsonResolver } from './xml-json.resolver';
import { Make } from '../entities/make.entity';
import { VehicleType } from '../entities/vehicle-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Make, VehicleType])],
  providers: [XmlJsonService, XmlJsonResolver],
})
export class XmlJsonModule {}
