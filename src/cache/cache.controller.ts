import { Controller, Delete, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CacheService from './cache.service';
import DeleteStatusRO from './ro/delete-status.ro';

@Controller('cache')
@ApiTags('cache')
@ApiBearerAuth()
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * Delete key from redis
   */
  @Delete(':key')
  async destroy(@Param('key') key: string): Promise<DeleteStatusRO> {
    const decodedKey: string = decodeURIComponent(key);

    const result = await this.cacheService.delete(decodedKey);
    if (result) {
      return { success: true };
    }
    throw new HttpException('No matching key found from redis', HttpStatus.NOT_FOUND);
  }
}
