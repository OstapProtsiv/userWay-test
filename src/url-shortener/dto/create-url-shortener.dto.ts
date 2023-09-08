import { PickType } from '@nestjs/mapped-types';
import { UrlShortenerEntity } from '../entities/url-shortener.entity';

export class CreateUrlShortenerDto extends PickType(UrlShortenerEntity, [
  'fullUrl',
]) {}
