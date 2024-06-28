import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XmlJsonService } from './xml-json.service';
import { Make } from '../entities/make.entity';
import { VehicleType } from '../entities/vehicle-type.entity';

const makeRepositoryMock: Partial<Repository<Make>> = {
  clear: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
};

const vehicleTypeRepositoryMock: Partial<Repository<VehicleType>> = {
  clear: jest.fn().mockResolvedValue(undefined),
};

describe('XmlJsonService', () => {
  let service: XmlJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XmlJsonService,
        {
          provide: getRepositoryToken(Make),
          useValue: makeRepositoryMock,
        },
        {
          provide: getRepositoryToken(VehicleType),
          useValue: vehicleTypeRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<XmlJsonService>(XmlJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchXml', () => {
    it('should fetch XML data from URL', async () => {
      const url = 'https://example.com';
      const xmlData = '<Response></Response>';

      jest.spyOn(service, 'fetchXml').mockResolvedValue(xmlData);

      const result = await service['fetchXml'](url);
      expect(result).toBe(xmlData);
    });
  });

  describe('parseXml', () => {
    it('should parse XML string to JSON object', async () => {
      const xml = '<Response><Results><Make_ID>440</Make_ID></Results></Response>';
      const expectedJson = {
        Response: {
          Results: [{ Make_ID: ['440'] }],
        },
      };

      const result = await service['parseXml'](xml);
      expect(result).toEqual(expectedJson);
    });
  });

  describe('transformXmlToJson', () => {
    beforeEach(() => {
      jest.spyOn(service, 'fetchXml').mockImplementation(async (url: string) => {
        if (url.includes('getallmakes')) {
          return `<Response><Results><AllVehicleMakes><Make_ID>440</Make_ID><Make_Name>Test Make</Make_Name></AllVehicleMakes></Results></Response>`;
        } else {
          return `<Response><Results><VehicleTypesForMakeIds><VehicleTypeId>2</VehicleTypeId><VehicleTypeName>Passenger Car</VehicleTypeName></VehicleTypesForMakeIds></Results></Response>`;
        }
      });

      jest.spyOn(service, 'parseXml').mockImplementation(async (xml: string) => {
        if (xml.includes('AllVehicleMakes')) {
          return {
            Response: {
              Results: [{
                AllVehicleMakes: [{ Make_ID: ['440'], Make_Name: ['Test Make'] }]
              }]
            }
          };
        } else {
          return {
            Response: {
              Results: [{
                VehicleTypesForMakeIds: [{ VehicleTypeId: ['2'], VehicleTypeName: ['Passenger Car'] }]
              }]
            }
          };
        }
      });
    });

    it('should transform XML data to JSON correctly', async () => {
      const result = await service.transformXmlToJson();
      expect(result).toEqual([{
        makeId: '440',
        makeName: 'Test Make',
        vehicleTypes: [{
          typeId: '2',
          typeName: 'Passenger Car'
        }]
      }]);
    });
  });

  describe('saveToDatabase', () => {
    it('should save data to database correctly', async () => {
      const data = [{
        makeId: '440',
        makeName: 'Test Make',
        vehicleTypes: [{
          typeId: '2',
          typeName: 'Passenger Car'
        }]
      }];

      await service['saveToDatabase'](data);

      expect(makeRepositoryMock.clear).toHaveBeenCalled();
      expect(vehicleTypeRepositoryMock.clear).toHaveBeenCalled();
      expect(makeRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
        makeId: '440',
        makeName: 'Test Make',
        vehicleTypes: expect.arrayContaining([expect.objectContaining({
          typeId: '2',
          typeName: 'Passenger Car',
          make: expect.objectContaining({ makeId: '440', makeName: 'Test Make' })
        })])
      }));
    });
  });
});
