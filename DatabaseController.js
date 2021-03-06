import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const DatabaseController = () => {
    const db = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });

    db.connect(function (err) {
        if (err) {
            throw err;
        }
    });

    const insert = ({table, data = []}) => {
        if (!data.length) {
            return;
        }
        let values = '';
        let keys = [];
        for (const element of data) {
            if (values.length !== 0) {
                values += ',';
            }
            values += '(';
            let value = '';
            for (const key of Object.keys(element)) {
                if (value.length !== 0) {
                    value += ',';
                }
                value += `${db.escape(element[key])}`;
                keys.push(key);
            }
            values += `${value})`;
        }

        keys = [...new Set(keys)];

        const sql = `INSERT INTO ${table} (${keys.join(',')})
                     VALUES ${values}`;

        db.query(sql, function (err) {
            if (err) {
                throw err;
            }
        });
    }

    const select = ({table, columns = [], conditions = []}) => {
        let conditionSql = '';

        for (const condition of conditions) {
            for (const key of Object.keys(condition)) {
                if (conditionSql.length !== 0) {
                    conditionSql += ' AND ';
                }
                conditionSql += `${key} = ${db.escape(condition[key])}`;
            }
        }

        let sql = `SELECT ${columns.length ? columns.join(',') : '*'}
                   FROM ${table}`

        if (conditions) {
            sql += ` WHERE ${conditionSql}`;
        }

        db.query(sql, function (err) {
            if (err) {
                throw err;
            }
        });
    }

    return {
        insert,
        select
    }
}

export default DatabaseController;