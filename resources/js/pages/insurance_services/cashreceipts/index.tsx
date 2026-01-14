import api from '@/utils/axiosConfig';
import { Toast } from 'primereact/toast';
import Cashreceipts from './cashreceipts';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Dropdown } from 'primereact/dropdown';
import { Head, usePage } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { useState, useEffect, useRef } from 'react';
import { SplitButton } from 'primereact/splitbutton';
import { generateCashreceipts } from '@/routes/reports/index';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { index, markAsPaid, destroy } from '@/routes/cashreceipts/index';
import {
  File, Files,
  SquarePen, DollarSign,
  Trash, SquareMenu,
  Info
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Lista Recibos de caja',
    href: index().url,
  },
];

interface User {
  id: number;
  name: string;
  email: string;
  companies_id: number;
  companie: Companie | null;
}

interface Companie {
  id: number;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  document: string;
  dv: number
}

export default function CashreceiptsIndex({user, cashreceipts}: {user: User, cashreceipts: any[]}) {
  const [visibleCashReceipts, setVisibleCashReceipts] = useState<boolean>(false);
  const [companie, setCompanie] = useState<Companie | null>(user.companie ?? null);
  const [allCompanies, setAllCompanies] = useState<Companie[] | null>(user.companie ? [user.companie] : null);
  const [idCashreceipt, setIdCashreceipt] = useState<number | null>(null);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const toastMessage = useRef<Toast | null>(null);

  useEffect(() => {
    if (allCompanies == null && user.companie == null) {
      getCompanies().then((data) => {
        if (data == null) return;
        setAllCompanies(data);
      });
    }
  }, [allCompanies, user.companie]);

  const getCompanies = async () => {
    try {
      const response = await api.get<Companie[]>(`/insurance-services/companies/all`);
      const data = response.data;
      return data;
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      return null;
    } finally {

    }
  }

  const headerTemplate = (data: any) => {
    return (
      <div className="flex align-items-center gap-2">
        {/* <img alt={data.representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${data.representative.image}`} width="32" /> */}
        <span className="font-bold">{data.client_name} - {data.client_document}</span>
      </div>
    );
  };

  const balanceBodyTemplate = (rowData: any) => {
    return formatCurrency(rowData.total);
  };

  const formatCurrency = (value: any) => {
    return `${value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
  };

  const payingBodyTemplate = (rowData: any) => {
    return <Message severity={rowData.paying ? 'success' : 'error'} text={rowData.paying ? 'Pago' : 'No Pago'} />
  };

  const accionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton 
          icon={<SquareMenu size={16} />}
          className='p-button-info'
          size='small'
          model={[
            {
              template: () => {
                return (
                  <Button 
                    icon={<DollarSign size={16} className='mr-2'/>}
                    className="p-button-success w-full flex justify-start"
                    size="small"
                    tooltip='Pagar'
                    tooltipOptions={{position: 'top'}}
                    label='Pagar'
                    onClick={() => confirmDialog({
                      message: '¿Está seguro que desea marcar este recibo como pagado?',
                      header: `Confirmar Pago del Recibo ${rowData.numberdocument}`,
                      icon: <Info size={16} />,
                      acceptLabel: 'Sí',
                      rejectLabel: 'No',
                      acceptClassName: 'p-button-success',
                      accept: () => {
                        api.post(markAsPaid(rowData.id).url)
                          .then((response) => {
                            showMessage('success', 'Éxito', response.data.message);
                          })
                          .catch((error) => {
                            console.error('Error marking as paid:', error);
                          })
                          .finally(() => {
                            // Abrir en una nueva pestaña usando la URL generada
                            window.open(generateCashreceipts.url({ cashreceipt_id: rowData.id }), '_blank');
                            setTimeout(() => {
                              window.location.reload();
                            }, 1500);
                          });
                      }
                    })}
                    disabled={rowData.paying ? true : false}
                    text
                    raised
                  />
                );
              }
            },
            {
              template: () => {
                return (
                  <Button
                    icon='pi pi-file-pdf'
                    className='p-button-help w-full flex justify-start'
                    size='small'
                    tooltip='PDF'
                    tooltipOptions={{position: 'top'}}
                    label='PDF'
                    onClick={() => {
                      // Abrir en una nueva pestaña usando la URL generada
                      window.open(generateCashreceipts.url({ cashreceipt_id: rowData.id }), '_blank');
                    }}
                    disabled={!rowData.paying ? true : false}
                    text
                    raised
                  />
                );
              }
            },
            {
              template: () => {
                return (
                  <Button
                    icon={<SquarePen size={16} className='mr-2' />}
                    className="p-button-warning w-full flex justify-start"
                    size="small"
                    tooltip='Editar'
                    tooltipOptions={{position: 'top'}}
                    label='Editar'
                    onClick={() => confirmDialog({
                      message: '¿Está seguro que desea editar este recibo?',
                      header: `Editar el Recibo ${rowData.numberdocument}`,
                      icon: <Info size={16} />,
                      acceptLabel: 'Sí',
                      rejectLabel: 'No',
                      acceptClassName: 'p-button-warning',
                      accept: () => {
                        setCompanie(user.companie);
                        setIdCashreceipt(rowData.id);
                        setVisibleCashReceipts(true);
                        setIsDuplicate(false);
                      }
                    })}
                    text
                    raised
                    disabled={rowData.paying ? true : false}
                  />
                );
              }
            },
            {
              template: () => {
                return (
                  <Button
                    icon={<Files size={16} className='mr-2' />}
                    className="p-button-secondary w-full flex justify-start"
                    size="small"
                    tooltip='Duplicar'
                    tooltipOptions={{position: 'top'}}
                    label='Duplicar'
                    onClick={() => confirmDialog({
                      message: '¿Está seguro que desea duplicar este recibo?',
                      header: `Duplicar el Recibo ${rowData.numberdocument}`,
                      icon: <Info size={16} />,
                      acceptLabel: 'Sí',
                      rejectLabel: 'No',
                      acceptClassName: 'p-button-secondary',
                      accept: () => {
                        setCompanie(user.companie);
                        setIdCashreceipt(rowData.id);
                        setVisibleCashReceipts(true);
                        setIsDuplicate(true);
                      }
                    })}
                    text
                    raised
                  />
                );
              }
            },
            {
              template: () => {
                return (
                  <Button
                    icon={<Trash size={16} className='mr-2' />}
                    className="p-button-danger w-full flex justify-start"
                    size="small"
                    tooltip='Eliminar'
                    tooltipOptions={{position: 'top'}}
                    label='Eliminar'
                    onClick={() => confirmDialog({
                      message: '¿Está seguro que desea eliminar este recibo?',
                      header: `Eliminar el Recibo ${rowData.numberdocument}`,
                      icon: <Info size={16} />,
                      acceptLabel: 'Sí',
                      rejectLabel: 'No',
                      acceptClassName: 'p-button-danger',
                      accept: () => {
                        // Lógica para eliminar el recibo
                      }
                    })}
                    text
                    raised
                    disabled={rowData.paying ? true : false}
                  />
                );
              }
            }
          ]}
          raised 
          text
        />
      </div>
    );
  }

  const showMessage = (severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast", summary: string, detail: string) => {
    if (toastMessage.current != null) {      
      toastMessage.current.show({ severity: `${severity}`, summary: `${summary}`, detail: `${detail}` });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cash Receipts" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Toast ref={toastMessage} />
        <div className="grid auto-rows-min gap-4 grid-cols-12">
          <div className='col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12'>
            <Button
              label='Nuevo'
              className='float-right'
              icon={<File size={16} className='mr-1'/>}
              size='small'
              onClick={() => {
                setVisibleCashReceipts(!visibleCashReceipts)
                setIdCashreceipt(null);
                setIsDuplicate(false);
                if (user.companie != null) {
                  setCompanie(user.companie);
                } else {
                  setCompanie(null);
                }
              }}
              text
              raised
            />
          </div>
          <div className='col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12'>
            <ConfirmDialog />
            <DataTable 
              value={cashreceipts} 
              responsiveLayout="scroll" 
              paginator 
              rows={10} 
              sortField={'client_name'}
              sortOrder={1}
              className="mt-4"
              sortMode="multiple"
              emptyMessage={<div className="text-center">No hay recibos de caja.</div>}
              showGridlines
              rowGroupMode="subheader" 
              groupRowsBy="client_name"
              rowGroupHeaderTemplate={headerTemplate}
              scrollable 
            >
              <Column 
                field="item" 
                header="It" 
                sortable
                frozen
              ></Column>
              <Column 
                field="numberdocument" 
                header="Número" 
                sortable
              ></Column>
              <Column 
                field="datehour" 
                header="Fecha" 
                sortable
              ></Column>
              <Column 
                field="client_name" 
                header="Cliente" 
                sortable
              ></Column>
              <Column 
                field='paying' 
                header="Pago / No Pago"
                body={payingBodyTemplate}
              ></Column>
              <Column 
                field="total" 
                header="Total" 
                dataType="numeric" 
                body={balanceBodyTemplate} 
                // filter 
                // filterElement={balanceFilterTemplate} 
                sortable
              ></Column>
              <Column 
                header="Acciones"
                body={accionBodyTemplate}
                alignFrozen="right" 
                frozen
              ></Column>
            </DataTable>
          </div>
        </div>
        <Dialog header="Recibo de caja" visible={visibleCashReceipts} position={`top`} style={{ width: '80vw' }} onHide={() => {if (!visibleCashReceipts) return; setVisibleCashReceipts(false); setCompanie(null);}} draggable={false} resizable={false}>
          {user.companie == null && companie == null ? (
            <>
              <div className="grid auto-rows-min gap-4 grid-cols-12">
                <div className='col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12'>
                  <Dropdown
                    value={companie}
                    onChange={(e) => setCompanie(e.value)}
                    options={allCompanies!}
                    optionLabel="name"
                    className="w-full mt-4"
                    placeholder='Seleccione una compañia'
                    filter
                  />
                </div>
              </div>
            </>
          ) : (
            <Cashreceipts companie={companie} id={idCashreceipt} duplicate={isDuplicate} />
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}
