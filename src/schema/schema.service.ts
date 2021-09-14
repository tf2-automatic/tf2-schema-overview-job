import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { Effect } from './interfaces/effect.interface';
import { Quality } from './interfaces/quality.interface';

@Injectable()
export class SchemaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<Config>,
  ) {}

  getSchemaOverview(): Promise<any> {
    return this.httpService
      .get(
        'https://api.steampowered.com/IEconItems_440/GetSchemaOverview/v0001/',
        {
          params: {
            key: this.configService.get<string>('steamApiKey'),
            language: 'English',
          },
          responseType: 'json',
        },
      )
      .toPromise()
      .then((response) => response.data);
  }

  async saveQualities(qualities: Quality[]): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').tf2Schema
    }/qualities`;

    await this.httpService
      .post<any>(url, {
        qualities,
      })
      .toPromise();
  }

  async saveEffects(effects: Effect[]): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').tf2Schema
    }/effects`;

    await this.httpService
      .post<any>(url, {
        effects,
      })
      .toPromise();
  }
}
