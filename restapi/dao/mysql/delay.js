const config = require('../../config/database.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.mysql);

exports.getDelay = function(delay, callback) {

  if (delay) {

    let sql = `SELECT keyname, ${delay} FROM delay`;

    pool.getConnection(function(err, connection) {
      if(err) {
        callback(err);
        return;
      }
      connection.query(sql, function(err, result) {
        connection.release();
        if(err) {
            callback(err);
            return;
        }
        callback(result);
      });
    });
  }
  else
    callback({ error: "Delay not found" });
};
