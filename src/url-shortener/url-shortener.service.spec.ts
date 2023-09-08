import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerRepository } from './repositories/url-shortener.repository';
import { RedisService } from '../redis/redis.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import * as crypto from 'crypto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;

  const urlShortenerRepositoryMock = {
    saveShortenedURL: jest.fn(),
    getFullUrl: jest.fn(),
  };

  const redisServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: UrlShortenerRepository,
          useValue: urlShortenerRepositoryMock,
        },
        {
          provide: RedisService,
          useValue: redisServiceMock,
        },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('shortenUrl', () => {
    it('should shorten a URL', async () => {
      urlShortenerRepositoryMock.saveShortenedURL.mockResolvedValueOnce({});
      const mockedHost = 'example.com';
      const dto: CreateUrlShortenerDto = {
        fullUrl: `https://${mockedHost}/full-url`,
      };
      const result = await service.shortenUrl(dto);

      expect(urlShortenerRepositoryMock.saveShortenedURL).toHaveBeenCalledWith(
        mockedHost,
        expect.any(String),
      );
      expect(redisServiceMock.set).toHaveBeenCalledWith(
        expect.any(String),
        mockedHost,
      );
      expect(result).toMatch(/^https:\/\/.+/);
    });
  });

  describe('retrieveUrl', () => {
    it('should retrieve a URL from redis', async () => {
      const mockedFullUrl = 'full-url';
      redisServiceMock.get.mockResolvedValueOnce('full-url');
      const mockedHost = '8z2cd3';
      const shortenedUrl = `https://${mockedHost}/shortenedUrl`;
      const result = await service.retrieveUrl(shortenedUrl);

      expect(redisServiceMock.get).toHaveBeenCalledWith(mockedHost);
      expect(result).toMatch(new RegExp(`^https:\/\/${mockedFullUrl}.+`));
    });

    it('should retrieve a URL from postgres', async () => {
      const mockedFullUrl = 'full-url';
      urlShortenerRepositoryMock.getFullUrl.mockResolvedValueOnce({
        fullUrl: 'full-url',
      });
      const mockedHost = '8z2cd3';
      const shortenedUrl = `https://${mockedHost}/shortenedUrl`;
      const result = await service.retrieveUrl(shortenedUrl);

      expect(urlShortenerRepositoryMock.getFullUrl).toHaveBeenCalledWith(
        mockedHost,
      );
      expect(result).toMatch(new RegExp(`^https:\/\/${mockedFullUrl}.+`));
    });

    it('should throw not found exception', async () => {
      redisServiceMock.get.mockResolvedValue(null);

      urlShortenerRepositoryMock.getFullUrl.mockResolvedValue(null);

      const shortenedUrl = 'https://example.com/abc123';

      try {
        await service.retrieveUrl(shortenedUrl);
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Full URL was not found');
      }
    });
  });
});
