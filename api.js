const express = require('express');
const api = express();
const db = require('./db');

api.get('/', (req, res, next) => {
  db.getUsersStaysObj()
    .then(data => {
      res.send(`<html>
      <head>
      </head>
      <body>
        <div class='container'>
        <h1>Acme Hotels</h1>
        <ul>
          ${Object.keys(data)
            .map(key => {
              return `
              <li>
                ${key} </br>
                <ul>
                ${data[key]
                  .map(stay => {
                    return `<li>
                  ${stay}
                  </li>`;
                  })
                  .join('')}
                </ul
              </li>
            `;
            })
            .join('')}
        </ul>
      </div>
      </body>
      </html>
    `);
    })
    .catch(next);
});

//dont deconstruct when exporitng the app
module.exports = api;
