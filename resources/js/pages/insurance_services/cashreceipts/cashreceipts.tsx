import api from '@/utils/axiosConfig';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import ClientForm from '../clients/form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useForm } from '@inertiajs/react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState, useRef } from 'react';
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

export default function Cashreceipts({ companie }: { companie?: Companie | null }) {
  const [fecha, setFecha] = useState<Date | null>(new Date());
  const [clients, setClients] = useState<Clients[]>([]);
  const [client, setClient] = useState<Clients | null>(null);
  const [filteredClients, setFilteredClients] = useState<Clients[]>([]);
  const [showCrearCliente, setShowCrearCliente] = useState<boolean>(false);
  const toastMessage = useRef<Toast | null>(null);
  const [service, setService] = useState<Services | null>(null);
  const [filteredServices, setFilteredServices] = useState<Services[]>([]);
  const [listServices, setListServices] = useState<Services[]>([]);

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
  } = useForm({});

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
    setListServices(prev => [...prev, service]);
    setService(null);
    setFilteredServices([]);
  };

  const buscarServicios = (e: any) => {
    const q = (e.query || '').toLowerCase();
    setFilteredServices(
      listServices.filter(s => s.name?.toLowerCase().includes(q))
    );
  };

  return (
    <>
      <Toast ref={toastMessage} />
      {/* <div className="p-6 bg-gray-100 min-h-screen grid place-items-center"> */}
      <div className="p-6 bg-gray-100 grid place-items-center">
        {/* <Card className="w-full max-w-4xl p-6 shadow-2xl border rounded-xl bg-white"> */}
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
                value={fecha} 
                onChange={(e: any) => setFecha(e.value)} 
                dateFormat="dd MM yy" 
                className="w-full"  
                inputClassName="p-inputtext-sm"
              />
              <p className="mt-2"><strong>Recibí de:</strong></p>
              <InputText
                value={client?.fullname ?? '---'}
                className='w-full p-inputtext-sm'
                size={14}
                // disabled={client?.fullName != null ? false : true}
                disabled={true}
              />
              <p className="mt-2"><strong>Cédula:</strong></p>
              <div className="flex items-center gap-2">
                <AutoComplete
                  value={client}
                  suggestions={filteredClients}
                  completeMethod={sarchClients}
                  className='flex-1'
                  inputClassName='w-full p-inputtext-sm'
                  field="document"
                  onChange={(e) => setClient(e.value)}
                  onSelect={(e) => { setClient(e.value); }}
                  placeholder="Escriba nombre o cédula..."
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
                // disabled={client?.address != null ? false : true}
                disabled={true}
              />

              <p className='mt-2'><strong>Teléfono:</strong></p>
              <InputText
                value={client?.cellphone ?? '---'}
                className='w-full p-inputtext-sm'
                size={14}
                // disabled={client?.cellphone != null ? false : true}
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
                  type="number"
                  value={service?.price != null ? String(service.price) : ''}
                  onChange={(e) => setService({ ...service, price: e.target.value === '' ? null : Number(e.target.value) })}
                  placeholder="Valor"
                  className="w-full text-right p-inputtext-sm"
                  keyfilter="money"
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
            {/* <p className="text-3xl font-bold">${valorTotal.toLocaleString('es-CO')}</p> */}
          </div>

          {/* DETALLES */}
          <div className="mt-10 border-t pt-4">

            {/* Totales */}
            <div className="flex justify-end mt-4 text-lg font-bold">
              <div className="text-right">
                {/* <p>Subtotal: {valorTotal.toLocaleString('es-CO')}</p> */}
                <p>Subtotal: </p>
                {/* <p>Total: {valorTotal.toLocaleString('es-CO')}</p> */}
                <p>Total: </p>
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
