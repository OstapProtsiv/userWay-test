import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';

@Controller('url/shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createUrlShortenerDto: CreateUrlShortenerDto,
  ) {
    return this.urlShortenerService.shortenUrl(createUrlShortenerDto);
  }

  @Get()
  findOne(@Query('url') shortenedUrl: string) {
    return this.urlShortenerService.retrieveUrl(shortenedUrl);
  }
}
