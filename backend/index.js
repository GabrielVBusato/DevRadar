const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes');
const cors = require('cors')
const app = express();
require('dotenv').config()


const { STRING_CONNECTION, PORT } = process.env


mongoose.connect(STRING_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(cors())
app.use(express.json());
app.use(routes);

// Métodos http: GET (Recuperar), POST (Criar), DELETE (Deletar), PUT(Editar)

// Tipos de parâmetros:

// Query Params: req.query(Filtros, ordenação, paginação, ...)
// Route Params: req.params [Identificar recurso na alteração ou remoção] (Usar no put e delete)
// Body: (Post e put, enviar pelo corpo da requisição) [Dados para criação ou alteração de um registro]

// MongoDB (Não-Relacional)



app.listen(PORT, () => console.log(`App listening on port ${PORT}`));