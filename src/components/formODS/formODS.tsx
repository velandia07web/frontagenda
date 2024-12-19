import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./FormODS.css"; // Asegúrate de tener un archivo CSS actualizado para los estilos personalizados
import { Event } from "../../servicios/Events";
import { getAllUsers, User } from "../../servicios/user";

interface FormEventProps {
  show: boolean;
  handleClose: () => void;
  selectedEvent: Event | null;
  isEditing: boolean;
  onSubmit: (event: Event) => Promise<void>;
}

const FormODS: React.FC<FormEventProps> = ({
  show,
  handleClose,
  selectedEvent,
  isEditing,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Event>({
    id: "",
    name: "",
    cityId: "",
    dateStart: "",
    dateEnd: "",
    total: 0,
    days: 0,
    transportPrice: 0,
    status: "",
    personName: "",
    personPhone: "",
    eventImage: "",
    eventDescription: "",
    location: "",
    coordinatorId: "",
    designerId: "",
    logisticId: "",
    createdAt: "",
    updatedAt: "",
  });
  const [usersData, setUsersData] = useState<User[]>([]);

  useEffect(() => {
    if (isEditing && selectedEvent) {
      setFormData({
        id: selectedEvent.id || "",
        name: selectedEvent.name || "",
        cityId: selectedEvent.cityId || "",
        dateStart: selectedEvent.dateStart || "",
        dateEnd: selectedEvent.dateEnd || "",
        total: selectedEvent.total || 0,
        days: selectedEvent.days || 0,
        transportPrice: selectedEvent.transportPrice || 0,
        status: selectedEvent.status || "",
        personName: selectedEvent.personName || "",
        personPhone: selectedEvent.personPhone || "",
        eventImage: selectedEvent.eventImage || "",
        eventDescription: selectedEvent.eventDescription || "",
        location: selectedEvent.location || "",
        coordinatorId: selectedEvent.coordinatorId || "",
        designerId: selectedEvent.designerId || "",
        logisticId: selectedEvent.logisticId || "",
        createdAt: selectedEvent.createdAt || "",
        updatedAt: selectedEvent.updatedAt || "",
      });
    } else {
      setFormData({
        id: "",
        name: "",
        cityId: "",
        dateStart: "",
        dateEnd: "",
        total: 0,
        days: 0,
        transportPrice: 0,
        status: "",
        personName: "",
        personPhone: "",
        eventImage: "",
        eventDescription: "",
        location: "",
        coordinatorId: "",
        designerId: "",
        logisticId: "",
        createdAt: "",
        updatedAt: "",
      });
    }

    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsersData(users);
    };

    fetchUsers();
  }, [isEditing, selectedEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    handleClose();
  };

  // Cambiar tipo del evento de forma más flexible
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        eventImage: file.name, // Puedes manejar el archivo de manera diferente si es necesario
      }));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Evento" : "Crear Evento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="personName">
            <Form.Label>Contacto para el montaje</Form.Label>
            <Form.Control
              type="text"
              name="personName"
              value={formData.personName}
              onChange={handleChange}
              placeholder="Nombre de la persona"
            />
          </Form.Group>

          <Form.Group controlId="personPhone">
            <Form.Label>Teléfono del contacto</Form.Label>
            <Form.Control
              type="text"
              name="personPhone"
              value={formData.personPhone}
              onChange={handleChange}
              placeholder="Teléfono"
            />
          </Form.Group>

          {/* Input File para Imagen del Evento */}
          <Form.Group controlId="eventImage">
            <Form.Label>Imagen del Evento</Form.Label>
            <Form.Control
              type="file"
              name="eventImage"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group controlId="eventDescription">
            <Form.Label>Descripción del Evento</Form.Label>
            <Form.Control
              type="text"
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleChange}
              placeholder="Descripción"
            />
          </Form.Group>

          <Form.Group controlId="location">
            <Form.Label>Dirección del evento</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ubicación"
            />
          </Form.Group>

          {/* Select de Coordinador */}
          <Form.Group controlId="coordinatorId">
            <Form.Label>Coordinador</Form.Label>
            <Form.Control
              as="select"
              name="coordinatorId"
              value={formData.coordinatorId}
              onChange={handleChange}
            >
              <option value="">Selecciona un coordinador</option>
              {usersData.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Select de Diseñador */}
          <Form.Group controlId="designerId">
            <Form.Label>Diseñador</Form.Label>
            <Form.Control
              as="select"
              name="designerId"
              value={formData.designerId}
              onChange={handleChange}
            >
              <option value="">Selecciona un diseñador</option>
              {usersData.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Select de Logística */}
          <Form.Group controlId="logisticId">
            <Form.Label>Logística</Form.Label>
            <Form.Control
              as="select"
              name="logisticId"
              value={formData.logisticId}
              onChange={handleChange}
            >
              <option value="">Selecciona un responsable de logística</option>
              {usersData.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button className="btn btn-secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button className="btn btn-primary" type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Evento"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormODS;
