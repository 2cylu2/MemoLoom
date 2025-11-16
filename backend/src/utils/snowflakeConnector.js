import snowflake from 'snowflake-sdk';
console.log("SF USER:", process.env.SNOWFLAKE_USERNAME);
console.log("SF ACCOUNT:", process.env.SNOWFLAKE_ACCOUNT);


const config = {
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USERNAME,
  password: process.env.SNOWFLAKE_PASSWORD,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'COMPUTE_WH',
  database: process.env.SNOWFLAKE_DATABASE || 'MY_APP_DB',
  schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC',
  clientSessionKeepAlive: true,
};

export function executeQuery(sqlText, binds = []) {
  return new Promise((resolve, reject) => {
    const connection = snowflake.createConnection(config);

    connection.connect((err, conn) => {
      if (err) {
        console.error('Failed to connect to Snowflake:', err.message);
        reject(new Error(`Snowflake connection failed: ${err.message}`));
        return;
      }

      conn.execute({
        sqlText,
        binds,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error('Failed to execute statement:', err.message);
            reject(new Error(`SQL execution failed: ${err.message}`));
          } else {
            resolve(rows);
          }
          conn.destroy();
        },
      });
    });
  });
}
