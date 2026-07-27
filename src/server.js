import cors from 'cors';
import express from 'express';
import usuarioRoutes from './routes/usuario.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`Backend de usuarios disponible en http://localhost:${PORT}/api/usuarios`);
});
