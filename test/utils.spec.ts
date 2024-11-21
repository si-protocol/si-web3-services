import { Test, TestingModule } from '@nestjs/testing';
import moment from 'moment';
import { DataUtil } from '../src/utils/datautil';
import { generateUniqueCode } from '../src/utils/crypto';
import BigNumber from 'bignumber.js';

jest.setTimeout(30000);

function canSettle(startAt: Date, endAt: Date, settleAt: Date) {
  if (moment(startAt).isAfter(settleAt)) {
    console.log('Order Task is not start');
    return false;
  }

  if (moment(settleAt).isSameOrAfter(endAt)) {
    console.log('Order Task is end');
    return false;
  }
  return true;
}

describe('Utils', () => {
  let res: any;
  beforeEach(async () => {
    console.log('beforeEach');
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [],
    }).compile();
  });

  afterEach(async () => {
    console.log('afterEach');
    // clean
  });

  it('moment', async () => {
    const nowDay = DataUtil.nowDay();
    console.log('now day:', nowDay.toISOString());

    const month = DataUtil.truncMonth(new Date());
    console.log('month day:', month.toISOString());

    const nextMonth = moment(month).add(1, 'M').toDate();
    console.log('next month day:', nextMonth.toISOString());

    const tmpDay = DataUtil.truncDay(new Date('2024-04-02T01:02:03.000Z'));
    console.log('2024-04-02 day:', tmpDay.toISOString());
    expect(tmpDay.toISOString()).toEqual('2024-04-02T00:00:00.000Z');

    const previousDay = moment(tmpDay).subtract(1, 'd').toDate();
    console.log('the previous day:', previousDay);
    expect(previousDay.toISOString()).toEqual('2024-04-01T00:00:00.000Z');

    const startAt = moment(tmpDay).add(1, 'd').toDate();
    console.log('start at:', startAt);
    expect(startAt.toISOString()).toEqual('2024-04-03T00:00:00.000Z');

    const endAt = moment(startAt).add(1, 'd').toDate();
    console.log('end at:', endAt);
    expect(endAt.toISOString()).toEqual('2024-04-04T00:00:00.000Z');

    const settleAt = moment(startAt).add(1, 'd').toDate();
    console.log('settle at:', settleAt);
    res = canSettle(startAt, endAt, settleAt);
    console.log('settle result :', res);

    res = moment(startAt).isSameOrAfter(startAt);
    console.log('res:', res);
    res = moment(endAt).isSameOrAfter(startAt);
    console.log('res:', res);
    res = moment(startAt).isSameOrAfter(endAt);
    console.log('res:', res);
  });

  it.only('settle', async () => {
    const tmpDay = DataUtil.truncDay(new Date('2024-04-02T01:02:03.000Z'));
    console.log('2024-04-02 day:', tmpDay.toISOString());
    expect(tmpDay.toISOString()).toEqual('2024-04-02T00:00:00.000Z');

    const startAt = moment(tmpDay).add(1, 'd').toDate();
    console.log('start at:', startAt);
    expect(startAt.toISOString()).toEqual('2024-04-03T00:00:00.000Z');

    const endAt = moment(startAt).add(1, 'd').toDate();
    console.log('end at:', endAt);
    expect(endAt.toISOString()).toEqual('2024-04-04T00:00:00.000Z');

    res = canSettle(startAt, endAt, moment(startAt).subtract(1, 'd').toDate());
    console.log('settle startAt-1 result :', res);
    expect(res).toEqual(false);

    res = canSettle(startAt, endAt, startAt);
    console.log('settle startAt result :', res);
    expect(res).toEqual(true);

    res = canSettle(startAt, endAt, endAt);
    console.log('settle endAt result :', res);
    expect(res).toEqual(false);

    res = canSettle(startAt, endAt, moment(endAt).add(1, 'd').toDate());
    console.log('settle endAt+1 result :', res);
    expect(res).toEqual(false);

    res = moment(endAt).diff(startAt, 'day');
    console.log('diff day:', res);
    expect(res).toEqual(1);
  });

  it('generateUniqueCode', async () => {
    for (let i = 0; i < 2; i++) {
      res = generateUniqueCode();
      console.log(res);
    }
  });

  it('BigNumber', async () => {
    // res = BigNumber('10').plus(2).plus('3').toFixed();
    // console.log(res);
    // res = BigNumber(10).isGreaterThan(5);
    // console.log(res);
    // res = BigNumber(2).multipliedBy(2).toFixed();
    // console.log(res);
    // res = BigNumber(2).shiftedBy(3).toFixed();
    // console.log(res);
    const feeRate = new BigNumber(0.001);
    const quantity = new BigNumber(0.5).shiftedBy(9);
    const amount = quantity.multipliedBy(new BigNumber(1).minus(feeRate)).toFixed();
    console.log(amount);
  });

  it.only('time', async () => {
    const dateStr = '2024-02-01';
    const m = moment.utc(dateStr);
    const utcString = m.format();
    console.log('time', utcString);
    console.log(m.toDate());
  });
});
