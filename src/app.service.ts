import { Injectable } from '@nestjs/common';
import { Effect } from './schema/interfaces/effect.interface';
import { Quality } from './schema/interfaces/quality.interface';

@Injectable()
export class AppService {
  getQualities(schema: any): Quality[] {
    const qualities: Quality[] = [];

    for (const internal in schema.qualityNames) {
      const name = schema.qualityNames[internal];
      const id = schema.qualities[internal];

      qualities.push({ id, name });
    }

    return qualities;
  }

  getEffects(schema: any): Effect[] {
    return schema.attribute_controlled_attached_particles;
  }
}
