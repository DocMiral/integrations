import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class DocmiralApi implements ICredentialType {
	name = 'docmiralApi';
	displayName = 'DocMiral API';
	documentationUrl = 'https://docmiral.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your DocMiral API token. Generate one at https://docmiral.com/profile/apikeys',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.docmiral.com/api',
			description: 'Base API URL of the DocMiral instance',
		},
	];
}
