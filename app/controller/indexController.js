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
      const { text, lng, lat, distance, tag } = req.query;
      let query = {};

      if (text) {
        query.$text = { $search: text };
      }

      if (tag) {
        query.tags = tag;
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
