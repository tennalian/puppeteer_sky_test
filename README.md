# Puppeteer test

Тестирует наличие витрины оплаты на онбрдинке кидсов

[Документация puppeteer](https://pptr.dev/).

## Запуск

Создаем файл `credentials.js` с параметрами для авторизации. Убедитесь, что они верные, и вас не средирекит к черту на рога

```ts
  module.exports = {
    username,
    password
  };
```

Устанавливаем зависимости и запускаем:
```ts
  npm install
  npm run test
```
