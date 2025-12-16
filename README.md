# MongoDB Indexing Demo (Express.js + Mongoose)
---

## 🚀 Features

* Express.js REST API
* MongoDB with Mongoose
* Demonstrates:

  * Single Field Index
  * Compound Index
  * Unique Index
  * Sparse Index
  * Partial Index
  * Text Index
* Example queries to showcase index benefits

---

## 🧱 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## 📁 Project Structure

```
indexing-demo/
│
├── app.js
├── package.json
├── .env
│
├── config/
│   └── db.js
│
├── models/
│   └── IndexModel.js
│
├── controllers/
│   └── indexController.js
│
├── routes/
│   └── indexRoutes.js
│
└── README.md
```

---

## 🔗 Database Connection (`config/db.js`)

```js
const mongoose = require("mongoose");
const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;
```

---

## 🧩 Mongoose Schema with Indexes (`models/IndexModel.js`)

```js
const mongoose = require('mongoose');

const indexSchema = new mongoose.Schema({
    username: { //single-field + unique
        type: String,
        required: true,
        unique: true
    },
    email:{ //unique index
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    tags: [String], //multikey index
    description: String, // text index
    location:{
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // longitude,latitude
        },
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
},
    { timestamps: true }
);

//indexing

indexSchema.index({ firstName: 1, lastName: 1 }); //compound index

indexSchema.index({ tags: 1 }); //multikey index

indexSchema.index({ description: "text" }); //text index

indexSchema.index({ location: "2dsphere" }); //geospatial index

indexSchema.index({ status: 1 }, { partialFilterExpression: { status: "active" }}); //partial index

module.exports = mongoose.model("Index",indexSchema);
```

---

## 🎮 Controller (`controllers/indexController.js`)

```js
const Index = require("../model/indexModel");

class indexController {
  //add doc
  async createIndex(req, res) {
    try {
      const doc = await Index.create(req.body);
      const totalCount = await Index.countDocuments();

      return res.status(201).json({
        message: "Document created successfully",
        totalDocuments: totalCount,
        data: doc,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  //list doc with filters(index-single,compound,partial)
  async getAll(req, res) {
    try {
      const { status, tag, firstName } = req.query;
      let query = {};

      if (status) query.status = status;
      if (tag) query.tags = tag;
      if (firstName) query.firstName = firstName;

      const data = await Index.find(query);
      const count = data.length;
      return res.json({
        message: "Document fetched successfully",
        count,
        data,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //search api text,multikey,geospatial
  async search(req, res) {
    try {
      const { text, lng, lat, distance, tag, name, email } = req.query;
      let query = {};
    // name, emil, description
      if (text) {
        query.$text = { $search: text };
      }

      if (tag) {
        query.tags = tag;
      }

      if (name) {
        query.name = { $regex: name, $options: "i"};
      }

      if (email) {
        query.email = { $regex: email, $options: "i"};
      }

      if (lng && lat) {
        query.location = {
          $near: {
            $geometry: {
              type: "point",
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            $maxDistance: parseInt(distance) || 5000,
          },
        };
      }

      const result = await Index.find(query);
      const count = result.length;
      return res.json({
        message: "Search results fetched successfully",
        count,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new indexController();
```

---

## 🛣 Routes (`routes/indexRoutes.js`)

```js
const express = require('express');
const indexController = require('../controller/indexController');

const router = express.Router();

router.post('/createIndex',indexController.createIndex);
router.get('/getAll',indexController.getAll);
router.get('/search',indexController.search);

module.exports = router;
```

---

## ⚙️ App Setup (`app.js`)

```js
require('dotenv').config();
const express = require('express');
const connectdb = require('./app/config/db');

connectdb();

const app = express();
app.use(express.json());

const indexRoutes = require('./app/routes/indexRoutes');
app.use('/api', indexRoutes);


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});



module.exports = app;
```

---

## 🔍 Example Queries & Index Benefits

### 1️⃣ Single Field Index

```js
Index.find({ name: "Rahul" })
```

✔ Faster search on `name`

---

### 2️⃣ Compound Index

```js
Index.find({ firstName: "deepika", lastName: "Rani" })
```

✔ Efficient filtering using firstName + lastName

---

### 3️⃣ Unique Index

```js
Index.create({ email: "test@mail.com" })
```

✔ Prevents duplicate emails

---

### 4️⃣ Text Index

```js
Index.find({ $text: { $search: "developer" } })
```

✔ Full-text search support

---

### 5️⃣ Partial Index

```js
Index.find({ status: "ACTIVE" })
```

✔ Index applies only to ACTIVE records → better performance

---

## 📘 Index Use Cases Explained

| Index Type | Use Case                     |
| ---------- | ---------------------------- |
| Single     | Filter by one field          |
| Compound   | Filter by multiple fields    |
| Unique     | Prevent duplicate data       |
| Text       | Search in large text         |
| Partial    | Optimize specific conditions |

---

---

## 📌 How to Run

```bash
npm install
npm start

