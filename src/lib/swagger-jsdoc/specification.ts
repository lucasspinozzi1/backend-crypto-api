import * as path from 'path';
import * as doctrine from 'doctrine';
import * as parser from 'swagger-parser';
import * as YAML from 'yaml';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';

import {
  choose,
  exist,
  chooseArray,
  hasEmptyProperty,
  convertGlobPaths,
  extractAnnotations,
  mergeDeep,
  extractYamlFromJsDoc,
  isTagPresentInTags
} from './utils';

export interface Difinition {
  swaggerDefinition: {
    components: object;
    info: {
      title: string;
      version: string;
    };
    openapi: string;
  };
  definition?: any;
  apis: Array<string>;
  encoding?: string;
  failOnErrors?: boolean;
  format?: string;
  namespace?: string;
  contex?: string;
};

// export interface SwaggerObject {
//   swaggerDefinition: any;
//   definition: any;
//   apis: Array<string>;
//   encoding: string;
//   failOnErrors: boolean;
//   tags: Array<string>;
// };

function prepare(definition: Difinition): OpenAPI.Document {
  let version: string;
  const swaggerObject = JSON.parse(JSON.stringify(definition));
  const specificationTemplate = {
    v2: [
      'paths',
      'definitions',
      'responses',
      'parameters',
      'securityDefinitions'
    ],
    v3: [
      'paths',
      'definitions',
      'responses',
      'parameters',
      'securityDefinitions',
      'components'
    ]
  };

  if (exist(swaggerObject.openapi)) {
    version = 'v3';
  }
  else if (exist(swaggerObject.swagger)) {
    version = 'v2';
  }
  else {
    version = 'v2';
    swaggerObject.swagger = '2.0';
  }

  specificationTemplate[version].forEach((property: string | number) => {
    swaggerObject[property] = choose(swaggerObject[property], {});
  });

  swaggerObject.tags = chooseArray(swaggerObject.tags, []);

  return swaggerObject;
}

/**
 * @param obj
 * @param ext
 */
function format(swaggerObject: any, ext: string) {
  if (ext === '.yml' || ext === '.yaml') {
    return YAML.stringify(swaggerObject);
  }
  return swaggerObject;
}

/**
 * OpenAPI specification validator does not accept empty values
 * for a few properties.
 * Solves validator error: "Schema error should NOT have additional properties"
 *
 * @param swaggerObject
 * @returns swaggerObject
 */
function clean(swaggerObject: {[x: string]: any}) {
  for (const prop of [
    'definitions',
    'responses',
    'parameters',
    'securityDefinitions'
  ]) {
    if (hasEmptyProperty(swaggerObject[prop])) {
      // this is a non production library
      // eslint-disable-next-line @typescript-eslint/tslint/config
      delete swaggerObject[prop];
    }
  }

  return swaggerObject;
}

/**
 * Parse the swagger object and remove useless properties if necessary.
 *
 * @param swaggerObject - Swagger object from parsing the api files.
 * @returns The specification.
 */
async function finalize(
  swaggerObject: OpenAPI.Document,
  options: Difinition
): Promise<OpenAPI.Document> {
  return new Promise(function(resolve, reject){
    parser.parse(swaggerObject, (err, api: OpenAPI.Document) => {
      if (!exist(err)) {
        resolve(format(api, options.format));
      }
      else{
        reject(err);
      }
    });
  });
}

/**
 * @param swaggerObject
 * @param annotation
 * @param property
 */
function organize(
  swaggerObject: OpenAPI.Document,
  annotation: { [x: string]: any; tags?: any },
  property: string
) {
  // Root property on purpose.
  // @see
  // https://github.com/OAI/OpenAPI-Specification/blob/master/proposals/002_Webhooks.md#proposed-solution
  if (property === 'x-webhooks') {
    swaggerObject[property] = annotation[property];
  }

  // Other extensions can be in varying places depending on different
  // vendors and opinions.
  // The following return makes it so that they are not put in `paths`
  // in the last case.
  // New specific extensions will need to be handled on case-by-case if
  // to be included in `paths`.
  if (property.startsWith('x-')) {
    return;
  }

  const commonProperties = [
    'components',
    'consumes',
    'produces',
    'paths',
    'schemas',
    'securityDefinitions',
    'responses',
    'parameters',
    'definitions'
  ];
  if (commonProperties.includes(property)) {
    for (const definition of Object.keys(annotation[property])) {
      swaggerObject[property][definition] = mergeDeep(
        swaggerObject[property][definition],
        annotation[property][definition]
      );
    }
  }
  else if (property === 'tags') {
    const { tags } = annotation;
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (!isTagPresentInTags(tag, swaggerObject.tags)) {
          swaggerObject.tags.push(tag);
        }
      }
    }
    else if (!isTagPresentInTags(tags, swaggerObject.tags)) {
      swaggerObject.tags.push(tags);
    }
  }
  else {
    // Paths which are not defined as "paths"
    // property, starting with a slash "/"
    swaggerObject.paths[property] = mergeDeep(
      swaggerObject.paths[property],
      annotation[property]
    );
  }
}

const isV3Document = function(doc: OpenAPI.Document): doc is OpenAPIV3.Document {
  return typeof (<OpenAPIV3.Document>doc).components !== 'undefined';
};

const namespace = function namespace(doc: OpenAPI.Document, filePath: string, options: Difinition) {
  if(exist(doc) && isV3Document(doc) && exist(doc.components?.schemas)){
    const rootContext = choose(options.contex, './src/route');
    const parsedPath = path.parse(filePath);
    const moduleContext = (function(parsedPath){
      const index = parsedPath.dir.lastIndexOf(rootContext);
      if(index < 0){
        throw new Error(`file path out of context: ${filePath}`);
      }
      const partial = parsedPath.dir.substring(index + rootContext.length);
      if(partial === ''){
        return [];
      }
      return partial.substring(1).split('/');
    })(parsedPath);
    let namespace: string;
    const namespaced = /^(.+)\.openapi$/.exec(parsedPath.name);
    if(exist(namespaced)){
      namespace = namespaced[1];
      moduleContext.push(namespace);
    }
    const suffix = moduleContext.length > 0?  `${moduleContext.join('.')}.` : '';
    const schemas = {};
    Object.keys(doc.components.schemas).forEach((key: string) => {
      schemas[`${suffix}${key}`] = doc.components.schemas[key];
    });
    doc.components.schemas = schemas;
    if(moduleContext.length > 0){
      const pending: Array<{}> = [doc];
      while(pending.length > 0){
        const current = pending.pop();
        if(Array.isArray(current)){
          current.forEach((x) => {
            if(typeof x === 'object'){
              pending.push(x);
            }
          });
          continue;
        }
        Object.keys(current).forEach((key: string) => {
          const value = current[key];
          if(key === '$ref' && typeof value === 'string'){
            current[key] = value.replace('#/components/schemas/', `#/components/schemas/${suffix}`);
          }
          if(typeof value === 'object'){
            pending.push(value);
          }
        });
      }
    }
  }
  return doc;
};

export async function build(options: Difinition): Promise<OpenAPI.Document> {
  YAML.defaultOptions.keepCstNodes = true;

  // Get input definition and prepare the specification's skeleton
  const definition = choose(options.swaggerDefinition, options.definition);
  const specification = prepare(definition);
  const yamlDocsAnchors = new Map();
  const yamlDocsErrors = [];
  const yamlDocsReady = [];
  const docsReady = [];

  for (const filePath of convertGlobPaths(options.apis)) {
    const extracted = extractAnnotations(filePath, options.encoding);
    const yamlAnnotations = extracted.yaml;
    let jsdocAnnotations = extracted.jsdoc;

    if (exist(yamlAnnotations.length)) {
      for (const annotation of yamlAnnotations) {
        const parsed = YAML.parseDocument(annotation);
        console.warn(filePath);
        const anchors = parsed.anchors.getNames();
        if (anchors.length > 0) {
          for (const anchor of anchors) {
            yamlDocsAnchors.set(anchor, parsed);
          }
        }
        else if (exist(parsed.errors) && parsed.errors.length > 0) {
          yamlDocsErrors.push(parsed);
        }
        else {
          // yamlDocsReady.push(parsed);
          docsReady.push(namespace(parsed.toJSON(), filePath, options));
        }
      }
    }
    // disable json format temporally
    jsdocAnnotations = [];

    if (jsdocAnnotations.length > 0) {
      for (const annotation of jsdocAnnotations) {
        const jsDocComment = doctrine.parse(annotation, { unwrap: true });
        for (const doc of extractYamlFromJsDoc(jsDocComment)) {
          const parsed = YAML.parseDocument(doc);

          const anchors = parsed.anchors.getNames();
          if (anchors.length > 0) {
            for (const anchor of anchors) {
              yamlDocsAnchors.set(anchor, parsed);
            }
          }
          else if (exist(parsed.errors) && parsed.errors.length > 0) {
            yamlDocsErrors.push(parsed);
          }
          else {
            yamlDocsReady.push(parsed);
          }
        }
      }
    }
  }

  if (yamlDocsErrors.length > 0) {
    for (const docWithErr of yamlDocsErrors) {
      const errsToDelete = [];
      docWithErr.errors.forEach((error: { name: string; message: string }, index: any) => {
        if (error.name === 'YAMLReferenceError') {
          // This should either be a smart regex or ideally a YAML
          // library method using the error.range.
          // The following works with both pretty and not pretty errors.
          const refErr = error.message
            .split('Aliased anchor not found: ')
            .filter((a: any) => {
              return a;
            })
            .join('')
            .split(' at line')[0];
          const anchor = yamlDocsAnchors.get(refErr);
          const anchorString = anchor.cstNode.toString();
          const originalString = docWithErr.cstNode.toString();
          const readyDocument = YAML.parseDocument(
            `${anchorString}\n${originalString}`
          );

          yamlDocsReady.push(readyDocument);
          errsToDelete.push(index);
        }
      });
      // reverse sort the deletion array so we always delete from the end
      errsToDelete.sort((a, b) => {
        return b - a;
      });

      // Cleanup solved errors in order to allow for parser to pass through.
      for (const errIndex of errsToDelete) {
        docWithErr.errors.splice(errIndex, 1);
      }
    }

    const errReport = yamlDocsErrors
      .map(({ errors }) => {
        return errors.join('\n');
      })
      .filter((error) => {
        return exist(error);
      });

    if (errReport.length > 0) {
      if (options.failOnErrors) {
        return Promise.reject(JSON.stringify(errReport, null, 2));
      }
      // Place to provide feedback for errors. Previously throwing,
      // now reporting only.
      console.warn(
        'Not all input has been taken into account at your final specification.'
      );

      console.error(`Here's the report: \n\n\n ${String(errReport)}`);
    }
  }
  for (const document of yamlDocsReady) {
    const parsedDoc = document.toJSON();
    Object.keys(parsedDoc).forEach((property)=>{
      organize(specification, parsedDoc, property);
    });
  }
  for (const document of docsReady) {
    Object.keys(document).forEach((property)=>{
      organize(specification, document, property);
    });
  }
  return finalize(specification, options);
}
