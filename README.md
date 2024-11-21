# si.online services

## Development

Init environment variables:

```bash
cp .env.example .env

for SRV_PRIVATE_KEY_FILE and SRV_PUBLIC_KEY_FILE
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

Install dependencies:

```bash
npm install
```

### Deployment with docker

Docker:

```bash
# Development
docker-compose -f docker-compose.db.yaml up -d
 # If you connect to MongoDB immediately, you may encounter an error stating that the node is not in the primary or recovering state. In such cases, you can resolve this issue by running rs.initiate().
docker exec -it si-online-mongodb /bin/bash
mongosh 
> rs.initiate()

```

```bash
docker-compose build
```

### start docker-compose

```bash
docker-compose up -d
```

In Node.js Environment:

```bash
npm install
npm run build
npm run start:prod
```
