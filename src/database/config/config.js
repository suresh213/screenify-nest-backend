require('dotenv').config();

module.exports = {
  // incase you are using an online database, such as ElephantSQL, uncomment this lines:
  // If using onine database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    uri: process.env.MONGO_URI,
  },

  test: {
    uri: process.env.MONGO_URI,
  },

  production: {
    uri: process.env.MONGO_URI,
  },
};
