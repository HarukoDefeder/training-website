// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Бегемота',
        version: '1.0.0',
        description: 'Документація API для Сайту про Бегемота',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення роутерів API та операцій з ними
    paths: {
        '/api/hippopotamuss': {
            // GET запит для отримання всіх бегемотів
            get: {
                summary: 'Отримати всіх бегемотів',
                responses: {
                    '200': {
                        description: 'Список всіх бегемотів',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Hippopotamus' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового бегемота
            post: {
                summary: 'Створити нового бегемота',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Hippopotamus' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт бегемота",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Hippopotamus' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного бегемота за ID
        '/api/hippopotamuss/{id}': {
            // GET запит для отримання бегемота за ID
            get: {
                summary: 'Отримати бегемота за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бегемота',
                        diveDepth: '',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт бегемота",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Hippopotamus' },
                            },
                        },
                    },
                    '404': { description: 'Бегемота не знайдено' },
                },
            },

            // PUT запит для повного оновлення бегемота за ID
            put: {
                summary: 'Повністю оновити бегемота',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бегемота',
                        diveDepth: '',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Hippopotamus' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт бегемота",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Hippopotamus' },
                            },
                        },
                    },
                    '404': { description: 'Бегемота не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення бегемота за ID
            patch: {
                summary: 'Частково оновити бегемота',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бегемота',
                        diveDepth: '',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Hippopotamus' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт бегемота",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Hippopotamus' },
                            },
                        },
                    },
                    '404': { description: 'Бегемота не знайдено' },
                },
            },
            // DELETE запит для видалення даних про бегемота за ID
            delete: {
                summary: 'Видалити дані про бегемота',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID бегемота',
                        diveDepth: '',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Бегемота не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Бегемот
            Hippopotamus: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я бегемота",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік бегемота у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота бегемота в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага бегемота в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать бегемота',
                    },
                    description: {
                        type: 'string',
                        description: "Опис бегемота (необов'язкове поле)",
                    },
                    diveDepth: {
                        type: 'string',
                        description: 'Глибина пірнання, метри',
                    },
                },
            },
        },
    },
};
