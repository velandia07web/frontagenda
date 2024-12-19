import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { SalesResume, getSaleById, EventResume } from "../../servicios/sales";
import { Abono, QuotationPass, createAbono, getAllAbonos, PassPayment,getFile } from "../../servicios/abono";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import "./resumeSales.css";
import FormAbono from "../formAbono/formAbono";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDownload
  } from "@fortawesome/free-solid-svg-icons";
const StyledDataTable = styled((props: any) => <DataTable {...props} />)`
  // Aquí van tus estilos personalizados
`;

interface SalesResumeAllProps {
    show: boolean;
    handleClose: () => void;
    idSales: string;
}

const SalesResumeAll: React.FC<SalesResumeAllProps> = ({
    show,
    handleClose,
    idSales,
}) => {
    const [salesResume, setSalesResume] = useState<SalesResume>();
    const [showAbonoModal, setShowAbonoModal] = useState<boolean>(false); // Estado para el modal de abono
    const [abonos, setAbonos] = useState<QuotationPass>()
    const handleCreate = () => {
        setShowAbonoModal(true); // Abre el modal de abono
    };

    const downloadFile = async (id: string) => {
        try {
          const blob = await getFile(id);
      
          // Crear una URL temporal para el Blob
          const url = window.URL.createObjectURL(blob);
      
          // Crear un enlace temporal para iniciar la descarga
          const link = document.createElement("a");
          link.href = url;
          link.download = `archivo-${id}.jpg`; // Cambia la extensión según el tipo de archivo
          document.body.appendChild(link);
          link.click();
      
          // Limpiar el DOM y la URL temporal
          link.remove();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error al descargar el archivo:", error);
        }
      };

    const handleAbonoSubmit = async (abono: Abono) => {
        try {
            await createAbono(abono)
            const salesData = await getSaleById(salesResume?.saleId!);
            setSalesResume(salesData)
            setShowAbonoModal(false);
            Swal.fire("Abono creado", `Se ha hecho el abono de  $ ${abono.payment} correctamente`, "success");
        } catch (error) {
            Swal.fire("Error", "No se ha podido crear el abono", "error");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener datos de la venta
                const salesData = await getSaleById(idSales);

                // Establecer salesResume para usar su ID de cotización
                setSalesResume(salesData);

                // Verificar si existe un ID de cotización antes de buscar los abonos
                if (salesData.sale?.idQuotation) {
                    const abonosData = await getAllAbonos(salesData.sale.idQuotation);
                    setAbonos(abonosData);
                } else {
                    console.warn("No hay idQuotation disponible para obtener abonos.");
                }

                // Imprimir datos para depuración
                console.log("Datos de abonos:", abonos);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, [idSales]);


    const columnsEvents = [
        { name: "Nombre del evento", selector: (row: EventResume) => row.name, sortable: true },
        { name: "Fecha inicio", selector: (row: EventResume) => row.dateStart, sortable: true },
        { name: "Fecha fin", selector: (row: EventResume) => row.dateEnd, sortable: true },
        { name: "Días", selector: (row: EventResume) => row.days, sortable: true },
        { name: "Total", selector: (row: EventResume) => row.total, sortable: true },
        { name: "Precio del transporte", selector: (row: EventResume) => row.transportPrice, sortable: true },
    ];

    const columnsAbonos = [
        { name: "Cantidad", selector: (row: PassPayment) => row.payment, sortable: true },
        { name: "Recibo", selector: (row: PassPayment) => row.file, sortable: true },
        { name: "Descargar archivo", cell: (row: PassPayment) => (
            <button onClick={() => downloadFile(row.id)} className="btn">
                <FontAwesomeIcon icon={faDownload} />
                </button>
        ), sortable: true },
    ]

    return (
        <>
            <Modal show={show} onHide={handleClose} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Resumen de la Venta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Información de la Cotización */}
                    <h4 className="text-center">Cotización</h4>
                    <div className="d-flex justify-content-center m-4">
                        <div className="row w-100">
                            {/* Columna 1: Títulos */}
                            <div className="col-12 col-md-3">
                                <p style={{ height: '50px' }}><strong>Referencia:</strong></p>
                                <p><strong>Estado:</strong></p>
                                <p><strong>Etapa:</strong></p>
                                <p><strong>Teléfono:</strong></p>
                                <p><strong>Correo:</strong></p>
                                <p><strong>Se creó el:</strong></p>
                            </div>
                            {/* Columna 2: Valores */}
                            <div className="col-12 col-md-3">
                                <p style={{ height: '50px' }}>{salesResume?.sale.Quotation.reference}</p>
                                <p>{salesResume?.sale.Quotation.state}</p>
                                <p>{salesResume?.sale.Quotation.etapa}</p>
                                <p>{salesResume?.sale.Quotation.telephone}</p>
                                <p>{salesResume?.sale.Quotation.email}</p>
                                <p>{salesResume?.sale.Quotation.createdAt}</p>
                            </div>

                            {/* Columna 3: Títulos */}
                            <div className="col-12 col-md-3">
                                <p><strong>Subtotal:</strong></p>
                                <p><strong>Descuento:</strong></p>
                                <p><strong>IVA:</strong></p>
                                <p><strong>Total Neto:</strong></p>
                            </div>
                            {/* Columna 4: Valores */}
                            <div className="col-12 col-md-3">
                                <p>${salesResume?.sale.Quotation.subtotal}</p>
                                <p>${salesResume?.sale.Quotation.discount}</p>
                                <p>{salesResume?.sale.Quotation.IVA}%</p>
                                <p>${salesResume?.sale.Quotation.totalNet}</p>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <h4 className="text-center">Cliente</h4>
                    <div className="d-flex justify-content-center m-4">
                        <div className="row w-100">
                            {/* Columna 1: Títulos */}
                            <div className="col-12 col-md-3">
                                <p><strong>Nombre:</strong></p>
                                <p><strong>Cédula:</strong></p>
                                <p><strong>Cargo:</strong></p>
                                <p><strong>Email:</strong></p>
                            </div>
                            {/* Columna 2: Valores */}
                            <div className="col-12 col-md-3">
                                <p>{salesResume?.sale.Quotation.Client.name} {salesResume?.sale.Quotation.Client.lastName}</p>
                                <p>{salesResume?.sale.Quotation.Client.CC}</p>
                                <p>{salesResume?.sale.Quotation.Client.charge}</p>
                                <p>{salesResume?.sale.Quotation.Client.email}</p>
                            </div>

                            {/* Columna 3: Títulos */}
                            <div className="col-12 col-md-3">
                                <p><strong>Celular:</strong></p>
                                <p><strong>Estado:</strong></p>
                            </div>
                            {/* Columna 4: Valores */}
                            <div className="col-12 col-md-3">
                                <p>{salesResume?.sale.Quotation.Client.celphone}</p>
                                <p>{salesResume?.sale.Quotation.Client.state}</p>
                            </div>
                        </div>
                    </div>



                    <hr />

                    {/* Información de los Eventos */}
                    <h4 className="text-center">Eventos</h4>
                    <div className="table-responsiveResume" >
                        <StyledDataTable
                            columns={columnsEvents}
                            data={salesResume?.sale.Quotation.Events}
                            pagination
                            highlightOnHover
                            pointerOnHover
                            dense
                        />
                    </div>

                    <hr />

                    {/* Información de los Abonos */}
                    <h4 className="text-center">Abonos</h4>
                    <div className="botonesD">
                        <button onClick={handleCreate} className="btn btn-primary btnResume margin">
                            <h6>Añadir nuevo abono</h6>
                        </button>
                    </div>
                    <div className="table-responsiveResume" >
                        <StyledDataTable
                            columns={columnsAbonos}
                            data={abonos?.PassPayments || []} // Extraer los pagos
                            pagination
                            highlightOnHover
                            pointerOnHover
                            dense
                        />

                    </div>

                    <div className="d-flex justify-content-center m-4">
                        <div className="row w-100">
                            {/* Primera Columna */}
                            <div className="col-12 col-md-3">
                                <h5><strong>Subtotal:</strong></h5>
                                <h5><strong>Precio de transporte:</strong></h5>
                                <h5><strong>IVA:</strong></h5>
                                <h5><strong>Total de abonos:</strong></h5>
                                <h5><strong>Total neto:</strong></h5>
                            </div>
                            <div className="col-12 col-md-3">
                                <h5>$ {salesResume?.totalNet}</h5>
                                <h5>$ {salesResume?.totalTransport || 0}</h5>
                                <h5>{salesResume?.IVA}%</h5>
                                <h5>$ {salesResume?.totalAbono}</h5>
                                <h5>$ {(salesResume?.totalNet! - salesResume?.totalAbono!).toFixed(2)}</h5>
                            </div>
                            <div className="col-12 col-md-3">
                                <h5><strong>Método de pago:</strong></h5>
                                <h5><strong>Fecha de pago óptima:</strong></h5>
                            </div>
                            <div className="col-12 col-md-3">
                                <h5>{salesResume?.fechaDePago}</h5>
                                <h5>{salesResume?.methodOfPayment}</h5>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <button className="btn btn-secondary" onClick={handleClose}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Abono */}
            <FormAbono
                show={showAbonoModal}
                handleClose={() => setShowAbonoModal(false)}
                selectedAbono={null}
                quotationId={salesResume?.sale.idQuotation || ""}
                isEditing={false}
                onSubmit={handleAbonoSubmit}
            />
        </>
    );
};

export default SalesResumeAll;
