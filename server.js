const api = require('./api');
const db = require('./db');
const port = process.env.PORT || 1337;

db.syncAndSeed()
  .then(() => {
    console.log('DB Connected & Seeded');
    //dont start the app until the DB is running
    api.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch(e => {
    console.log('DB Not Connected');
    console.error(e);
  });
