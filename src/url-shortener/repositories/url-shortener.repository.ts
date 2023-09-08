import { DataSource, EntityManager, EntityTarget, Repository } from 'typeorm';
import { UrlShortenerEntity } from '../entities/url-shortener.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlShortenerRepository extends Repository<UrlShortenerEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UrlShortenerEntity, dataSource.createEntityManager());
  }

  async saveShortenedURL(
    fullUrl: string,
    shortenedUrl: string,
  ): Promise<UrlShortenerEntity> {
    return this.save({ fullUrl, shortenedUrl });
  }

  async getFullUrl(shortenedUrl: string): Promise<UrlShortenerEntity> {
    return this.findOne({
      where: { shortenedUrl },
    });
  }
}
