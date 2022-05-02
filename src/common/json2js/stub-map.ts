
export class StubMap<K, V> extends Map<K, V>{
  isStub = true;
  private readonly noDefined: V;
  get size(){
    return 0;
  };
  clear(): void{
    /**/
  }
  delete(_key: K): boolean{
    return true;
  }
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void{
    /**/
  }
  get(key: K): V | undefined{
    return this.noDefined;
  }
  has(key: K): boolean{
    return false;
  }
  set(key: K, value: V): this{
    return this;
  }
}
