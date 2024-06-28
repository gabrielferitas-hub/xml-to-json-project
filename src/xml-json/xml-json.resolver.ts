import { Resolver, Query, Args } from '@nestjs/graphql';
import { XmlJsonService } from './xml-json.service';
import { MakeType } from '../graphql/make-type';
import { PaginationInput } from '../graphql/pagination-input';

@Resolver(() => MakeType)
export class XmlJsonResolver {
  constructor(private readonly xmlJsonService: XmlJsonService) {}

  @Query(() => [MakeType])
  async getAllMakesAndVehicleTypes(
    @Args('pagination', { type: () => PaginationInput }) pagination: PaginationInput,
  ) {
    const { page, limit } = pagination;
    return await this.xmlJsonService.transformXmlToJson(page, limit);
  }
}
