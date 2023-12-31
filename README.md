# Тестовое задание для Green-api
В рамках выполнения тестового задания требуется разработать механизм асинхронной обработки
HTTP запросов и опубликовать исходники проекта на Github для дальнейшего анализа и проверки.

## Требования:
1. Требуется разработать механизм асинхронной обработки HTTP запросов
2. Требуется использовать стек NodeJS, RabbitMQ
3. Требуется оформить в виде репозитория на Github
4. Требуется приложить инструкцию по локальному развертыванию проекта
5. Требуется реализовать логирование для целей отладки и мониторинга
6. Требуется разработать микросервис М1 для обработки входящих HTTP запросов
7. Требуется разработать микросервис М2 для обработки заданий из RabbitMQ

## Схема
![Принципиальная схема](https://github.com/tikhomirov-alex/rpc_via_nodejs/blob/main/scheme.png)

## Описание решения
Из поставленных требований следует, что нужно реализовать паттерн RPC - Remote procedure call.
Реализовано 2 микросервиса - client, который посылает запрос и server, который выполняет вычисления.
Также реализован простейший фронтенд на React.js для удобства тестирования.
У микросервиса есть две функции - умножение и сложение, добавлена задержка 4 и 2 секунды соответственно,
имитирующая рабочую нагрузку. Однако, несколько вычислений будут выполняться асинхронно.

### Стек технологий
* Node.js - платформа
* RabbitMQ (amqplib) - брокер сообщений
* Express.js - сервер
* React.js - фронтенд
* Typescript - для типизации
* log4js - для логирования
* dotenv - переменные окружения

# Инструкция
1. Сервер rabbitMQ используется облачный, поэтому на компьютере не требуется ни Erlang, ни RabbitMQ.
2. На компьютер должен быть установлен Node.js актуальной версии.
3. Необходимо скачать содержимое репозитория в zip-архиве или же склонировать репозиторий на локальный компьютер.
4. В репозитории имеются два файла - rpc.bat и front.bat
   * rpc.bat - запускает оба микросервиса - М1 (client) для запросов, М2 (server) - для вычислений
   * front.bat - запускает фронтенд (откроется страница localhost - http://localhost:3000)
5. Выбрать сумма/произведение, ввести аргументы и получить результат.
6. Также в командных строках от обоих файлов .bat можно увидеть логи.

## Скриншоты
![Фронтенд](https://github.com/tikhomirov-alex/rpc_via_nodejs/blob/main/frontend.png)
![Результаты](https://github.com/tikhomirov-alex/rpc_via_nodejs/blob/main/results.png)
![Логи](https://github.com/tikhomirov-alex/rpc_via_nodejs/blob/main/logs.png)
