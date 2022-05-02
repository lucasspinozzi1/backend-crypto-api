import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as mergeWith from 'lodash.mergewith';

export const choose = function<T>(value: T, alternative: T){
  if(value != null && typeof value !== 'undefined'){
    return value;
  }
  return alternative;
};

export const chooseArray = function<T>(value: any, alternative: Array<T>){
  if(Array.isArray(value)){
    return value;
  }
  return alternative;
};

export const exist = function(value: any){
  return value != null && typeof value !== 'undefined';
};

export function convertGlobPaths(globs: Array<string>): Array<string> {
  return globs
    .map((globString) => {
      return glob.sync(globString);
    })
    .reduce((previous, current) => {
      return previous.concat(current);
    }, []);
}

export function hasEmptyProperty(obj: Object): boolean {
  return Object.keys(obj)
    .map((key) => {
      return obj[key];
    })
    .every(
      (keyObject) => {
        return typeof keyObject === 'object' &&
        Object.keys(keyObject).every((key) => {
          return !(key in keyObject);
        });
      }
    );
}

/**
 * Extracts the YAML description from JSDoc comments with
 * `@swagger`/`@openapi` annotation.
 *
 * @param jsDocComment - Single item of JSDoc comments from doctrine.parse
 * @returns YAML parts
 */
export function extractYamlFromJsDoc(jsDocComment) {
  const yamlParts = [];

  for (const tag of jsDocComment.tags) {
    if (tag.title === 'swagger' || tag.title === 'openapi') {
      yamlParts.push(tag.description);
    }
  }

  return yamlParts;
}

/**
 * @param filePath
 * @returns JSDoc comments and Yaml files
 */
export function extractAnnotations(filePath, encoding = 'utf8') {
  const fileContent = fs.readFileSync(filePath, { encoding });
  const ext = path.extname(filePath);
  const jsDocRegex = /\/\*\*([\s\S]*?)\*\//gm;
  const csDocRegex = /###([\s\S]*?)###/gm;
  const yaml = [];
  const jsdoc = [];
  let regexResults = null;

  switch (ext) {
  case '.yml':
  case '.yaml':
    yaml.push(fileContent);
    break;

  case '.coffee':
    regexResults = choose(fileContent.match(csDocRegex), []);
    for (const result of regexResults) {
      let part = result.split('###');
      part[0] = '/**';
      part[part.length - 1] = '*/';
      part = part.join('');
      jsdoc.push(part);
    }
    break;

  default: {
    regexResults = choose(fileContent.match(jsDocRegex), []);
    for (const result of regexResults) {
      jsdoc.push(result);
    }
  }
  }

  return { yaml, jsdoc };
}

export interface Tag {
  name: string;
};

export function isTagPresentInTags(tag: Tag, tags: Array<Tag>): boolean {
  const match = tags.find((targetTag) => {
    return tag.name === targetTag.name;
  });
  if (exist(match)) {
    return true;
  }
  return false;
}

/**
 * Get an object of the definition file configuration.
 *
 * @param defPath
 * @param swaggerDefinition
 */
function loadDefinition(defPath, swaggerDefinition) {
  const resolvedPath = path.resolve(defPath);
  const extName = path.extname(resolvedPath);

  // eslint-disable-next-line
  const loadCjs = () => require(resolvedPath);
  const loadJson = () => {
    return JSON.parse(swaggerDefinition);
  };
  // eslint-disable-next-line
  const loadYaml = () => require('yaml').parse(swaggerDefinition);

  const LOADERS = {
    '.js': loadCjs, // on purpose, to allow throwing by nodejs and .cjs suggestion
    '.cjs': loadCjs,
    '.json': loadJson,
    '.yml': loadYaml,
    '.yaml': loadYaml
  };

  const loader = LOADERS[extName];

  if (typeof loader === 'undefined') {
    throw new Error('Definition file should be .cjs, .json, .yml or .yaml');
  }

  return loader();
}

/**
 * A recursive deep-merge that ignores null values when merging.
 * This returns the merged object and does not mutate.
 *
 * @param first the first object to get merged
 * @param second the second object to get merged
 */
export function mergeDeep(first, second) {
  return mergeWith({}, first, second, (a, b) => {
    if(b === null){
      return a;
    }
  });
}
