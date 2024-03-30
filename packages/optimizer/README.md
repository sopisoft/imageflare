# Image Optimizer

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

## API

```bash
curl -X GET "/api/optimizer/v1?image=https://example.com/image.jpg&width=512&height=512&format=webp&quality=80" -H  "accept: image/webp" > image.webp
```

| Query | Description | Default | Optional |
| --- | --- | --- | --- |
| image | Image URL | - | lfase |
| width | Width of the image | - | true |
| height | Height of the image | - | true |
| format | Format of the image | webp | true |
| quality | Quality of the image | 100 | true |
