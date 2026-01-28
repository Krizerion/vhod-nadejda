# Vhodly

Управление на вход - Информационна система за жители

## Описание

Приложение за управление на вход, което предоставя информация за:
- Пари в сметка за текущи разходи
- Пари в сметка за ремонти
- Дължими суми по апартаменти
- Важни съобщения (например дати на събрания)

## Разработка

### Backend API

Първо стартирайте NestJS backend API:

```bash
cd vhodly-api
npm install
npm run start:dev
```

API-то ще работи на `http://localhost:3000`

### Frontend

След това стартирайте Angular приложението:

```bash
cd vhodly-app
npm install
npm start
```

Приложението ще се отвори на `http://localhost:4200`

**Важно:** Backend API-то трябва да работи преди да стартирате frontend-а, защото приложението прави HTTP заявки към API-то.

## Деплой

За инструкции как да публикувате приложението на GitHub Pages или други безплатни хостинг платформи, вижте [DEPLOYMENT.md](./DEPLOYMENT.md)

## Технологии

### Frontend
- Angular 21
- Angular Material
- TypeScript
- RxJS

### Backend
- NestJS 10
- TypeScript
- Swagger/OpenAPI

## API Integration

Frontend-ът използва HTTP заявки към NestJS backend API вместо mock данни. Конфигурацията на API URL-а се намира в `vhodly-app/src/environments/environment.ts`.

За да промените API URL-а за production, редактирайте `vhodly-app/src/environments/environment.prod.ts`.