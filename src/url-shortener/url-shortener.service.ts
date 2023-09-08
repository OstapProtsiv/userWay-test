import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UrlShortenerRepository } from './repositories/url-shortener.repository';
import { RedisService } from '../redis/redis.service';
import { URL } from 'url';
import * as crypto from 'crypto';

@Injectable()
export class UrlShortenerService {
  constructor(
    private readonly urlShortenerRepository: UrlShortenerRepository,
    private readonly redisService: RedisService,
  ) {}

  async shortenUrl({ fullUrl }: CreateUrlShortenerDto): Promise<string> {
    const url = new URL(fullUrl);
    const hash = crypto
      .createHash('md5')
      .update(url.host)
      .digest('hex')
      .substring(0, 6);

    await this.redisService.set(hash, url.host);
    await this.urlShortenerRepository.saveShortenedURL(url.host, hash);

    return this.replaceBaseUrl(url, hash);
  }

  async retrieveUrl(shortenedUrl: string): Promise<string> {
    const url = new URL(shortenedUrl);
    const host = url.host;

    let fullUrl = await this.redisService.get(host);

    if (!fullUrl) {
      const dbRecord = await this.urlShortenerRepository.getFullUrl(host);

      if (!dbRecord) {
        throw new HttpException('Full URL was not found', HttpStatus.NOT_FOUND);
      }

      fullUrl = dbRecord.fullUrl;
    }

    return this.replaceBaseUrl(url, fullUrl);
  }

  private replaceBaseUrl(url: URL, baseUrl: string): string {
    return `${url.protocol}//${baseUrl}${url.pathname}`;
  }
}
