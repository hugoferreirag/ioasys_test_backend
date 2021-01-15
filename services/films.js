const films = require("../models/films");
const methods = require("../methods");

const filmsService = {
  save: async (req, res) => {
    const { name, description, genre, actors, director } = req.body;
    try {
      if (!name || !description || !genre || !actors || !director)
        throw { msg: "Dados inválidos", status: 400 };

      const existsFilm = await films.findOne({ name, director });

      if (existsFilm) throw { msg: "Filme já existe no sistema", status: 400 };
      const data = await films.create({
        name,
        description,
        genre,
        actors,
        director,
      });
      res.status(201).json(data);
      return;
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
  getAll: async (req, res) => {
    const { page = 1, perPage = 10 } = req.body;
    try {
      const count = await films.countDocuments("films");
      const countPage = page - 1;
      const limit = perPage;
      const skip = limit * countPage - 1 + 1;

      const items = await films
        .find({ deletedAt: null })
        .skip(skip)
        .limit(limit);

      res.status(200).json({ items, total: count });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  filter: async (req, res) => {
    const { name, director, genre } = req.body;
    try {
      if (name) {
        const data = await films.find({
          name: { $regex: new RegExp(name), $options: "i" },
        });
        res.status(200).json(data);
        return;
      }
      if (director) {
        const data = await films.find({
          director: { $regex: new RegExp(director), $options: "i" },
        });
        res.status(200).json(data);
        return;
      }
      if (genre) {
        const data = await films.find({
          genre: {
            $regex: new RegExp(genre),
            $options: "i",
          },
        });
        res.status(200).json(data);
        return;
      }

      const data = await films.find();
      res.status(200).json(data);
      return;
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) throw { msg: "Id não informado", status: 400 };
      const existsFilm = await films.findOne({ _id: id });
      if (existsFilm.deletedAt) throw { msg: "Filme não existe", status: 400 };
      await films.updateOne(
        { _id: id },
        { ...existsFilm._doc, deletedAt: new Date() }
      );
      res.status(200).json({ msg: "Filme deletado com suceso" });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
  vote: async (req, res) => {
    const { vote } = req.body;
    const { id } = req.params;
    try {
      if (!id) throw { msg: "Id inválidos", status: 400 };
      if (!vote) throw { msg: "Avaliação inválida", status: 400 };
      const existsFilm = await films.findOne({ _id: id });
      if (!existsFilm) throw { msg: "Filme não existe", status: 400 };
      let userVoted = existsFilm._doc.rating.filter(
        (el) => el.idUser === req.userId
      );
      userVoted = userVoted[0];
      let updatedRating = existsFilm._doc.rating;
      if (!userVoted) updatedRating.push({ idUser: req.userId, vote });
      if (userVoted)
        throw {
          status: 400,
          msg: "Este filme já tem um voto registrado pelo mesmo usuário",
        };
      const average = methods.extractAverageVote(updatedRating);
      existsFilm._doc.rating = updatedRating;
      existsFilm._doc.average = parseInt(average);
      await films.updateOne({ _id: id }, existsFilm._doc);
      res.status(200).json(existsFilm._doc);
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
};

module.exports = filmsService;
