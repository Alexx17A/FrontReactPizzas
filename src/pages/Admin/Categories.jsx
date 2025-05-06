import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Spinner } from 'react-bootstrap';
import categoryService from '../../services/categoryService';
import ModalNotification from '../../components/ModalNotification';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.content);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      setNotificationMessage('Categoría eliminada correctamente');
      setShowNotification(true);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setNotificationMessage('Error al eliminar la categoría');
      setShowNotification(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const categoryData = Object.fromEntries(formData.entries());
      
      if (currentCategory) {
        await categoryService.updateCategory(currentCategory.categoryId, categoryData);
        setNotificationMessage('Categoría actualizada correctamente');
      } else {
        await categoryService.createCategory(categoryData);
        setNotificationMessage('Categoría creada correctamente');
      }
      
      setShowModal(false);
      setShowNotification(true);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setNotificationMessage('Error al guardar la categoría');
      setShowNotification(true);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
        <h2>Categorías</h2>
        <Button variant="primary" onClick={() => {
          setCurrentCategory(null);
          setShowModal(true);
        }}>
          Agregar Categoría
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.categoryId}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(category.categoryId)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para agregar/editar categoría */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCategory ? 'Editar Categoría' : 'Agregar Categoría'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="name"
                defaultValue={currentCategory?.name || ''}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                defaultValue={currentCategory?.description || ''}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ModalNotification
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />
    </>
  );
};

export default Categories;