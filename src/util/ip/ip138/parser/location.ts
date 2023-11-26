import * as fs from 'fs';
import { IpLocationType } from '../../interface';

export class Ip138Location implements IpLocationType {
  private index: number[] = [];
  private ipEndArr: number[] = [];
  private textOffset: number[] = [];
  private textlen: number[] = [];
  private textData: Buffer = Buffer.from('');

  public initFromFile(file: string): void {
    const data: Buffer = fs.readFileSync(file);
    const textoffset: number = data.readUInt32LE(0);
    this.textData = data.slice(textoffset);

    const count: number = (textoffset - 4 - 256 * 4) / 9;
    this.index = new Array(256);

    for (let i = 0; i < 256; i++) {
      const off: number = 4 + i * 4;
      this.index[i] = data.readUInt32LE(off);
    }

    this.ipEndArr = new Array(count);
    this.textOffset = new Array(count);
    this.textlen = new Array(count);

    for (let i = 0; i < count; i++) {
      const off: number = 4 + 1024 + i * 9;
      this.ipEndArr[i] = data.readUInt32LE(off);
      this.textOffset[i] = data.readUInt32LE(off + 4);
      this.textlen[i] = data.readUInt8(off + 8);
    }
  }

  public findByUint(ip: number): string {
    let end: number = 0;

    if ((ip >>> 24) !== 0xff) {
      end = this.index[(ip >>> 24) + 1];
    }


    if (end === 0) {
      end = this.ipEndArr.length;
    }

    const idx: number = this.findIndexOffset(ip, this.index[ip >>> 24], end);
    const off: number = this.textOffset[idx];
    const result = this.textData.slice(off, off + this.textlen[idx]).toString();
    return result
  }

  private findIndexOffset(ip: number, start: number, end: number): number {
    while (start < end) {
      const mid: number = (start + end) >>> 1;
      if (ip > this.ipEndArr[mid]) {
        start = mid + 1;
      } else {
        end = mid;
      }
    }

    if (this.ipEndArr[end] >= ip) {
      return end;
    }

    return start;
  }

  public find(ipstr: string) {
    const ip: Buffer = Buffer.from(ipstr.split('.').map(Number));
    if (!ip || ip.length !== 4) {
      return undefined;
    }

    // value = (arr[0] * 256^3) + (arr[1] * 256^2) + (arr[2] * 256^1) + arr[3]
    // value = (61 * 256^3) + (216 * 256^2) + (90 * 256^1) + 1 = 1023916321
    const locationStr: string = this.findByUint(ip.readUInt32BE());
    const arr = locationStr.split('\t')

    return {
      country: arr.length > 0 ? arr[0] : "",
      city: arr.length > 1 ? arr[1] : "",
      town: arr.length > 2 ? arr[2] : "",
    };
  }

  private getIpFromIndex(index: number): string {
    const ipEnd = this.ipEndArr[index];
    const ipBytes = new Array(4);
  
    for (let i = 0; i < 4; i++) {
      ipBytes[i] = ((ipEnd >>> (24 - i * 8)) & 0xFF).toString();
    }
  
    return ipBytes.join('.');
  }

  public findAll() {
    const results = [];
  
    for (let i = 0; i < this.ipEndArr.length/100; i++) {
      const off: number = this.textOffset[i];
      const locationStr: string = this.textData.slice(off, off + this.textlen[i]).toString();
      const arr = locationStr.split('\t');
  
      results.push({
        // the amount of data is huge, so once this field opened, will cause error
        // you can open this with a limitated amount, like change this this.ipEndArr.length => 1000
        ip: this.getIpFromIndex(i),
        country: arr.length > 0 ? arr[0] : "",
        city: arr.length > 1 ? arr[1] : "",
        town: arr.length > 2 ? arr[2] : "",
      });
    }
  
    return results.slice(2, results.length);
  }
}
