const express = require("express");
const app = express();
const cors = require("cors");
const Sequelize = require("sequelize");
const dbConfig = require("./config/config.json").development;
const User = require("./models").User;
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'elasticsearch:9200'
});

connectToDatabase();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(cors());

//search
app.post("/users/search", async (req, res) => {
  let query = req.body.query;
  console.log(`Searching users for ${query}`)
  try {
    const response = await client.search({
      index: 'example',
      type: 'users',
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  username: query
                }
              },
              {
                wildcard: {
                  username: `*${query}*`
                }
              },
              {
                fuzzy: {
                  username: query
                }
              }
            ],
            minimum_should_match: 1
          }
        }
      }
    })
    if (response.hits.total > 0) {
      const hits = response.hits.hits;
      res.status(200).send(hits.map((user_data) => {
        return {
          username: user_data._source.username,
          id: user_data._source.id
        }
      }))
    } else {
        res.status(200).send([]);
    }
  } catch (error) {
    res.status(422).send(error);
  }
});

// CREATE
app.post("/users", async (req, res) => {
  console.log("Creating User")
  try {
    const users = await User.create({
      username: req.body.username,
      password: req.body.password
    })
    res.status(201).send(users);
  } catch (error) {
    res.status(422).send(error);
  }
});

// READ ALL
app.get("/users", async (req, res) => {
  console.log("Reading All Users")
  try {
    const users = await User.all();
    res.send(users);
  } catch (error) {
    res.status(422).send(error);
  }
});

// READ
app.get("/users/:id", async (req, res) => {
  let id = parseInt(req.params.id)
  console.log(`Reading User with id ${id}`)
  try {
    const user = await User.findById(id);
    res.send(user);
  } catch (error) {
    res.status(422).send(error);
  }
});

// UPDATE
app.put("/users/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  console.log(`Update User with id ${id}`)
  let username = req.body.username;
  let password = req.body.password;
  try {
    let user = await User.update({ username, password }, { where: { id: id } })
    res.status(202).send(user);
  } catch (error) {
    res.status(422).send(error);
  }
});

// DELETE
app.delete("/users/:id", async (req, res) => {
  let id = parseInt(req.params.id);
  console.log(`Delete User with id ${id}`)
  try {
    let user = await User.destroy({ where: { id } })
    res.sendStatus(200)
  } catch (error) {
    res.status(422).send(error);
  }
});


app.listen(5000, () => console.log("The node.js app is listening on port 5000."));

function connectToDatabase() {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");

      //Check if database was seeded already, and do it if needed
      User.find({where: {username: 'admin'}}).then(user => {
        if (!user) {
          console.log("Database is not seeded, will run seeds now...");
          const { exec } = require("child_process");
          try {
            exec("/opt/node_modules/.bin/sequelize db:seed:all", (err, stdout, stderr) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log(stdout);
            });
          } catch (error) {
            console.log("Error while seeding database: ", error);
          }
        } else {
          console.log("Database already seeded.");
        }
      });
    })
    .catch(err => {
      console.log("Unable to connect to the database:", err);
    });
}
