import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Hippopotamus } from '../src/models/hippopotamus';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про бегемотів
describe('API вебдодатку сайту про бегемотів', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/hippopotamuss-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "hippopotamuss-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію бегемотів
    beforeEach(async () => {
        await Hippopotamus.deleteMany({});
    });

    // Тести для створення запису про нового бегемота (POST-запит)
    describe('POST /api/hippopotamuss', () => {
        it('має створити запис про нового бегемота', done => {
            // Тестові дані бегемота
            const hippopotamus = {
                name: 'Вухань',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Сірий бегемот',
                diveDepth: '2 метри',
            };

            // Виконуємо POST-запит для створення запису про бегемота
            chai.request(app)
                .post('/api/hippopotamuss')
                .send(hippopotamus)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', hippopotamus.name);
                    expect(res.body).to.have.property('age', hippopotamus.age);
                    expect(res.body).to.have.property('height', hippopotamus.height);
                    expect(res.body).to.have.property('weight', hippopotamus.weight);
                    expect(res.body).to.have.property('gender', hippopotamus.gender);
                    expect(res.body).to.have.property('description', hippopotamus.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(res.body).to.have.property('diveDepth', '2 метри');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів бегемотів (GET-запит)
    describe('GET /api/hippopotamuss', () => {
        it('має отримати всіх бегемотів', async () => {
            // Створюємо тестовий запис бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Білан',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Білий бегемот',
                diveDepth: '2 метри',
            });
            await testHippopotamus.save();

            // Виконуємо GET-запит для отримання всіх записів бегемотів
            const res = await chai.request(app).get('/api/hippopotamuss');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Білий бегемот');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(res.body[0]).to.have.property('diveDepth', '2 метри');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });

    // Тести для отримання запису конкретного бегемота за ID (GET-запит)
    describe('GET /api/hippopotamuss/:id', () => {
        it('має отримати конкретного бегемота за id', async () => {
            // Створюємо запис тестового бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Косий',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричневий бегемот',
                diveDepth: '2 метри',
            });
            const savedHippopotamus = await testHippopotamus.save();

            // Виконуємо GET-запит для отримання запису бегемота за ID
            // eslint-disable-next-line prettier/prettier
            const res = await chai
                .request(app)
                .get(`/api/hippopotamuss/${String(savedHippopotamus._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий бегемот');
            expect(res.body).to.have.property('diveDepth', '2 метри');
        });

        it('має повернути 404 для неіснуючого бегемота', async () => {
            // Виконуємо GET-запит для неіснуючого ID бегемота
            const res = await chai.request(app).get('/api/hippopotamuss/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про бегемота (PUT-запит)
    describe('PUT /api/hippopotamuss/:id', () => {
        it('має повністю оновити запис про бегемота', async () => {
            // Створюємо тестового бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                diveDepth: '2 метри',
            });
            const savedHippopotamus = await testHippopotamus.save();

            // Дані для оновлення бегемота
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
                diveDepth: '3 метри',
            };

            // Виконуємо PUT-запит для повного оновлення запису про бегемота
            const res = await chai
                .request(app)
                .put(`/api/hippopotamuss/${String(savedHippopotamus._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('diveDepth', '3 метри');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                diveDepth: '2 метри',
            });
            const savedHippopotamus = await testHippopotamus.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
                diveDepth: '2 метри',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/hippopotamuss/${String(savedHippopotamus._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що бегемот не змінився
            const unchangedHippopotamus = await Hippopotamus.findById(savedHippopotamus._id);
            expect(unchangedHippopotamus).to.have.property('name', 'Оригінальний');
            expect(unchangedHippopotamus).to.have.property('height', 25);
            expect(unchangedHippopotamus).to.have.property('weight', 1.8);
            expect(unchangedHippopotamus).to.have.property('diveDepth', '2 метри');
        });
    });

    // Тести для часткового оновлення запису про бегемота (PATCH-запит)
    describe('PATCH /api/hippopotamuss/:id', () => {
        it('має частково оновити запис про бегемота', async () => {
            // Створюємо тестового бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                diveDepth: '2 метри',
            });
            const savedHippopotamus = await testHippopotamus.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                diveDepth: '3 метри',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/hippopotamuss/${String(savedHippopotamus._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(res.body).to.have.property('diveDepth', '3 метри');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                diveDepth: '2 метри',
            });
            const savedHippopotamus = await testHippopotamus.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
                diveDepth: '3 метри',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/hippopotamuss/${String(savedHippopotamus._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('diveDepth', '3 метри');
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/hippopotamuss', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/hippopotamuss')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису бегемота (DELETE-запит)
    describe('DELETE /api/hippopotamuss/:id', () => {
        it('має видалити запис про бегемота', async () => {
            // Створюємо тестового бегемота
            const testHippopotamus = new Hippopotamus({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний бегемот',
                diveDepth: '2 метри',
            });
            const savedHippopotamus = await testHippopotamus.save();

            // Виконуємо DELETE-запит
            // eslint-disable-next-line prettier/prettier
            const res = await chai
                .request(app)
                .delete(`/api/hippopotamuss/${String(savedHippopotamus._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про бегемота видалено');

            // Перевіряємо, що запис про бегемота дійсно видалено з бази
            const findHippopotamus = await Hippopotamus.findById(savedHippopotamus._id);
            expect(findHippopotamus).to.be.null;
        });
    });
});
