const _cache: Record<string, any> = {};

export class CacheService {
  async load(key: string, def?: any) {
    const res: any = {}; //todo await findOne({ key: key });
    // console.log('load', key, res, def);
    let val: any = '';
    if (!res && def !== undefined) {
      val = def;
    } else if (res) {
      val = res.val;
    }
    _cache[key] = val;
    return val;
  }

  async loadNumber(key: string, def?: number): Promise<number> {
    return Number(await this.load(key, def));
  }

  async loadString(key: string, def?: string): Promise<string> {
    return (await this.load(key, def)) + '';
  }

  async cache(key: string, val?: any) {
    if (val === undefined) {
      if (_cache[key]) {
        return _cache[key];
      }
      const res: any = {}; // todo await this.findOne({ key: key });
      if (res) {
        _cache[key] = res.val;
        val = _cache[key];
      }
    } else {
      // todo await this.save({ key: key, val: val }, { key: key });
    }
    return val;
  }
}

export const cacheService = new CacheService();
