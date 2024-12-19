import React, { useEffect, useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { QuotationsResume, getAllQuotations, sendEmail } from "../../servicios/quotations";
import Swal, { SweetAlertResult } from "sweetalert2";
import { TypePrices, getAllTypePrices } from "../../servicios/TypePrices";
import { inactiveQuotation } from "../../servicios/quotations";
import { Client, getAllClients } from "../../servicios/clients";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPowerOff,
  faEnvelope
 } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./cotizacion.css";
import styled from "styled-components";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const CotizacionPage: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [quotationsResume, setQuotations] = useState<QuotationsResume[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [typePrices, setTypePrices] = useState<TypePrices[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotationsData = await getAllQuotations();
        const clientData = await getAllClients();
        const typePricesData = await getAllTypePrices();
        setQuotations(quotationsData);
        setTypePrices(typePricesData);
        setClients(clientData);
      } catch (error) {
        console.error("No se han podido traer las cotizaciones: ", error);
      }
    };

    fetchData();
  }, []);

  const goToCrearCotizacion = () => {
    navigate("/Crear_Cotizacion");
  };

  const resendEmail = (row: QuotationsResume) => {
    Swal.fire({
      title: `¿Estás seguro de reenviar el correo de aceptación a ${row.email}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await sendEmail(row.id || "");
          Swal.fire({
            title: "Correo enviado",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo reenviar el correo",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error al enviar el correo:", error);
        }
      }
    });
  }

  const handleDelete = (row: QuotationsResume) => {
    Swal.fire({
      title: `¿Estás seguro de cambiar el estado de la cotización con número de referencia ${row.reference}?`,
      text: "Esta acción podría afectar otros procesos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await inactiveQuotation(row.id || "");
          Swal.fire({
            title: "Estado cambiado",
            text: `Cotización ${row.reference} cambiado`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo cambiar el estado de la cotización.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error al eliminar la cotización:", error);
        }
      }
    });
  };
  const columns = [
    {
      name: "Referencia",
      selector: (row: QuotationsResume) => row.reference,
      sortable: true,
    },
    {
      name: "Cliente",
      selector: (row: QuotationsResume) => {
        const client = clients.find((c) => c.id === row.clientId);
        return client ? client.name : "Cliente no encontrado";
      },
      sortable: true,
    },
    {
      name: "Correo del cliente",
      selector: (row: QuotationsResume) => row.email,
      sortable: true,
    },
    {
      name: "Etapa",
      cell: (row: QuotationsResume) => {
        const getClassForState = (state: string) => {
          switch (state) {
            case "Pendiente":
              return "pending";
            case "Aprobado":
              return "approve";
            case "Rechazada":
              return "refused";
            default:
              return "default-class"; // Clase por defecto para estados no especificados
          }
        };
    
        return (
          <div className={`state ${getClassForState(row.state || "")}`}>
            <p>{row.state}</p>
          </div>
        );
      },
      ignoreRowClick: true,
    },
    {
      name: "Estado",
      cell: (row: QuotationsResume) => (
        <div className={`state ${row.etapa === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.etapa}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Tipo de Evento",
      selector: (row: QuotationsResume) => {
        return typePrices.find((tp) => tp.id === row.typePricesId)?.name;
       
      },
      sortable: true,
    },
    {
      name: "Subtotal",
      selector: (row: QuotationsResume) => row.subtotal,
      sortable: true,
      right: true,
    },
    {
      name: "Descuento",
      selector: (row: QuotationsResume) => row.discount,
      sortable: true,
      right: true,
      format: (row: QuotationsResume) => row.discount.toFixed(2),
    },
    {
      name: "IVA",
      selector: (row: QuotationsResume) => row.IVA,
      sortable: true,
      right: true,
      format: (row: QuotationsResume) => (row.IVA ? row.IVA.toFixed(2) : "0.00"),
    },
    {
      name: "Total Neto",
      selector: (row: QuotationsResume) => row.totalNet,
      sortable: true,
      right: true,
    },
    {
      name: "Enviar correo",
      cell: (row: QuotationsResume) => (
        <button className="btn btn-link" onClick={() => resendEmail(row)}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: QuotationsResume) => (
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
          className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""
            }`}
        >
          <div className="container mt-4">
            <h1 className="text-center titulo-tabla">Tabla de Cotizaciones</h1>
            <div className="botonesC">
              <button
                onClick={goToCrearCotizacion}
                className="btn btn-primary crear"
              >
                <h6>Crear cotización</h6>
              </button>
              <div className="BuscadorC">
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
                data={quotationsResume}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CotizacionPage;