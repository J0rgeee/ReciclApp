import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const AdminTienda = () => {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productoEdit, setProductoEdit] = useState({
        nombre: '',
        desc: '',
        precio: '',
        stock: '',
        imagen: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // Traer productos
    const traerProductos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/Producto/');
            setProductos(response.data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        }
    };

    useEffect(() => {
        traerProductos();
    }, []);

    // Manejar el modal
    const handleClose = () => {
        setShowModal(false);
        setProductoEdit({
            nombre: '',
            desc: '',
            precio: '',
            stock: '',
            imagen: ''
        });
        setIsEditing(false);
    };

    const handleShow = () => setShowModal(true);

    // Crear/Editar producto
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8000/api/Producto/${productoEdit.idProducto}/`, productoEdit);
                Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
            } else {
                await axios.post('http://localhost:8000/api/Producto/', productoEdit);
                Swal.fire('Éxito', 'Producto creado correctamente', 'success');
            }
            handleClose();
            traerProductos();
        } catch (error) {
            console.error("Error:", error);
            Swal.fire('Error', 'No se pudo guardar el producto', 'error');
        }
    };

    // Editar producto
    const handleEdit = (producto) => {
        setProductoEdit(producto);
        setIsEditing(true);
        handleShow();
    };

    // Eliminar producto
    const handleDelete = async (idProducto) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8000/api/Producto/${idProducto}/`);
                Swal.fire('Eliminado', 'El producto ha sido eliminado', 'success');
                traerProductos();
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Administración de Productos</h2>
            <Button variant="success" onClick={handleShow} className="mb-3">
                Agregar Nuevo Producto
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.idProducto}>
                            <td>{producto.idProducto}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.desc}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.stock}</td>
                            <td>{producto.imagen}</td>
                            <td>
                                <Button 
                                    variant="primary" 
                                    className="me-2"
                                    onClick={() => handleEdit(producto)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    variant="danger"
                                    onClick={() => handleDelete(producto.idProducto)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para crear/editar producto */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={productoEdit.nombre}
                                onChange={(e) => setProductoEdit({...productoEdit, nombre: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={productoEdit.desc}
                                onChange={(e) => setProductoEdit({...productoEdit, desc: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                value={productoEdit.precio}
                                onChange={(e) => setProductoEdit({...productoEdit, precio: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                value={productoEdit.stock}
                                onChange={(e) => setProductoEdit({...productoEdit, stock: e.target.value})}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>URL de la imagen</Form.Label>
                            <Form.Control
                                type="text"
                                value={productoEdit.imagen}
                                onChange={(e) => setProductoEdit({...productoEdit, imagen: e.target.value})}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminTienda;