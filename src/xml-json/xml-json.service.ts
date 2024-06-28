import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { Make } from '../entities/make.entity';
import { VehicleType } from '../entities/vehicle-type.entity';

@Injectable()
export class XmlJsonService {
  constructor(
    @InjectRepository(Make)
    private makeRepository: Repository<Make>,
    @InjectRepository(VehicleType)
    private vehicleTypeRepository: Repository<VehicleType>,
  ) {}

  private async fetchXml(url: string): Promise<string> {
    const response = await axios.get(url);
    return response.data;
  }

  private async parseXml(xml: string): Promise<any> {
    return await parseStringPromise(xml);
  }

  private async fetchAllMakes(): Promise<any[]> {
    const makesXml = await this.fetchXml('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML');
    const makesJson = await this.parseXml(makesXml);
    return makesJson.Response.Results[0].AllVehicleMakes.map(make => ({
      makeId: make.Make_ID[0],
      makeName: make.Make_Name[0]
    }));
  }

  public async transformXmlToJson(page: number = 1, limit: number = 50): Promise<any> {
    const allMakes = await this.fetchAllMakes();
    const paginatedMakes = allMakes.slice((page - 1) * limit, page * limit);

    const vehicleTypes = await this.processInBatches(paginatedMakes, limit, async (make) => {
      const xml = await this.fetchXml(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${make.makeId}?format=xml`);
      return this.parseXml(xml);
    });

    const result = paginatedMakes.map((make, index) => ({
        makeId: make.makeId,
        makeName: make.makeName,
        vehicleTypes: parseInt(vehicleTypes[index].Response.Count[0]) ? vehicleTypes[index].Response.Results[0].VehicleTypesForMakeIds.map(vehicleType => ({
          typeId: parseInt(vehicleType.VehicleTypeId[0]),
          typeName: vehicleType.VehicleTypeName[0]
        })) : []
      }));

    await this.saveToDatabase(result);

    return result;
  }

  async processInBatches<T>(items: T[], batchSize: number, callback: (item: T) => Promise<any>): Promise<any[]> {
    let results: any[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(callback));
      results = results.concat(batchResults);
    }

    return results;
  }

  private async saveToDatabase(data: any): Promise<void> {
    for (const makeData of data) {
      let make = await this.makeRepository.findOne({ where: { makeId: makeData.makeId }, relations: ['vehicleTypes'] });

      if (!make) {
        make = new Make();
        make.makeId = makeData.makeId;
        make.makeName = makeData.makeName;
      } else {
        make.makeName = makeData.makeName;
      }

      make.vehicleTypes = await Promise.all(makeData.vehicleTypes.map(async vtData => {
        let vehicleType = await this.vehicleTypeRepository.findOne({ where: { typeId: vtData.typeId } });

        if (!vehicleType) {
          vehicleType = new VehicleType();
          vehicleType.typeId = vtData.typeId;
          vehicleType.typeName = vtData.typeName;
        } else {
          vehicleType.typeName = vtData.typeName;
        }

        return vehicleType;
      }));

      await this.makeRepository.save(make);
    }
  }
}
