const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model');

const app = express();

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = 'mongodb://127.0.0.1/express-mongoose-recipes-dev';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(
      `Connected to Mongo! Database name: ${connection.connections[0].name}`
    );
  } catch (error) {
    console.error('Error connecting to Mongo', error);
  }
};

connectDB();

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
  res.send('<h1>LAB | Express Mongoose Recipes</h1>');
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route

app.post('/recipes', async (req, res) => {
  const { title, instructions, level, ingredients, duration } = req.body;
  try {
    const createdRecipe = await Recipe.create({
      title,
      instructions,
      level,
      ingredients,
      duration,
    });
    console.log('Recipe created:', createdRecipe);
    res.status(201).send(createdRecipe);
  } catch (error) {
    console.log('Error creating the recipe', error);
    res.status(500).send({ error: 'Failed to create the recipe' });
  }
  console.log(req);
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (req, res) => {
  try {
    const recipies = await Recipe.find({});
    console.log('All recipes:', recipies);
    res.status(200).send(recipies);
  } catch (error) {
    console.log('Error retrieving all recipies', error);
    res.status(500).send({ error: 'Failed to retrieve all recipies' });
  }
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const recipe = await Recipe.findById(recipeId);
    console.log('Recipe', recipe);
    res.status(200).send(recipe);
  } catch (error) {
    console.log('Error getting the recipe', error);
    res.status(500).send({ error: 'Failed to get the recipe' });
  }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
      new: true,
    });
    console.log('Updated recipe', updatedRecipe);
    res.status(200).send(updatedRecipe);
  } catch (error) {
    console.log('Error updating recipe', error);
    res.status(500).send({ error: 'Failed to update the recipe' });
  }
});

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    await Recipe.findByIdAndDelete(recipeId);
    console.log('Deleted recipe');
    res.status(200).send();
  } catch (error) {
    console.log('Error deleting recipe', error);
    res.status(500).send({ error: 'Failed to delete the recipe' });
  }
});

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
