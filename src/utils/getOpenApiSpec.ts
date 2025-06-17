import RefParser from '@apidevtools/json-schema-ref-parser';
import { resolve } from 'path';

import { exists } from './fileSystem';

/**
 * Load and parse the OpenAPI spec. If the location is a file path,
 * we bundle it. If it's a URL, we just parse it to avoid ref resolution issues.
 * @param location: Path or URL
 */
export const getOpenApiSpec = async (location: string): Promise<any> => {
    const isUrl = location.startsWith('http://') || location.startsWith('https://');

    if (isUrl) {
        return await RefParser.dereference(location);
    }

    const absolutePath = (await exists(location)) ? resolve(location) : location;
    return await RefParser.bundle(absolutePath);
};
