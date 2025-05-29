import { injectable } from 'inversify';
import { Hippopotamus, IHippopotamus } from '../models/hippopotamus';

// Клас-репозиторій для роботи з бегемотами
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class HippopotamusRepository {
    // Метод для отримання всіх бегемотів з бази даних
    public async findAll(): Promise<IHippopotamus[]> {
        return Hippopotamus.find();
    }

    // Метод для пошуку бегемота за унікальним ідентифікатором
    public async findById(id: string): Promise<IHippopotamus | null> {
        return Hippopotamus.findById(id);
    }

    // Метод для створення нової бегемота в базі даних
    public async create(hippopotamusData: IHippopotamus): Promise<IHippopotamus> {
        const hippopotamus = new Hippopotamus(hippopotamusData);
        return hippopotamus.save();
    }

    // Метод для видалення бегемотів за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Hippopotamus.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про бегемота (заміна всіх полів)
    // eslint-disable-next-line prettier/prettier
    public async update(
        id: string,
        hippopotamusData: IHippopotamus,
    ): Promise<IHippopotamus | null> {
        return Hippopotamus.findByIdAndUpdate(id, hippopotamusData, { new: true });
    }

    // Метод для часткового оновлення даних про бегемота (оновлення лише вказаних полів)
    // eslint-disable-next-line prettier/prettier
    public async patch(
        id: string,
        hippopotamusData: Partial<IHippopotamus>,
    ): Promise<IHippopotamus | null> {
        return Hippopotamus.findByIdAndUpdate(id, { $set: hippopotamusData }, { new: true });
    }
}
