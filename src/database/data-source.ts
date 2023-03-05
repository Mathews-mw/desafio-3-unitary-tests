import { DataSource } from "typeorm";

import { User } from "../modules/users/entities/User";
import { Statement } from "../modules/statements/entities/Statement";

const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5433,
	username: 'postgres',
	password: 'Math@2490',
	database: 'postgres',
  schema: 'fin',
	synchronize: false,
	logging: false,
	entities: [User, Statement],
	migrations: ['./src/database/migrations/*.ts'],
	subscribers: [],
});

export function createConnection(): Promise<DataSource> {
	return AppDataSource.setOptions({
		database: 'postgres'
	}).initialize();
}

export default AppDataSource;
