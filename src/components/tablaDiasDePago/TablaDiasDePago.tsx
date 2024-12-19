import React, { useState, useEffect } from "react";
import { PaymentDates,
  createPaymentDate,
  deletePaymentDate,
  getAllPaymentDates,
  updatePaymentDate
 } from "../../servicios/PaymentsDates";// Importa los servicios
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
//import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TablaDiasDePago.css"; // Importa el archivo CSS
import FormPaymentDates from "../FormDiasDePago/FormDiasDePago";
import Swal from "sweetalert2"; // Importa sweetalert2
import styled from "styled-components";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TablaDiasDePago: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPaymentDate, setSelectedPaymentDate] = useState<PaymentDates | null>(null); // Estado para el registro seleccionado
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentDates, setPaymentDates] = useState<PaymentDates[]>([]); // Estado para los registros
  //const navigate = useNavigate(); // Hook para navegación

  const fetchPaymentDates = async () => {
    try {
      const fetchedPaymentDates = await getAllPaymentDates();
      console.log("paymentDates", fetchedPaymentDates);
      setPaymentDates(fetchedPaymentDates);
    } catch (error) {
      console.error("Error al obtener los días de pago:", error);
    }
  };

  // Llama a fetchPaymentDates al montar el componente
  useEffect(() => {
    fetchPaymentDates();
  }, []);

  const handleEdit = (paymentDate: PaymentDates) => {
    setSelectedPaymentDate(paymentDate);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedPaymentDate(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = async (row: PaymentDates) => {
    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar este registro de ${row.numberDays} días?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletePaymentDate(row.id!); // Asegúrate de que id no sea undefined
        setPaymentDates((prev) => prev.filter((item) => item.id !== row.id));
        Swal.fire("Eliminado", `Registro de ${row.numberDays} días eliminado`, "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el registro", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaymentDate(null);
  };

  const handleModalSubmit = async (paymentDate: PaymentDates) => {
    try {
      if (isEditing && selectedPaymentDate) {
        const updatedPaymentDate = await updatePaymentDate(selectedPaymentDate.id!, paymentDate);
        setPaymentDates((prev) =>
          prev.map((item) => (item.id === selectedPaymentDate.id ? updatedPaymentDate : item))
        );
        Swal.fire("Actualizado", `Registro de ${paymentDate.numberDays} días actualizado`, "success");
      } else {
        const newPaymentDate = await createPaymentDate(paymentDate);
        setPaymentDates((prev) => [...prev, newPaymentDate]);
        Swal.fire("Creado", `Registro de ${paymentDate.numberDays} días creado`, "success");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el registro", "error");
    } finally {
      handleCloseModal();
      fetchPaymentDates();
    }
  };

  const filteredPaymentDates = Array.isArray(paymentDates)
    ? paymentDates.filter((paymentDate) =>
        Object.values(paymentDate).some((value) =>
          value.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    : [];

  const columns = [
    { name: "Número de Días", selector: (row: PaymentDates) => row.numberDays.toString(), sortable: true },
    {
      name: "Editar",
      cell: (row: PaymentDates) => (
        <button className="btn btn-link" onClick={() => handleEdit(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Eliminar",
      cell: (row: PaymentDates) => (
        <button className="btn btn-link" onClick={() => handleDelete(row)}>
          <FontAwesomeIcon icon={faPowerOff} />
        </button>
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="d-flex flex-grow-1 tablaClien">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}
        >
          <div className="containerZ">
            <h1 className="text-center titulo-tabla">Tabla de Días de Pago</h1>
            <div className="botonesZ">
              <button onClick={handleCreate} className="btn btn-primary crear">
                <h6>Crear Registro</h6>
              </button>
              <div className="BuscadorZ">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={filteredPaymentDates}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <FormPaymentDates
          show={showModal}
          handleClose={handleCloseModal}
          selectedPaymentDate={selectedPaymentDate}
          isEditing={isEditing}
          onSubmit={handleModalSubmit} // Pasa la función de envío al formulario
        />
      )}
    </div>
  );
};

export default TablaDiasDePago;
