import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { HippopotamusRepository } from '../repositories/HippopotamusRepository';

// Створюємо новий роутер Express
const router = Router();
// Отримуємо екземпляр репозиторію бегемотів з контейнера інверсії залежностей
const hippopotamusRepository = container.get(HippopotamusRepository);

// Роутер для HTTP метода GET / - отримання всіх записів бегемотів
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи бегемотів з бази даних через репозиторій
        const hippopotamuss = await hippopotamusRepository.findAll();
        res.json(hippopotamuss);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода GET /:id - отримання запису одного бегемота за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук бегемота за ідентифікатором
        const hippopotamus = await hippopotamusRepository.findById(req.params.id);
        if (hippopotamus) {
            res.json(hippopotamus);
        } else {
            // Якщо бегемот не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис бегемота не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода POST / - створення нового запису бегемота
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис бегемота з даних запиту
        const newHippopotamus = await hippopotamusRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного бегемота
        res.status(201).json(newHippopotamus);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PUT /:id - повне оновлення запису бегемота
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо бегемотів з вказаним ID
        const hippopotamus = await hippopotamusRepository.update(req.params.id, req.body);
        if (hippopotamus) {
            return res.json(hippopotamus);
        } else {
            // Якщо бегемот не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис бегемота не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PATCH /:id - часткове оновлення запису бегемота
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису бегемотів - передаються лише ті поля, які потрібно змінити
        const hippopotamus = await hippopotamusRepository.patch(req.params.id, req.body);
        if (hippopotamus) {
            res.json(hippopotamus);
        } else {
            // Якщо бегемот не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис бегемота не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода DELETE /:id - видалення запису бегемота
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про бегемота за ID
        const hippopotamus = await hippopotamusRepository.delete(req.params.id);
        if (hippopotamus) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про бегемота видалено' });
        } else {
            // Якщо бегемот не знайдена, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про бегемота не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
