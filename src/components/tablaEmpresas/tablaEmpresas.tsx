import React, { useEffect, useState } from "react";
import SlideMenu from "../SlideMenu/SlideMenu";
import NavbarComponent from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faEdit, faPowerOff, faPlus } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./tablaEmpresas.css";
import FormCompanies from "../formCompany/formCompany.tsx";
import Swal, { SweetAlertResult } from "sweetalert2";
import styled from "styled-components";
import { Company, getAllCompanies, deleteCompany, createCompany, putCompany } from "../../servicios/Company.tsx";
import { getAllPaymentDates, PaymentDates } from "../../servicios/PaymentsDates.tsx";

const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

const TablaEmpresas: React.FC = () => {
  const [isSlideMenuExpanded, setIsSlideMenuExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [showModalCompany, setShowModalCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [companyList, setCompanyList] = useState<Array<Company>>(); 
  const [PaymentDates, setPaymentDates] = useState<Array<PaymentDates>>([]);
  const navigate = useNavigate();

  const handleToggleMenu = (isExpanded: boolean) => setIsSlideMenuExpanded(isExpanded);
  const handleGoToHome = () => navigate("/home");

  const handleOpenModalClientes = (company?: Company) => {
    setSelectedCompany(company); // Establece la empresa seleccionada o ninguna
    setShowModalCompany(true);
  };

  const handleCloseModalClientes = () => {
    setShowModalCompany(false);
    setSelectedCompany(undefined); // Limpia la empresa seleccionada
  };

  const handleSaveCompany = async (newCompany: Company) => {
    try {
      if (newCompany.id) {
        const updatedCompany = await putCompany(newCompany.id, newCompany);
        setCompanyList((prevCompanies) =>
          prevCompanies?.map((company) =>
            company.id === updatedCompany.id ? updatedCompany : company
          )
        );
        Swal.fire("Actualizado", "La empresa fue actualizada exitosamente", "success");
      } else {
        const createdCompany = await createCompany(newCompany);
        setCompanyList((prevCompanies) => [...(prevCompanies || []), createdCompany]);
        window.location.reload()
        Swal.fire("Creado", "La nueva empresa fue creada exitosamente", "success");
      }
      
      setShowModalCompany(false);
    } catch (error) {
      console.error("Error al guardar la empresa: ", error);
      Swal.fire("Error", "Hubo un problema al guardar la empresa", "error");
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getAllCompanies();
        const PaymentDatesData = await getAllPaymentDates()
        setPaymentDates(PaymentDatesData)
        setCompanyList(companiesData);
      } catch (error) {
        console.error("Error al obtener todas las empresas: ", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (row: Company) => {
    Swal.fire({
      title: `¿Estás seguro de cambiar el estado a ${row.name}?`,
      text: "Esta acción podría afectar otros procesos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await deleteCompany(row.id || "");
          Swal.fire({
            title: "Estado cambiado",
            text: `Empresa ${row.name} cambiado`,
            icon: "success",
            confirmButtonText: "OK",
          });
          window.location.reload()
          setCompanyList(companyList?.filter((company) => company.id !== row.id));
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo cambiar el estado de la empresa.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.error("Error al eliminar la empresa:", error);
        }
      }
    });
  };

  const filteredCompanies = companyList?.filter((company) =>
    Object.values(company).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const columns = [
    { name: "Nombre", selector: (row: Company) => row.name, sortable: true },
    { name: "Nombre Legal", selector: (row: Company) => row.legalName, sortable: true },
    { name: "Correo", selector: (row: Company) => row.email, sortable: true },
    {
      name: "Estado",
      cell: (row: Company) => (
        <div className={`state ${row.state === "ACTIVO" ? "active" : "inactive"}`}>
          <p>{row.state}</p>
        </div>
      ),
      ignoreRowClick: true,
    },
    { name: "Tipo de pago", selector: (row: Company) => row.typePayment, sortable: true },
    {
      name: "Días de pago",
      cell: (row: Company) => {
        const payment = PaymentDates.find((pd) => pd.id === row.idPaymentsDate);
        return payment ? payment.numberDays + " Días" : "No definido"; // Devuelve el número de días o un valor predeterminado
      },
      sortable: true,
    },
    { name: "Teléfono", selector: (row: Company) => row.phone, sortable: true },
    { name: "Dirección", selector: (row: Company) => row.address || "No especificado", sortable: true },
    { name: "Sitio Web", selector: (row: Company) => row.website || "No especificado", sortable: true },
    { name: "Industria", selector: (row: Company) => row.industry || "No especificado", sortable: true },
    {
      name: "Editar",
      cell: (row: Company) => (
        <button className="btn btn-link" onClick={() => handleOpenModalClientes(row)}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Desactivar",
      cell: (row: Company) => (
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
        <SlideMenu onToggleMenu={handleToggleMenu} />
        <main className={`content-area-table ${isSlideMenuExpanded ? "expanded" : ""}`}>
          <div className="container mt-4">
            <div className="botones">
              <div className="botonR">
                <button className="btn btn-primary" onClick={handleGoToHome}>
                  <FontAwesomeIcon icon={faUsers} /> Regresar
                </button>
              </div>

              <div className="botonA">
                <button
                  onClick={() => handleOpenModalClientes()}
                  className="btn btn-primary"
                >
                  <FontAwesomeIcon icon={faPlus} /> Añadir empresa
                </button>
              </div>

              <div className="Buscador">
                <input
                  type="text"
                  className="form-control buscador"
                  placeholder="Buscar en la tabla..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <StyledDataTable
                columns={columns}
                data={filteredCompanies}
                pagination
                highlightOnHover
                pointerOnHover
                dense
              />
            </div>
          </div>
        </main>
      </div>
      {showModalCompany && (
        <FormCompanies
          show={showModalCompany}
          handleClose={handleCloseModalClientes}
          companyData={selectedCompany}
          onSave={handleSaveCompany}
        />
      )}
    </div>
  );
};

export default TablaEmpresas;
