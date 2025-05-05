import { DataType, newDb } from 'pg-mem';
import { DataSource } from 'typeorm';
import { UserEntity } from '../src/authentication/entities/user.entity';
import { Category } from '../src/categories/entities/category.entity';

export const createTestingDataSource = async (): Promise<DataSource> => {
  const db = newDb({ autoCreateForeignKeyIndices: true });

  db.public.registerFunction({
    name: 'current_database',
    returns: DataType.text,
    implementation: () => 'test_db',
  });

  db.public.registerFunction({
    name: 'version',
    returns: DataType.text,
    implementation: () => 'pg-mem mocked postgres 15',
  });

  const dataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [UserEntity, Category],
    synchronize: true,
  });

  await dataSource.initialize();
  return dataSource;
};
