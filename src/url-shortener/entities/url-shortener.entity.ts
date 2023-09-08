import { IsString, IsUrl } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'url_shorten' })
export class UrlShortenerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsUrl({}, { message: 'Invalid URL format' })
  fullUrl: string;

  @Column()
  @IsString()
  shortenedUrl: string;
}
