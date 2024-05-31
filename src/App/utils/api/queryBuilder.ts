import { QueryExpression, SearchQuery } from './types';

type KeyExpr = 'and' | 'or' | 'not' | 'filter';

export default class QueryBuilder {
  private obj: SearchQuery | undefined;
  private arr: (QueryExpression | SearchQuery)[];
  constructor(expr?: KeyExpr) {
    if (expr) {
      this.obj = { [expr]: [] };
      this.arr = this.obj[`${expr}`]!;
    } else {
      this.arr = [];
    }
  }

  fullText(field: string, language: string, value: string, mustMatch: 'all' | 'any' = 'all') {
    this.arr.push({ fullText: { field, language, value, mustMatch } });
    return this;
  }
  exact(field: string, language: string, value: string, caseInsensitive: boolean = false) {
    this.arr.push({ exact: { field, language, value, caseInsensitive } });
    return this;
  }
  prefix(field: string, language: string, value: string, caseInsensitive: boolean = false) {
    this.arr.push({ prefix: { field, language, value, caseInsensitive } });
    return this;
  }
  range(field: string, range: { [operator in 'gt' | 'lt' | 'gte' | 'lte']: string }) {
    this.arr.push({ range: Object.assign({ field }, range) });
    return this;
  }
  /**
   * @param '*' for zero, one, or more characters. '?' for exactly one character.
   */
  wildcard(field: string, language: string, value: string, caseInsensitive: boolean = false) {
    this.arr.push({ wildcard: { field, language, value, caseInsensitive } });
    return this;
  }
  exists(field: string) {
    this.arr.push({ exist: { field } });
    return this;
  }
  expression(obj: SearchQuery) {
    this.arr.push(obj);
    return this;
  }
  get() {
    if (this.obj) {
      return this.obj;
    } else {
      return this.arr[0];
    }
  }
}
