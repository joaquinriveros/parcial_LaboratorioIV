const Book = require('../models/Book');
const Author = require('../models/Author');

// GET /books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /books
exports.createBook = async (req, res) => {
  try {
    const { titulo, genero, publicacion, disponible } = req.body;
    if (!titulo || !genero || !publicacion || disponible === undefined) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const newBook = new Book(req.body);
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /books/:id
exports.updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /books/:id
exports.deleteBook = async (req, res) => {
  try {
    const isAssigned = await Author.findOne({ libros: req.params.id });
    if (isAssigned) {
      return res.status(400).json({ error: 'No se puede eliminar un libro asignado a un autor' });
    }

    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
