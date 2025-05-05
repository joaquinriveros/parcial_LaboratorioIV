const Author = require('../models/Author');
const Book = require('../models/Book');

// GET /authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate('libros');
    res.json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /authors/:id
exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id).populate('libros');
    if (!author) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /authors
exports.createAuthor = async (req, res) => {
  try {
    const { nombre, fechaNacimiento, nacionalidad } = req.body;
    if (!nombre || !fechaNacimiento || !nacionalidad) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const newAuthor = new Author(req.body);
    const saved = await newAuthor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /authors/:id
exports.updateAuthor = async (req, res) => {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /authors/:id
exports.deleteAuthor = async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Autor no encontrado' });
    res.json({ message: 'Autor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /authors/:id/addBook/:bookId
exports.addBookToAuthor = async (req, res) => {
  try {
    const { id, bookId } = req.params;
    const author = await Author.findById(id);
    const book = await Book.findById(bookId);

    if (!author || !book) {
      return res.status(404).json({ error: 'Autor o libro no encontrado' });
    }

    if (!author.libros.includes(bookId)) {
      author.libros.push(bookId);
      await author.save();
    }

    res.json({ message: 'Libro agregado al autor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
