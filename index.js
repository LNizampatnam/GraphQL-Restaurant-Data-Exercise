var express = require('express');
var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int!): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  id:Int
  name: String
  description: String
  dishes:[dishInput]
}
input dishInput{
  name: String
  price: Int
} 
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant : ({id})=>{
    const i = restaurants.findIndex(p=>p.id == id);
    if(!restaurants[i]) {
      throw new Error("restaurant doesn't exist");
    }
    return restaurants[i]
    },
    // Your code goes here
    restaurants : ()=> restaurants,
    // Your code goes here
    setrestaurant : ({input}) => {
      restaurants.push({id:input.id,name:input.name,description:input.description,dishes:input.dishes})
      return input
    },  
  
    // Your code goes here
  deleterestaurant: ({ id }) => {
    const i = restaurants.findIndex(p=>p.id == id);
    const ok = Boolean(restaurants[i])
    let delc = restaurants[i];
    restaurants = restaurants.filter(item => item.id !== id)
    console.log(JSON.stringify(delc)) 
    return {ok}    
    // Your code goes here
  },

  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    const i = restaurants.findIndex(p=>p.id == id);
    if(!restaurants[i]) {
      throw new Error("restaurant doesn't exist")
    }
    restaurants[i] = {
    ...restaurants[i],...restaurant
    }
    return restaurants[i]
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

//export default root;
