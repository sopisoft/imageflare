# Imageflare

Imageflare is a image processing service built on Cloudflare Workers.

## Commands

### Install Dependencies

```bash
bun i
```

### Development

```bash
bunx wrangler dev
```

### Deploy

```bash
bunx wrangler deploy
```

## Apis

### Emoji API

#### Emoji to PNG or SVG

```bash
curl -X GET "http://img.your-domain.workers.dev/api/emoji/v1/🐶.png?size=512&provider=fluent" -H  "accept: image/png" > dog.png

curl -X GET "http://img.your-domain.workers.dev/api/emoji/v1/🐶.svg" -H  "accept: image/png" > dog.png
```

| Parameter | Description | Default | Optional |
| --- | --- | --- | --- |
| size | Size of the image | 16 | true |
| provider | Provider of the emoji | twemoji | true |
| fluent_style | Style of fluent emoji | color | true |
| fluent_skin | Skin of fluent emoji | default | true |

##### Provider

- twemoji
- fluent
- noto

##### Fluent Style

- flat
- 3d
- color
- high_contrast

##### Fluent Skin

- default
- light
- medium_light
- medium
- medium_dark
- dark
