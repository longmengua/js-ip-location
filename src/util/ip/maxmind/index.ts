import * as g from 'glob';
import { MaxmindIpLocation } from './parser/location';
import { IpLocationType } from '../interface';

export class Maxmind {
  private static ipLocation: IpLocationType = new MaxmindIpLocation();
  private static isLoaded: boolean = false;


  private static logger?: (msg: any) => any = undefined;

  /**
   * @param callback function
  */
  public static initLogger(logCallback: (msg: any) => any): void {
    if (logCallback) {
      this.logger = logCallback
    }
  }

  /**
   * @param file string, xxx.dat
  */
  public static async loadIpResource() {
    const wildcardPattern = '**/*.mmdb';
    try {
      const fileNames = await g.glob(wildcardPattern)
      const file = fileNames[0]

      this.ipLocation.initFromFile(file);
      this.isLoaded = true

      this.logger && this.logger(`[${file}] has been loaded`)
    } catch (error) {
      this.logger && this.logger(error)
    }
  }

  public static findByIp(ip: string) {
    if (!this.isLoaded) {
      this.logger && this.logger('ip resource file is not loaded')
      return undefined
    }
    const result = this.ipLocation.find(ip);
    return result ? result : undefined
  }

  public static findAll() {
    return this.ipLocation.findAll()
  }
}