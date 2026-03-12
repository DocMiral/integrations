# DocMiral Integrations

Third-party integrations and automation workflows for [DocMiral](https://docmiral.com) — a document generation and management platform with AI-assisted template building, PDF export, e-signatures, and a REST API.

## What is DocMiral?

DocMiral lets users create professional documents (resumes, invoices, letters, contracts) using reusable HTML/Jinja2 templates, structured MiniApp data forms, and TARS — an AI assistant that can fill, design, and customize documents from natural language prompts.

Key capabilities relevant for integrations:
- **REST API** with Bearer token and OAuth2 client credentials auth
- **PDF/PPTX/PNG export** from any document
- **CV parsing** — upload a PDF, get structured resume data back
- **Buckets** — named data stores for syncing external data into documents
- **E-signatures** — send and track signature requests programmatically

## Structure

```
integrations/
├── n8n/        # n8n workflow automations
└── ...
```

## Authentication

All API calls require a token from your DocMiral profile (`/profile/apikeys`):

```
Authorization: Bearer <your-token>
```

OAuth2 client credentials flow is also supported for server-to-server integrations.

## Main Project

The DocMiral platform source lives at `/opt/docmiral/pdfera`.
