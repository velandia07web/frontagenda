// FormRoll.tsx
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface FormRollProps {
  show: boolean;
  handleClose: () => void;
  role: Role | null;
  isEditing: boolean;
  onSave: (role: Role | null) => void;
}

interface Role {
  id: string;
  name: string;
}

const FormRoll: React.FC<FormRollProps> = ({
  show,
  handleClose,
  role,
  isEditing,
  onSave,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (role) {
      setName(role.name);
    } else {
      setName("");
    }
  }, [role]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedRole = role ? { ...role, name } : { id: "", name }; // ID se manejaría en backend para nuevo rol
    onSave(updatedRole);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Editar Rol" : "Crear Rol"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formRoleName">
            <Form.Label>Nombre del Rol</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre del rol"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormRoll;
