require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bookRoutes = require('./routes/books');
const authorRoutes = require('./routes/authors');

require('./models/Book');
require('./models/Author');

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error de conexión:', err));

app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

