export interface IpLocationType {
  find: (ip: string) => any
  findAll: () => any
  initFromFile: (file: string) => void
}