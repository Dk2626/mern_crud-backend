const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

const FoodModel = require("./models/Food");

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

mongoose.connect(
  "mongodb+srv://Dk:Dinesh2626@cluster0.tzcod.mongodb.net/mern-crud?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },

  () => {
    console.log("Database Connected");
  }
);

app.post("/insert", async (req, res) => {
  const foodName = req.body.foodName;
  const days = req.body.days;
  const food = new FoodModel({ foodName: foodName, daysSinceIAte: days });
  try {
    await food.save();
    res.send("Data added");
  } catch (err) {
    console.log(err, "Post Data failed");
  }
});

app.get("/read", async (req, res) => {
  FoodModel.find({}, (err, result) => {
    if (err) {
      res.send(err, "Get Data failed");
    }
    res.send(result);
  });
});
app.put("/update", async (req, res) => {
  const id = req.body.id;
  const newFoodName = req.body.newFoodName;
  try {
    FoodModel.findById(id, (err, updatedFood) => {
      updatedFood.foodName = newFoodName;
      updatedFood.save();
      res.send("update");
    });
  } catch (err) {
    console.log(err, "Post Data failed");
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await FoodModel.findByIdAndRemove(id).exec();
  res.send("deleted");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
