import React, { useEffect, useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tableSales.css";
import styled from "styled-components";
import { getAllSales, Sales, getAllSalesByUser } from "../../servicios/sales"; 
import { getRoleById } from "../../servicios/rol";
import SalesResumeAll from "../resumeSales/resumeSales";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TableSales: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [salesData, setSalesData] = useState<Sales[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null); // ID de la venta seleccionada

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const roleId = localStorage.getItem("rol");
        const id = localStorage.getItem("userId");
  
        if (!roleId || !id) {
          console.error("Role ID o User ID no encontrados en localStorage");
          return;
        }
  
        const rol = await getRoleById(roleId);
        let sales;
        if (rol.name === "Superadministrador" || rol.name === "Contable") {
          sales = await getAllSales();
        } else if (rol.name === "Comercial") {
          sales = await getAllSalesByUser(id);
        }
  
        if (sales) {
          setSalesData(sales);
        } else {
          console.warn("No se encontraron ventas.");
        }
      } catch (error) {
        console.error("Error al obtener las ventas: ", error);
      }
    };
  
    fetchSales();
  }, []);
  

  const handleBringSale = (id: string) => {
    setSelectedSaleId(id); // Establece el ID de la venta seleccionada
    setShowModal(true); // Muestra el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
    setSelectedSaleId(null); // Resetea el ID de la venta seleccionada
  };

  const columns = [
    {
      name: "Id de venta",
      selector: (row: Sales) => row.saleId,
      sortable: true,
    },
    {
      name: "Cliente",
      selector: (row: Sales) => row.clientName,
      sortable: true,
    },
    {
      name: "Etapa",
      selector: (row: Sales) => row.etapa,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row: Sales) => row.state,
      sortable: true,
    },
    {
      name: "Subtotal",
      selector: (row: Sales) => row.subtotal,
      sortable: true,
    },
    {
      name: "Total de transporte",
      selector: (row: Sales) => row.totalTransport,
      sortable: true,
    },
    {
      name: "IVA",
      selector: (row: Sales) => row.IVA,
      sortable: true,
    },
    {
      name: "Total abonos",
      selector: (row: Sales) => row.totalPayments,
      sortable: true,
    },
    {
      name: "Pendiente de pago",
      selector: (row: Sales) => row.pendingPayment,
      sortable: true,
    },
    {
      name: "Fecha de pago",
      selector: (row: Sales) => row.invoiceDate,
      sortable: true,
    },
    {
      name: "Total a pagar",
      selector: (row: Sales) => {
        const totalNet = row.totalNet || 0;
        const totalAbono = row.totalPayments || 0;
        return (totalNet - totalAbono).toFixed(2);  // Calcula y formatea el valor
      },
      sortable: true,
    },
    {
      name: "Ver más",
      cell: (row: Sales) => (
        <button
          className="btn btn-link"
          onClick={() => handleBringSale(row.saleId || "")}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
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
            <h1 className="text-center titulo-tabla">Tabla de Ventas</h1>
            <div className="botonesC">
              <div className="BuscadorC">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar método de pago"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={salesData}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>

      {/* Render del modal */}
      {showModal && selectedSaleId && (
        <SalesResumeAll
          show={showModal}
          handleClose={handleCloseModal}
          idSales={selectedSaleId}
        />
      )}
    </div>
  );
};

export default TableSales;
