import pgPromise from "pg-promise";
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || "postgres://cimqvbjo:1fCeWWKF4VmEDi1WsmzBAmX2DKWZ1P5_@cornelius.db.elephantsql.com/cimqvbjo";

const config = {
    connectionString: DATABASE_URL,
};

const pgp = pgPromise();
const db = pgp(config);

export default db;