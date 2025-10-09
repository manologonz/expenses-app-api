# Express Typescript API Starter
## Node Version
* Node (16.13.0)
## Dependencies

* bcryptjs (2.4.3)
* cors (2.8.5)
* dotenv (10.0.0)
* express (4.17.1)
* express-paginate (1.0.2)
* express-validator (6.11.1)
* helmet (4.6.0)
* jsonwebtoken (8.5.1)
* mysql (2.18.1)
* reflect-metadata (0.1.13)
* typeorm (0.2.41)
* morgan (1.10.0)
* multer (1.4.2)
* uuid (8.3.2)

## Dev Dependencies

* @types/bcryptjs (2.4.2),
* @types/cors (2.8.10),
* @types/express-paginate (1.0.0),
* @types/jest (26.0.24)
* @types/jsonwebtoken (8.5.1)
* @types/morgan (1.9.2)
* @types/node (15.6.1)
* @types/supertest (2.0.11)
* @types/uuid (8.3.0)
* jest (27.0.6)
* nodemon (2.0.7)
* supertest (6.1.3)
* ts-jest (27.0.3)
* ts-node (10.0.0)
* typescript (4.3.2)
## Environment
Create an env (.env) file in the root folder with de following values:
* **NODE_ENV** (required)
  * example: development
* **PORT** (optional)
  * example: 5000
  * default: 8080
* **MYSQL_PORT** (optional)
  * example: 3306
  * default: 3306
* **MYSQL_HOST** (optional)
  * example: localhost
  * default: localhost
* **MYSQL_USERNAME** (optional)
  * example: my_user
  * default: root
* **MYSQL_PASSWORD** (required)
  * exmaple: mypassword
* **MYSQL_DATABASE** (optional)
  * example: clients
  * default: mydb

## Commands
### Setup

```text
npm install
```

### Typescript to Javascript compilation

```text
npm build
```

### Development

```text
npm run dev
```

### Production

```text
npm start
```