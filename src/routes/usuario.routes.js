import { Router } from 'express';
import {
    actualizarUsuario,
    crearUsuario,
    eliminarUsuario,
    obtenerUsuarioPorId,
    obtenerUsuarios
} from '../controllers/usuario.controller.js';

const router = Router();

router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
