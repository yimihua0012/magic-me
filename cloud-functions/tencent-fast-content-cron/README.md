# Tencent SCF Fast Content Cron

This Tencent Cloud Function calls:

```bash
POST https://magic-headshot.com/api/cron/fast-content
Authorization: Bearer <secret>
```

## Environment Variables

Set one of these in Tencent Cloud Function environment variables:

```env
FAST_CONTENT_CRON_SECRET=your_server_secret
```

or:

```env
CRON_SECRET=your_server_secret
```

Optional endpoint override:

```env
FAST_CONTENT_CRON_ENDPOINT=https://magic-headshot.com/api/cron/fast-content
```

## Runtime

Use Node.js 18 or Node.js 20.

Handler:

```text
index.main
```

## Timer Trigger

Create a timer trigger in Tencent Cloud Function, for example:

```text
0 */2 * * * *
```

That means run once every 2 hours.

## Optional Test Event

To process only one locale:

```json
{
  "locale": "en"
}
```

Supported locale values:

```text
en, es, fr, de, ja
```

If no locale is passed, the API randomly picks from all pending or failed keywords.
