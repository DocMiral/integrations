"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Docmiral = void 0;
const n8n_workflow_1 = require("n8n-workflow");
// ─── helpers ────────────────────────────────────────────────────────────────
async function docmiralRequest(ctx, method, path, body, qs) {
    const credentials = await ctx.getCredentials('docmiralApi');
    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
    const options = {
        method,
        url: `${baseUrl}${path}`,
        headers: {
            Authorization: `Bearer ${credentials.apiToken}`,
            'Content-Type': 'application/json',
        },
        qs: qs !== null && qs !== void 0 ? qs : {},
        body,
        json: true,
    };
    return ctx.helpers.request(options);
}
// ─── node definition ─────────────────────────────────────────────────────────
class Docmiral {
    constructor() {
        this.description = {
            displayName: 'DocMiral',
            name: 'docmiral',
            icon: 'file:docmiral.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Interact with the DocMiral document generation platform',
            defaults: { name: 'DocMiral' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'docmiralApi', required: true }],
            properties: [
                // ── resource ──────────────────────────────────────────────────────
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Document', value: 'document' },
                        { name: 'Template', value: 'template' },
                        { name: 'Bucket', value: 'bucket' },
                        { name: 'E-Signature', value: 'esignature' },
                        { name: 'TARS (AI)', value: 'tars' },
                        { name: 'File', value: 'file' },
                    ],
                    default: 'document',
                },
                // ── document operations ───────────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['document'] } },
                    options: [
                        { name: 'List', value: 'list', action: 'List documents' },
                        { name: 'Get', value: 'get', action: 'Get a document' },
                        { name: 'Create', value: 'create', action: 'Create a document' },
                        { name: 'Update', value: 'update', action: 'Update a document' },
                        { name: 'Delete', value: 'delete', action: 'Delete a document' },
                        { name: 'Build PDF', value: 'buildPdf', action: 'Build PDF from a document' },
                        { name: 'Build PPTX', value: 'buildPptx', action: 'Build PowerPoint from a document' },
                        { name: 'Build Image', value: 'buildImage', action: 'Build image from a document' },
                        { name: 'Clone', value: 'clone', action: 'Clone a document' },
                    ],
                    default: 'list',
                },
                // ── template operations ───────────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['template'] } },
                    options: [
                        { name: 'List', value: 'list', action: 'List templates' },
                        { name: 'Get', value: 'get', action: 'Get a template' },
                        { name: 'Clone', value: 'clone', action: 'Clone a template' },
                    ],
                    default: 'list',
                },
                // ── bucket operations ─────────────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['bucket'] } },
                    options: [
                        { name: 'List', value: 'list', action: 'List buckets' },
                        { name: 'Get', value: 'get', action: 'Get a bucket' },
                        { name: 'Create', value: 'create', action: 'Create a bucket' },
                        { name: 'Update', value: 'update', action: 'Update a bucket' },
                        { name: 'Delete', value: 'delete', action: 'Delete a bucket' },
                    ],
                    default: 'list',
                },
                // ── esignature operations ─────────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['esignature'] } },
                    options: [
                        { name: 'Send Request', value: 'sendRequest', action: 'Send a signature request' },
                        { name: 'List Sent', value: 'listSent', action: 'List sent signature requests' },
                        { name: 'List Received', value: 'listReceived', action: 'List received signature requests' },
                        { name: 'Get', value: 'get', action: 'Get a signature request' },
                        { name: 'Resend', value: 'resend', action: 'Resend a signature request' },
                        { name: 'Cancel', value: 'cancel', action: 'Cancel a signature request' },
                    ],
                    default: 'listSent',
                },
                // ── tars operations ───────────────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['tars'] } },
                    options: [
                        { name: 'Chat (Fill Document)', value: 'chat', action: 'Use AI to fill a document' },
                        { name: 'Parse CV', value: 'parseCV', action: 'Parse a CV PDF into structured data' },
                        { name: 'Extract Text', value: 'extractText', action: 'Extract text from a file' },
                        { name: 'Smart Clone', value: 'smartClone', action: 'AI-powered smart clone of a document' },
                    ],
                    default: 'chat',
                },
                // ── file operations ───────────────────────────────────────────────
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['file'] } },
                    options: [
                        { name: 'Upload', value: 'upload', action: 'Upload a file' },
                    ],
                    default: 'upload',
                },
                // ══════════════════════════════════════════════════════════════════
                // DOCUMENT fields
                // ══════════════════════════════════════════════════════════════════
                // list
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    default: 50,
                    displayOptions: { show: { resource: ['document'], operation: ['list'] } },
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Offset',
                    name: 'offset',
                    type: 'number',
                    default: 0,
                    displayOptions: { show: { resource: ['document'], operation: ['list'] } },
                },
                // get / update / delete / build / clone — document ID
                {
                    displayName: 'Document ID',
                    name: 'entityId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: ['document'],
                            operation: ['get', 'update', 'delete', 'buildPdf', 'buildPptx', 'buildImage', 'clone'],
                        },
                    },
                },
                // create — template ID
                {
                    displayName: 'Template ID',
                    name: 'templateId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['document'], operation: ['create'] } },
                    description: 'ID of the template to create this document from',
                },
                // create — name
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['document'], operation: ['create'] } },
                    description: 'Optional name for the new document',
                },
                // create / update — data (JSON)
                {
                    displayName: 'Data (JSON)',
                    name: 'dataJson',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: { resource: ['document'], operation: ['create', 'update'] },
                    },
                    description: 'Document field data as JSON object',
                },
                // build PDF — engine
                {
                    displayName: 'PDF Engine',
                    name: 'pdfEngine',
                    type: 'options',
                    options: [
                        { name: 'Playwright (recommended)', value: 'playwright' },
                        { name: 'WeasyPrint', value: 'weasyprint' },
                    ],
                    default: 'playwright',
                    displayOptions: { show: { resource: ['document'], operation: ['buildPdf'] } },
                },
                // build image — page
                {
                    displayName: 'Page',
                    name: 'page',
                    type: 'number',
                    default: 1,
                    displayOptions: { show: { resource: ['document'], operation: ['buildImage'] } },
                    description: 'Page number to render (1-based)',
                },
                // ══════════════════════════════════════════════════════════════════
                // TEMPLATE fields
                // ══════════════════════════════════════════════════════════════════
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    default: 50,
                    displayOptions: { show: { resource: ['template'], operation: ['list'] } },
                },
                {
                    displayName: 'Offset',
                    name: 'offset',
                    type: 'number',
                    default: 0,
                    displayOptions: { show: { resource: ['template'], operation: ['list'] } },
                },
                {
                    displayName: 'Template ID',
                    name: 'templateId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['template'], operation: ['get', 'clone'] } },
                },
                // ══════════════════════════════════════════════════════════════════
                // BUCKET fields
                // ══════════════════════════════════════════════════════════════════
                {
                    displayName: 'Bucket ID',
                    name: 'bucketId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['bucket'], operation: ['get', 'update', 'delete'] } },
                },
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['bucket'], operation: ['create'] } },
                },
                {
                    displayName: 'Data (JSON)',
                    name: 'dataJson',
                    type: 'json',
                    default: '{}',
                    displayOptions: { show: { resource: ['bucket'], operation: ['create', 'update'] } },
                    description: 'Bucket data as JSON object',
                },
                // ══════════════════════════════════════════════════════════════════
                // E-SIGNATURE fields
                // ══════════════════════════════════════════════════════════════════
                {
                    displayName: 'Request ID',
                    name: 'requestId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { resource: ['esignature'], operation: ['get', 'resend', 'cancel'] },
                    },
                },
                {
                    displayName: 'Document ID',
                    name: 'entityId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['esignature'], operation: ['sendRequest'] } },
                    description: 'ID of the document to send for signature',
                },
                {
                    displayName: 'Signers',
                    name: 'signers',
                    type: 'fixedCollection',
                    typeOptions: { multipleValues: true },
                    default: {},
                    displayOptions: { show: { resource: ['esignature'], operation: ['sendRequest'] } },
                    options: [
                        {
                            name: 'signer',
                            displayName: 'Signer',
                            values: [
                                {
                                    displayName: 'Email',
                                    name: 'email',
                                    type: 'string',
                                    placeholder: 'name@email.com',
                                    default: '',
                                    required: true,
                                },
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Page',
                                    name: 'page',
                                    type: 'options',
                                    options: [
                                        { name: 'First Page', value: 'first' },
                                        { name: 'Last Page', value: 'last' },
                                    ],
                                    default: 'last',
                                },
                            ],
                        },
                    ],
                },
                // ══════════════════════════════════════════════════════════════════
                // TARS fields
                // ══════════════════════════════════════════════════════════════════
                // chat
                {
                    displayName: 'Document ID',
                    name: 'entityId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['tars'], operation: ['chat', 'smartClone'] } },
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    typeOptions: { rows: 4 },
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['tars'], operation: ['chat', 'smartClone'] } },
                    description: 'Natural language instruction for TARS (e.g. "Name is Alice, she works at Google")',
                },
                // parseCV / extractText
                {
                    displayName: 'Binary Property',
                    name: 'binaryProperty',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: {
                        show: { resource: ['tars'], operation: ['parseCV', 'extractText'] },
                    },
                    description: 'Name of the binary property containing the file to process',
                },
                // smartClone
                {
                    displayName: 'Target Category',
                    name: 'category',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['tars'], operation: ['smartClone'] } },
                    description: 'Category for the cloned document',
                },
                // ══════════════════════════════════════════════════════════════════
                // FILE fields
                // ══════════════════════════════════════════════════════════════════
                {
                    displayName: 'Binary Property',
                    name: 'binaryProperty',
                    type: 'string',
                    default: 'data',
                    required: true,
                    displayOptions: { show: { resource: ['file'], operation: ['upload'] } },
                    description: 'Name of the binary property containing the file to upload',
                },
            ],
        };
    }
    // ─── execute ────────────────────────────────────────────────────────────────
    async execute() {
        var _a, _b, _c, _d;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            let responseData;
            // ── DOCUMENT ─────────────────────────────────────────────────────
            if (resource === 'document') {
                if (operation === 'list') {
                    const limit = this.getNodeParameter('limit', i);
                    const offset = this.getNodeParameter('offset', i);
                    responseData = await docmiralRequest(this, 'GET', '/entities/', undefined, { limit, offset });
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('entityId', i);
                    responseData = await docmiralRequest(this, 'GET', `/entities/${id}`);
                }
                else if (operation === 'create') {
                    const templateId = this.getNodeParameter('templateId', i);
                    const name = this.getNodeParameter('name', i);
                    const dataJson = this.getNodeParameter('dataJson', i);
                    const data = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson;
                    responseData = await docmiralRequest(this, 'POST', '/entities/', {
                        template: templateId,
                        ...(name ? { name } : {}),
                        data,
                    });
                }
                else if (operation === 'update') {
                    const id = this.getNodeParameter('entityId', i);
                    const dataJson = this.getNodeParameter('dataJson', i);
                    const data = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson;
                    responseData = await docmiralRequest(this, 'PUT', `/entities/${id}`, { data });
                }
                else if (operation === 'delete') {
                    const id = this.getNodeParameter('entityId', i);
                    responseData = await docmiralRequest(this, 'DELETE', `/entities/${id}`);
                }
                else if (operation === 'buildPdf') {
                    const id = this.getNodeParameter('entityId', i);
                    const engine = this.getNodeParameter('pdfEngine', i);
                    const res = await docmiralRequest(this, 'POST', `/entities/${id}/build/pdf`, { engine });
                    const url = res.data.url;
                    const buffer = await this.helpers.request({ method: 'GET', url, encoding: null });
                    const binaryData = await this.helpers.prepareBinaryData(buffer, `document-${id}.pdf`, 'application/pdf');
                    returnData.push({ json: { url, documentId: id }, binary: { data: binaryData } });
                    continue;
                }
                else if (operation === 'buildPptx') {
                    const id = this.getNodeParameter('entityId', i);
                    const res = await docmiralRequest(this, 'POST', `/entities/${id}/build/pptx`);
                    const url = res.data.url;
                    const buffer = await this.helpers.request({ method: 'GET', url, encoding: null });
                    const binaryData = await this.helpers.prepareBinaryData(buffer, `document-${id}.pptx`, 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
                    returnData.push({ json: { url, documentId: id }, binary: { data: binaryData } });
                    continue;
                }
                else if (operation === 'buildImage') {
                    const id = this.getNodeParameter('entityId', i);
                    const page = this.getNodeParameter('page', i);
                    const res = await docmiralRequest(this, 'POST', `/entities/${id}/build/image`, { page });
                    const url = res.data.url;
                    const buffer = await this.helpers.request({ method: 'GET', url, encoding: null });
                    const binaryData = await this.helpers.prepareBinaryData(buffer, `document-${id}-p${page}.png`, 'image/png');
                    returnData.push({ json: { url, documentId: id, page }, binary: { data: binaryData } });
                    continue;
                }
                else if (operation === 'clone') {
                    const id = this.getNodeParameter('entityId', i);
                    responseData = await docmiralRequest(this, 'POST', `/entities/${id}/clone`);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
            }
            // ── TEMPLATE ──────────────────────────────────────────────────────
            else if (resource === 'template') {
                if (operation === 'list') {
                    const limit = this.getNodeParameter('limit', i);
                    const offset = this.getNodeParameter('offset', i);
                    responseData = await docmiralRequest(this, 'GET', '/templates/', undefined, { limit, offset });
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('templateId', i);
                    responseData = await docmiralRequest(this, 'GET', `/templates/${id}`);
                }
                else if (operation === 'clone') {
                    const id = this.getNodeParameter('templateId', i);
                    responseData = await docmiralRequest(this, 'POST', `/templates/${id}/clone`);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
            }
            // ── BUCKET ────────────────────────────────────────────────────────
            else if (resource === 'bucket') {
                if (operation === 'list') {
                    responseData = await docmiralRequest(this, 'GET', '/buckets/');
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('bucketId', i);
                    responseData = await docmiralRequest(this, 'GET', `/buckets/${id}`);
                }
                else if (operation === 'create') {
                    const name = this.getNodeParameter('name', i);
                    const dataJson = this.getNodeParameter('dataJson', i);
                    const data = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson;
                    responseData = await docmiralRequest(this, 'POST', '/buckets/', { name, data });
                }
                else if (operation === 'update') {
                    const id = this.getNodeParameter('bucketId', i);
                    const dataJson = this.getNodeParameter('dataJson', i);
                    const data = typeof dataJson === 'string' ? JSON.parse(dataJson) : dataJson;
                    responseData = await docmiralRequest(this, 'PUT', `/buckets/${id}`, { data });
                }
                else if (operation === 'delete') {
                    const id = this.getNodeParameter('bucketId', i);
                    responseData = await docmiralRequest(this, 'DELETE', `/buckets/${id}`);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
            }
            // ── E-SIGNATURE ───────────────────────────────────────────────────
            else if (resource === 'esignature') {
                if (operation === 'listSent') {
                    responseData = await docmiralRequest(this, 'GET', '/esignatures/requests');
                }
                else if (operation === 'listReceived') {
                    responseData = await docmiralRequest(this, 'GET', '/esignatures/received');
                }
                else if (operation === 'get') {
                    const id = this.getNodeParameter('requestId', i);
                    responseData = await docmiralRequest(this, 'GET', `/esignatures/${id}`);
                }
                else if (operation === 'resend') {
                    const id = this.getNodeParameter('requestId', i);
                    responseData = await docmiralRequest(this, 'POST', `/esignatures/${id}/resend`);
                }
                else if (operation === 'cancel') {
                    const id = this.getNodeParameter('requestId', i);
                    responseData = await docmiralRequest(this, 'POST', `/esignatures/${id}/cancel`);
                }
                else if (operation === 'sendRequest') {
                    const entityId = this.getNodeParameter('entityId', i);
                    const signersRaw = this.getNodeParameter('signers', i);
                    const signers = (_a = signersRaw.signer) !== null && _a !== void 0 ? _a : [];
                    responseData = await docmiralRequest(this, 'POST', '/esignatures/request', {
                        entity: entityId,
                        signers,
                    });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
            }
            // ── TARS ──────────────────────────────────────────────────────────
            else if (resource === 'tars') {
                if (operation === 'chat') {
                    const entityId = this.getNodeParameter('entityId', i);
                    const message = this.getNodeParameter('message', i);
                    responseData = await docmiralRequest(this, 'POST', '/tars/chat-layerer', {
                        entity_id: entityId,
                        message,
                    });
                }
                else if (operation === 'parseCV') {
                    const binaryProperty = this.getNodeParameter('binaryProperty', i);
                    const binaryData = items[i].binary;
                    if (!(binaryData === null || binaryData === void 0 ? void 0 : binaryData[binaryProperty])) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data found at property "${binaryProperty}"`);
                    }
                    const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
                    const credentials = await this.getCredentials('docmiralApi');
                    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
                    const formData = {
                        file: {
                            value: fileBuffer,
                            options: {
                                filename: (_b = binaryData[binaryProperty].fileName) !== null && _b !== void 0 ? _b : 'resume.pdf',
                                contentType: binaryData[binaryProperty].mimeType,
                            },
                        },
                    };
                    responseData = await this.helpers.request({
                        method: 'POST',
                        url: `${baseUrl}/tars/parse-cv`,
                        headers: { Authorization: `Bearer ${credentials.apiToken}` },
                        formData,
                        json: true,
                    });
                }
                else if (operation === 'extractText') {
                    const binaryProperty = this.getNodeParameter('binaryProperty', i);
                    const binaryData = items[i].binary;
                    if (!(binaryData === null || binaryData === void 0 ? void 0 : binaryData[binaryProperty])) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data found at property "${binaryProperty}"`);
                    }
                    const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
                    const credentials = await this.getCredentials('docmiralApi');
                    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
                    const formData = {
                        file: {
                            value: fileBuffer,
                            options: {
                                filename: (_c = binaryData[binaryProperty].fileName) !== null && _c !== void 0 ? _c : 'document.pdf',
                                contentType: binaryData[binaryProperty].mimeType,
                            },
                        },
                    };
                    responseData = await this.helpers.request({
                        method: 'POST',
                        url: `${baseUrl}/tars/extract-text`,
                        headers: { Authorization: `Bearer ${credentials.apiToken}` },
                        formData,
                        json: true,
                    });
                }
                else if (operation === 'smartClone') {
                    const entityId = this.getNodeParameter('entityId', i);
                    const message = this.getNodeParameter('message', i);
                    const category = this.getNodeParameter('category', i);
                    responseData = await docmiralRequest(this, 'POST', '/tars/smartclone', {
                        entity_id: entityId,
                        message,
                        ...(category ? { category } : {}),
                    });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
            }
            // ── FILE ──────────────────────────────────────────────────────────
            else if (resource === 'file') {
                if (operation === 'upload') {
                    const binaryProperty = this.getNodeParameter('binaryProperty', i);
                    const binaryData = items[i].binary;
                    if (!(binaryData === null || binaryData === void 0 ? void 0 : binaryData[binaryProperty])) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data found at property "${binaryProperty}"`);
                    }
                    const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
                    const credentials = await this.getCredentials('docmiralApi');
                    const baseUrl = credentials.baseUrl.replace(/\/$/, '');
                    const formData = {
                        file: {
                            value: fileBuffer,
                            options: {
                                filename: (_d = binaryData[binaryProperty].fileName) !== null && _d !== void 0 ? _d : 'upload',
                                contentType: binaryData[binaryProperty].mimeType,
                            },
                        },
                    };
                    responseData = await this.helpers.request({
                        method: 'POST',
                        url: `${baseUrl}/upload/`,
                        headers: { Authorization: `Bearer ${credentials.apiToken}` },
                        formData,
                        json: true,
                    });
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
            }
            // Normalise array vs single object responses
            const items_ = Array.isArray(responseData) ? responseData : [responseData];
            returnData.push(...items_.map((item) => ({ json: item })));
        }
        return [returnData];
    }
}
exports.Docmiral = Docmiral;
//# sourceMappingURL=Docmiral.node.js.map