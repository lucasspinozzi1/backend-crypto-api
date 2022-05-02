
export enum DATETIME {
  /**
   * 2017-04-05T10:43:07+00:00
   * 2018-07-03T14:43:41Z
   */
  ISO_8601 = 'ISO_8601',
  /**
   * Sun, 10 Sep 2017 19:43:31 GMT
   */
  RFC_7231 = 'RFC_7231',
  /**
   * Sat Sep 01 2018 14:53:26 GMT+1400 (LINT)
   */
  ECMA_262 = 'ECMA_262',
  /**
   * number of seconds from 1970-01-01T0:0:0Z UTC
   */
  JSON = 'JSON',
  /**
   * number of millseconds from 1970-01-01T0:0:0Z UTC
   */
  UNIX = 'UNIX'
};

