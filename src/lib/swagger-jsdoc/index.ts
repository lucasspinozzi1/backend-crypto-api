import { OpenAPI } from 'openapi-types';
import { build, Difinition } from './specification';
import { exist } from './utils';

export const swaggerJSDoc = async function(options?: Difinition): Promise<OpenAPI.Document>{
  if (!exist(options)) {
    throw new Error('Missing or invalid input: \'options\' is required');
  }

  if (!exist(options.swaggerDefinition) && !exist(options.definition)) {
    throw new Error(`Missing or invalid input: 
      'options.swaggerDefinition' or 'options.definition' is required`);
  }

  if (!exist(options.apis) || !Array.isArray(options.apis)) {
    throw new Error(
      'Missing or invalid input: \'options.apis\' is required and it should be an array.'
    );
  }
  return build(options);
};
