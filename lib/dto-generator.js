/* eslint-disable @typescript-eslint/no-require-imports */

const { readFileSync } = require('fs');
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const glob = require('glob');
const { ts, parseSchema, default: dtsGenerator} = require('dtsgenerator');
const YAML = require('yaml');
const _ = require('lodash');

const exist = function exist(value){
  return typeof value !== 'undefined' && value !== null;
};

const patterns = ['./src/route/**/*openapi.{yml,yaml}'];

const filePathList = patterns
  .map((globString) => {
    return glob.sync(globString);
  })
  .reduce((previous, current) => {
    return previous.concat(current);
  }, []);

if(filePathList.length === 0){
  console.error(`not matching files for pattern: ${  JSON.stringify(patterns, null, 2)}`);
  exit(0);
}

for (const filePath of filePathList) {
  (function(filePath){
    const parsedPath = path.parse(filePath);
    const moduleContext = (function(parsedPath){
      const routeContext = './src/route';
      const index = parsedPath.dir.lastIndexOf(routeContext);
      if(index < 0){
        throw new Error(`unexpected path: ${filePath}`);
      }
      const partial = parsedPath.dir.substring(index + routeContext.length);
      if(partial === ''){
        return [];
      }
      return partial.substring(1).split('/').map((x) => _.camelCase(x));
    })(parsedPath);
    let namespace;
    const namespaced = /^(.+)\.openapi$/.exec(parsedPath.name);
    if(exist(namespaced)){
      namespace = namespaced[1];
      // TODO pascal-case to camelCase
      moduleContext.push(_.camelCase(namespace));
    }
    const input = YAML.parseDocument(readFileSync(filePath, 'UTF-8')).toJSON();
    if(!exist(input.components)){
      console.warn(`skip ${filePath}: components not found `);
      return;
    }
    if(!exist(input.components.schemas)){
      console.warn(`${filePath}: components->schemas not found `);
      return;
    }
    input.paths = {};
    try{

      dtsGenerator({
        contents: [parseSchema(input)],
        config: {
          target: ts.ScriptTarget.ES2019,
          plugins: {
            '@dtsgenerator/replace-namespace': {
              map: [
                {
                  from: ['Paths'],
                  to: moduleContext
                },
                {
                  from: ['Components'],
                  to: moduleContext
                }
              ]
            }
          }
        }
      }).then((response)=>{
        const prefix = parsedPath.dir + (exist(namespaced)?`/${namespace}-`:'/');
        const outputPath = `${prefix}api.generated.d.ts`;
        console.warn(`${filePath} -> ${outputPath}`);
        fs.writeFileSync(outputPath, response);
      }).catch((reason)=>{
        console.error(`error ${filePath}`);
        console.error(reason);
      });
    }
    catch(reason){
      console.error(`error ${filePath}`);
      console.error(reason);
    }
  })(filePath);
}
