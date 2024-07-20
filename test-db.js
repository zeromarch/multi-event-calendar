const db = require('./database');

db.serialize(() => {
  db.each("SELECT name FROM sqlite_master WHERE type='table'", (err, table) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(table.name);
    }
  });
});
