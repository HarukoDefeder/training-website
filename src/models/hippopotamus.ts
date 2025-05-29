import { Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Бегемот"
interface IHippopotamus {
    name: string; // Ім'я бегемота
    age: number; // Вік бегемота у роках
    height: number; // Висота бегемота в сантиметрах
    weight: number; // Вага бегемота в кілограмах
    gender: 'male' | 'female'; // Стать бегемота: 'male' - самець, 'female' - самка
    description?: string; // Опис бегемота (необов'язкове поле)
    diveDepth: string; // Глибина пірнання, метри
    dateAdded: Date; // Дата додавання запису до бази даних
}

// Схема MongoDB для моделі "Бегемот"
const hippopotamusSchema = new Schema<IHippopotamus>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    diveDepth: {
        type: String,
        required: true, // Поле є обов'язковим
    },
});

// Створення моделі Mongoose на основі схеми
export const Hippopotamus = model<IHippopotamus>('Hippopotamus', hippopotamusSchema);
export type { IHippopotamus }; // Експортуємо інтерфейс для використання в інших файлах
