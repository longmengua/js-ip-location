import * as fs from 'fs';
import * as maxmind from '@maxmind/geoip2-node'
import { IpLocationType } from '../../interface';

export class MaxmindIpLocation implements IpLocationType {
  private reader: maxmind.ReaderModel | undefined

  public initFromFile(file: string): void {
    const dbBuffer = fs.readFileSync(file);
    this.reader = maxmind.Reader.openBuffer(dbBuffer)
  }

  find(ip: string) {
    if (!this.reader) {
      return undefined
    }
    return this.reader.city(ip)
  }

  findAll() {
    return undefined
  }
  
}
