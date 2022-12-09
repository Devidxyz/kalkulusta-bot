<h1 align="center">Kalkulusták MMP Discord bot</h1>

<p align="center">
	<img src="docs/img/avatar.png" width="20%" />
</p>

## About Kalkulusták MMP

Kalkulusták MMP is a community driven [Discord server](https://discord.gg/ecyurHj) which provides an anonym way to rate the teachers of University of Szeged. It was created to partially replace the [Mark My Professor](www.markmyprofessor.com) website, because it isn't maintaned anymore.

## Join Kalkulusták MMP

[https://discord.gg/ecyurHj](https://discord.gg/ecyurHj)

## Technologies

- Node.js, TypeScript
- discord.js, discordx npm packages
- Prisma ORM
- MySQL
- Docker

## Contributions are welcomed! Quick start for development

Install dependencies:

```bash
npm install
# or
yarn install
```

Create a new file called .env and add the following environment variables:

```
DATABASE_URL=mysql://kalkulusta:<MYSQL_PASSWORD>@localhost:3306/kalkulusta
DISCORD_TOKEN=
GUILD=
SEXY_EMOJI=
REPORT_EMOJI=
UP_EMOJI=
DOWN_EMOJI=
LOG_CHANNEL=
```

Generate prisma client:

```bash
npx prisma generate
# or
yarn prisma generate
```

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Run the production server:

```bash
npm run build && npm run start
# or
yarn build && yarn start
```

## Deployment with docker

Create a new files called .env.mysql and add the following environmnet variables:

```
MYSQL_DATABASE=kalkulusta
MYSQL_USER=kalkulusta
MYSQL_PASSWORD=
MYSQL_ROOT_PASSWORD=
```

Run command:

```
docker-compose up -d --build
```
