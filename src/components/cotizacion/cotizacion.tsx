import React, { useEffect, useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { QuotationsResume, getAllQuotations } from "../../servicios/quotations";
import { TypePrices, getAllTypePrices } from "../../servicios/TypePrices";
import { Client, getAllClients } from "../../servicios/clients";
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
      name: "Tipo de Evento",
      selector: (row: QuotationsResume) => {
        const typePrice = typePrices.find((tp) => tp.id === row.typePricesId);
        if (typePrice) {
          if (typePrice.name === "Precio Publico") return "Evento Empresarial";
          if (typePrice.name === "Precio con Descuento") return "Evento Social";
        }
        return "Tipo de evento no encontrado";
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
    }
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="d-flex flex-grow-1 tablaClien">
        <SlideMenu onToggleMenu={setIsSlideMenuExpanded} />
        <main
          className={`content-area-table ${
            isSlideMenuExpanded ? "expanded" : ""
          }`}
        >
          <div className="container mt-4">
            <h1 className="text-center titulo-tabla">Tabla de Cotizaciones</h1>
            <div className="botones">
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