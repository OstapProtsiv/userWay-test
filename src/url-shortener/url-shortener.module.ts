import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortenerEntity } from './entities/url-shortener.entity';
import { UrlShortenerRepository } from './repositories/url-shortener.repository';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([UrlShortenerEntity])],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, UrlShortenerRepository],
})
export class UrlShortenerModule {}
