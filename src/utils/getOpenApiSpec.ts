import RefParser from '@apidevtools/json-schema-ref-parser';
import fetch from 'node-fetch';
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
        const response = await fetch(location);
        if (!response.ok) {
            throw new Error(`Failed to fetch OpenAPI spec from ${location}`);
        }

        const json = await response.json();
        return await RefParser.bundle(json); // bundle the fetched spec, not the URL string
    }

    const absolutePath = (await exists(location)) ? resolve(location) : location;
    return await RefParser.bundle(absolutePath);
};
