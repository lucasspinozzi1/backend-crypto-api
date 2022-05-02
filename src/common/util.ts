export const isEmptyString = function<T>(value: T): boolean {
  return typeof value === 'string' && value === '';
};

export const choose = function<T>(value: T, alternative: T): T {
  if(value !== null && typeof value !== 'undefined' && !isEmptyString(value)){
    return value;
  }
  return alternative;
};

export const orThrow = function<T>(value: T, reason: string): T {
  if(value !== null && typeof value !== 'undefined' && !isEmptyString(value)){
    return value;
  }
  throw new Error(reason);
};

export const chooseArray = function<T>(value: unknown, alternative: Array<T>): Array<T> {
  if(Array.isArray(value)){
    return value;
  }
  return alternative;
};

export const exist = function(value: unknown): boolean {
  return value != null && typeof value !== 'undefined';
};
