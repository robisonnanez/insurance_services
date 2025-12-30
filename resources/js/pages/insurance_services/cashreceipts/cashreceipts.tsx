import api from '@/utils/axiosConfig';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import ClientForm from '../clients/form';
import { addLocale } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { store } from '@/routes/cashreceipts/index';
import { useEffect, useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { storeClient } from '@/routes/clients/index';
import { AutoComplete } from 'primereact/autocomplete';
import {
  ListPlus, Save,
  UserRoundPlus
} from 'lucide-react';

interface Companie {
  id: number;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  document?: string;
  dv?: number;
}

interface Clients {
  id: number | null;
  names: string | null;
  surnames: string | null;
  document: string | null;
  dv: string | null;
  address?: string;
  phone?: string;
  cellphone?: string;
  email?: string;
  fullname: string | null;
}

interface Services {
  id?: number | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
}

interface CashReceipt {
  id?: number | null;
  client_id: number | null;
  date: string | null;
  total: number | null;
  details?: CashReceiptDetails[];
}

interface CashReceiptDetails {
  id?: number | null;
  it: number | null;
  service_id: number | null;
  description: string | null;
  price: number | null;
}

export default function Cashreceipts({ companie }: { companie?: Companie | null }) {
  const [clients, setClients] = useState<Clients[]>([]);
  const [client, setClient] = useState<Clients | null>(null);
  const [filteredClients, setFilteredClients] = useState<Clients[]>([]);
  const [showCrearCliente, setShowCrearCliente] = useState<boolean>(false);
  const toastMessage = useRef<Toast | null>(null);
  const [service, setService] = useState<Services | null>(null);
  const [servicePriceInput, setServicePriceInput] = useState<string>('');
  const [filteredServices, setFilteredServices] = useState<Services[]>([]);
  const [listServices, setListServices] = useState<Services[]>([]);
  const [activeButtonSave, setActiveButtonSave] = useState<boolean>(false);

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  const {
    data: dataFormClient,
    setData: setDataFormClient,
    post: postFormClient,
    processing: processingFormClient,
    errors: errorsFormClient,
    setError: setErrorFormClient,
    reset: resetFormClient
  } = useForm<Required<Clients>>(() => ({
    id: null,
    names: '',
    surnames: '',
    document: '',
    dv: '',
    address: '',
    phone: '',
    cellphone: '',
    email: '',
    fullname: '',
  }));

  const {
    data: dataFormCashReceipt,
    setData: setDataFormCashReceipt,
    post: postFormCashReceipt,
    processing: processingFormCashReceipt,
    errors: errorsFormCashReceipt,
    setError: setErrorFormCashReceipt,
    reset: resetFormCashReceipt
  } = useForm<Required<CashReceipt>>({
    id: null,
    client_id: null,
    date: new Date().toISOString().split('T')[0],
    total: null,
    details: [],
  });

  // Initial data fetch
  useEffect(() => {
    getClients().then((data) => {
      if (data == null) return;
      setClients(data);
    });

    getServices().then((data) => {
      if (data == null) return;
      console.warn(data);
      setListServices(data);
    })
  }, []);

  // Fetch clients from API
  const getClients = async () => {
    try {
      const response = await api.get<Clients[]>(`/insurance-services/clients/all`);
      const data = response.data;
      // ensure fullName exists
      const mapped = data.map(d => ({ ...d, fullName: d.fullname ?? `${d.names} ${d.surnames}` }));
      return mapped;
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      return null;
    } finally {

    }
  };

  // Fetch services from API
  const getServices = async () => {
    try {
      const response = await api.get<Services[]>(`/insurance-services/services/all`);
      const data = response.data;
      return data;
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      return null;
    } finally {

    }
  }

  // Search clients for autocomplete
  const sarchClients = (e: any) => {
    const q = (e.query || '').toLowerCase();
    const results = clients.filter(c =>
      (c.fullname ?? `${c.names} ${c.surnames}`).toLowerCase().includes(q) || (c.document ?? '').toLowerCase().includes(q)
    );
    setFilteredClients(results);
  };

  // wrapper to allow ClientForm to call setClient(field, value)
  const setClientField = (field: string, value: any) => {
    setClient(prev => ({
      ...(prev ?? { id: 0, names: '', surnames: '', document: '', dv: '', fullName: '' }),
      [field]: value,
    } as Clients));
  };

  const footerContent = (
    <div>
      <Button 
        label="Guardar" 
        icon={<Save size={16} className='mr-1'/>}
        onClick={() => handleCreateClient()} 
        autoFocus 
        size="small"
        text
        raised
      />
    </div>
  );

  const handleCreateClient = () => {
    api.post(storeClient.url(), dataFormClient)
      .then((response) => {
        const createdClient: Clients = response.data.data;
        showMessage('success', 'Éxito', response.data.message);
        setClient(createdClient);
        setDataFormCashReceipt('client_id', createdClient?.id ?? null);
        setClients(prev => [...prev, createdClient]);
        setShowCrearCliente(false);
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          Object.keys(apiErrors).forEach((key) => {
            setErrorFormClient(key as keyof Clients, apiErrors[key][0]);
          });
        } else {
          console.error('Error creating client:', error);
        }
      })
      .finally(() => {
        // Any final actions
        resetFormClient();
      });
  };

  const showMessage = (severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast", summary: string, detail: string) => {
    if (toastMessage.current != null) {      
      toastMessage.current.show({ severity: `${severity}`, summary: `${summary}`, detail: `${detail}` });
    }
  };

  const agregarServicio = () => {
    if (!service) return;
    const newDetails: CashReceiptDetails = {
      it: (dataFormCashReceipt.details ? dataFormCashReceipt.details.length + 1 : 1),
      service_id: service.id || null,
      description: service.name || null,
      price: service.price || 0,
    };
    const updatedDetails = [...(dataFormCashReceipt.details || []), newDetails];
    const newTotal = updatedDetails.reduce((sum, item) => sum + (item.price || 0), 0);
    setDataFormCashReceipt('details', updatedDetails);
    setDataFormCashReceipt('total', newTotal);
    setActiveButtonSave(true);
    setService(null);
    setFilteredServices([]);
  };

  const buscarServicios = (e: any) => {
    const q = (e.query || '').toLowerCase();
    setFilteredServices(
      listServices.filter(s => s.name?.toLowerCase().includes(q))
    );
  };

  // Funciones para parsear/formatar moneda (miles con punto y decimales con coma)
  const parseCurrency = (raw: string): number | null => {
    if (!raw) return null;
    // quitar todos los puntos de miles y convertir coma decimal a punto
    const cleaned = raw.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
    if (cleaned === '') return null;
    const num = Number(cleaned);
    if (isNaN(num)) return null;
    return Math.round(num * 100) / 100;
  };

  const formatCurrency = (value: number | string | null) => {
    if (value == null) return '';
    // Acepta número o string, limpia y convierte a número seguro
    const asString = String(value);
    const cleaned = asString.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
    const num = Number(cleaned);
    if (isNaN(num)) return '';
    const rounded = Math.round(num * 100) / 100;
    const parts = rounded.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  const formatInlineThousands = (raw: string) => {
    if (!raw) return '';
    // Si hay coma la tratamos como separador decimal: preservamos la parte decimal tal cual
    if (raw.includes(',')) {
      const lastCommaIndex = raw.lastIndexOf(',');
      const intPartRaw = raw.slice(0, lastCommaIndex);
      const decimalPart = raw.slice(lastCommaIndex + 1).replace(/\D/g, '');
      const intDigits = intPartRaw.replace(/\D/g, '') || '0';
      const formattedInt = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return decimalPart ? `${formattedInt},${decimalPart}` : formattedInt;
    }

    // Si no hay coma, tratamos todo como parte entera (los puntos son ignorados y se reinsertan según miles)
    const digitsOnly = raw.replace(/\D/g, '') || '0';
    const formatted = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formatted;
  };

  // Mantener el campo de texto del precio sincronizado cuando cambia el servicio
  useEffect(() => {
    setServicePriceInput(service?.price != null ? formatCurrency(service.price) : '');
  }, [service?.price, service?.id]);

  const page = usePage();

  const handleSaveCashReceipt = () => {
    postFormCashReceipt(store.url(), {
      onSuccess: () => {
        const msg = (page.props as any)?.flash?.message ?? 'Recibo de caja creado correctamente.';
        const success = (page.props as any)?.flash?.success ?? true;
        showMessage(success ? 'success' : 'error', success ? 'Éxito' : 'Error', msg);
        // Resetear formulario
        resetFormCashReceipt();
        setClient(null);
        setActiveButtonSave(false);
        
      },
      onError: (errors) => {
        if (errors) {
          Object.keys(errors).forEach((key) => {
            setErrorFormCashReceipt(key as keyof CashReceipt, (errors as any)[key]);
          });
        }
        const msg = (page.props as any)?.flash?.message ?? 'Hubo un error al crear el recibo de caja.';
        showMessage('error', 'Error', msg);
      }
    });
  };

  return (
    <>
      <Toast ref={toastMessage} />
      <div className="p-6 bg-gray-100 grid place-items-center">
        <Card className="w-full max-w-full p-6 shadow-2xl border rounded-xl bg-white">
          {/* ENCABEZADO */}
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <img src={`/${companie?.logo ?? '/logo.png'}`} alt={companie?.name ?? 'Logo'} className="w-40" />
            </div>
            <div className="text-center text-sm font-semibold">
              <p>{companie?.name ?? 'LOGISTICA GL SAS'}</p>
              <p>{companie?.document ?? 'Nit 901026773-6'}</p>
              <p>{companie?.address ?? 'Calle 16 # 6-23 B/Alto de la Cruz - Girardot'}</p>
              <p>{companie?.phone ?? 'Tel. 8351195 310-5576310'}</p>
            </div>
            <div className="border p-3 rounded text-center font-bold">
              <p>Documento N°</p>
              <p className="text-xl">RC</p>
            </div>
          </div>

          {/* INFORMACIÓN PRINCIPAL */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p><strong>Fecha:</strong></p>
              <Calendar 
                value={dataFormCashReceipt.date ? new Date(dataFormCashReceipt.date) : null} 
                onChange={(e: any) => setDataFormCashReceipt('date',e.value)} 
                dateFormat="dd MM yy" 
                className="w-full"  
                inputClassName="p-inputtext-sm"
                locale="es"
              />
              <p className="mt-2"><strong>Recibí de:</strong></p>
              <AutoComplete
                value={client?.fullname ?? ''}
                suggestions={filteredClients}
                completeMethod={sarchClients}
                className='flex-1 w-full p-inputtext-sm'
                inputClassName='w-full p-inputtext-sm'
                field="fullname"
                onChange={(e) => setClientField('fullname', e.value)}
                onSelect={(e) => { setClient(e.value); setDataFormCashReceipt('client_id', e.value?.id ?? null); }}
                placeholder="Escriba nombre"
              />
              <p className="mt-2"><strong>Cédula:</strong></p>
              <div className="flex items-center gap-2">
                <AutoComplete
                  value={client?.document ?? ''}
                  suggestions={filteredClients}
                  completeMethod={sarchClients}
                  className='flex-1'
                  inputClassName='w-full p-inputtext-sm'
                  field="document"
                  onChange={(e) => setClientField('document', e.value)}
                  onSelect={(e) => { setClient(e.value); setDataFormCashReceipt('client_id', e.value?.id ?? null); }}
                  placeholder="Escriba la cédula"
                />
                {filteredClients.length === 0 && (
                  <Button 
                    onClick={() => setShowCrearCliente(true)}
                    label='Crear Cliente'
                    icon={<UserRoundPlus size={16} className='mr-1'/>}
                    size="small"
                    text
                    raised
                  />
                )}
              </div>
            </div>

            <div>
              <p><strong>Dirección:</strong></p>
              <InputText
                value={client?.address ?? '---'}
                className='w-full p-inputtext-sm'
                size={14}
                disabled={true}
              />

              <p className='mt-2'><strong>Teléfono:</strong></p>
              <InputText
                value={client?.cellphone ?? '---'}
                className='w-full p-inputtext-sm'
                size={14}
                disabled={true}
              />
            </div>
          </div>

          {/* BUSCADORES */}
          <div className="mt-6">
            <label className="font-semibold text-sm mt-4 block">Agregar Servicio:</label>
            <div className="grid grid-cols-12 gap-2 items-end mt-2">
              <div className='col-span-12 sm:col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3'>
                <AutoComplete
                  value={service}
                  suggestions={filteredServices}
                  completeMethod={buscarServicios}
                  field="id"
                  onChange={(e) => setService(e.value)}
                  onSelect={(e) => setService(e.value)}
                  className="w-full"
                  inputClassName='w-full p-inputtext-sm'
                  placeholder="Escriba para buscar servicio..."
                />
              </div>
              <div className='col-span-12 sm:col-span-12 md:col-span-5 lg:col-span-5 xl:col-span-5 2xl:col-span-5'>
                <InputText
                  value={service?.name || ''}
                  onChange={(e) => setService({ ...service, name: e.target.value })}
                  placeholder="Nombre del servicio"
                  className="w-full p-inputtext-sm"
                />
              </div>
              <div className='col-span-12 sm:col-span-12 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2'>
                <InputText
                  value={servicePriceInput}
                  onChange={(e) => {
                    const raw = e.target.value || '';
                    // permitir solo dígitos, punto y coma como separador decimal, eliminar signo negativo
                    const sanitized = raw.replace(/[^0-9,\.]/g, '');
                    // Si pasa de 2500, formatear inline separador de miles, sin forzar centavos
                    const parsed = parseCurrency(sanitized);
                    if (parsed != null && parsed >= 2500) {
                      setServicePriceInput(formatInlineThousands(sanitized));
                    } else {
                      setServicePriceInput(sanitized);
                    }
                    // No setear el precio numérico hasta onBlur para no interrumpir la escritura
                  }}
                  onBlur={() => {
                    const parsed = parseCurrency(servicePriceInput);
                    setService({ ...service, price: parsed });
                    setServicePriceInput(formatCurrency(parsed));
                  }}
                  placeholder="Valor"
                  className="w-full text-right p-inputtext-sm"
                />
              </div>
              <div className='col-span-12 sm:col-span-12 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2'>
                <Button 
                  onClick={agregarServicio}
                  icon={<ListPlus size={16} className='mr-1'/>}
                  size="small"
                  text
                  raised
                  label='Agregar'
                  className='float-right'
                />
              </div>
            </div>
          </div>

          {/* SUMA */}
          <div className="mt-10 text-center">
            <p className="font-semibold">La suma de:</p>
            <p className="text-3xl font-bold">${dataFormCashReceipt.total?.toLocaleString('es-CO')}</p>
          </div>

          {/* DETALLES */}
          <div className="mt-10 border-t pt-4">
            <DataTable 
              value={dataFormCashReceipt.details} 
              className="w-full"
              size="small"
              responsiveLayout="scroll"
              emptyMessage={<div className="text-center">No hay servicios agregados.</div>}
            > 
              <Column field="it" header="It" />
              <Column field="description" header="Descripción" />
              <Column 
                field="price" 
                header="Valor" 
                body={(rowData) => (
                  <div className="text-right">
                    ${rowData.price?.toLocaleString('es-CO')}
                  </div>
                )}
              />
            </DataTable>
            {/* Totales */}
            <div className="flex justify-end mt-4 text-lg font-bold">
              <div className="text-right">
                <p>Subtotal: ${dataFormCashReceipt.total?.toLocaleString('es-CO')}</p>
                <p>Total: ${dataFormCashReceipt.total?.toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>

          {/* FIRMA */}
          <div className="mt-10 flex justify-between items-center text-sm">
            <div className="text-center w-1/3">
              <div className="border-t pt-2">Firma y Sello</div>
            </div>
            <p>Nota: Apreciado cliente por favor conserve este recibo como soporte de su pago</p>
          </div>

          {/* BOTON DE GUARDAR */}
          <div className="mt-8 text-center">
            <Button 
              className="px-6 py-2 text-lg"
              label='Generar Recibo'
              icon={<Save size={16} className='mr-1'/>}
              size="small"
              text
              raised
              disabled={!activeButtonSave}
              onClick={handleSaveCashReceipt}
            />
          </div>
        </Card>
      </div>
      <Dialog 
        header="Crear Cliente"
        visible={showCrearCliente}
        position='top'
        style={{width: '50vw'}}
        onHide={() => {if (!showCrearCliente) return; setShowCrearCliente(false);}}
        draggable={false}
        resizable={false}
        footer={footerContent}
      >
        <ClientForm 
          dataFormClient={dataFormClient}
          setDataFormClient={setDataFormClient}
          errorsFormClient={errorsFormClient}
          setErrorFormClient={setErrorFormClient}
        />
      </Dialog>
    </>
  );
}
