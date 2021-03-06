var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed, currentTime;
var feed, addFood;
var foodObj;
var gameState, readState;

function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(400, 500);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  dog = createSprite(200, 400, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime = hour();
  foodObj.display();
  feed.show();
  addFood.show();
  dog.addImage(sadDog);

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
  });
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref("/").update({
    Food: foodS,
  });
}

//update gameState
function update(state) {
  database.ref("/").update({
    gameState: state,
  });
}
