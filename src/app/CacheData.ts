export class CacheData {
    response: any;
    status: any;
    constructor(json) {
      this.status = json.status;
    }
}