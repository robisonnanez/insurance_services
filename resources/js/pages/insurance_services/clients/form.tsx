import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';

type FormErrors<T> = Partial<Record<keyof T, string>>;

interface ClientFormProps {
  dataFormClient: Required<Clients>;
  setDataFormClient: (field: keyof Required<Clients>, value: any) => void;
  errorsFormClient: FormErrors<Clients>;
  setErrorFormClient: (field: keyof Required<Clients>, value: any) => void;
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


export default function ClientForm({
  dataFormClient,
  setDataFormClient,
  errorsFormClient,
  setErrorFormClient
}: ClientFormProps) {

  function  calcularDigitoVerificacion ( myNit: any )  {
    let vpri: number[];
    let x: number;
    let y: number;
    let z: number;
    
    // Se limpia el Nit
    myNit = myNit.replace ( /\s/g, "" ) ; // Espacios
    myNit = myNit.replace ( /,/g,  "" ) ; // Comas
    myNit = myNit.replace ( /\./g, "" ) ; // Puntos
    myNit = myNit.replace ( /-/g,  "" ) ; // Guiones
    
    // Se valida el nit
    if  ( isNaN ( myNit ) )  {
      console.log ("El nit/cédula '" + myNit + "' no es válido(a).") ;
      return "" ;
    };
    
    // Procedimiento
    vpri = new Array<number>(16);
    z = myNit.length ;

    vpri[1]  =  3 ;
    vpri[2]  =  7 ;
    vpri[3]  = 13 ; 
    vpri[4]  = 17 ;
    vpri[5]  = 19 ;
    vpri[6]  = 23 ;
    vpri[7]  = 29 ;
    vpri[8]  = 37 ;
    vpri[9]  = 41 ;
    vpri[10] = 43 ;
    vpri[11] = 47 ;  
    vpri[12] = 53 ;  
    vpri[13] = 59 ; 
    vpri[14] = 67 ; 
    vpri[15] = 71 ;

    x = 0;
    y = 0;
    for (let i = 0; i < z; i++) {
      // obtener el dígito como número
      const digitStr = myNit.substr(i, 1);
      y = Number(digitStr);
      if (Number.isNaN(y)) y = 0;

      // multiplicar como números (vpri contiene números)
      const weight = vpri[z - i] ?? 0;
      x += y * weight;
    }

    y = x % 11 ;
    // console.log ( y ) ;

    return ( y > 1 ) ? 11 - y : y ;
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 text-sm">
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-6'
          >
            <InputText 
              id='document'
              value={dataFormClient.document ?? ''}
              onChange={(e) => {
                setDataFormClient('document', e.target.value)
                const dv = calcularDigitoVerificacion(e.target.value);
                console.log(dv);
                
                setDataFormClient('dv', dv !== null ? dv.toString() : '');
              }}
              className='w-full p-inputtext-sm'
              onBlur={(e) => {
                const value = e.target.value;
                if (value == '') {
                  setErrorFormClient('document', 'El campo documento es obligatorio.');
                } else {
                  setErrorFormClient('document', '');
                }
              }}
              invalid={!!errorsFormClient.document}
            />
            <label htmlFor='document'>Documento*</label>
          </FloatLabel>
          {errorsFormClient.document && (
            <small className="p-error">{errorsFormClient.document}</small>
          )}
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-6'
          >
            <InputText 
              id='dv'
              value={dataFormClient?.dv ?? ''}
              onChange={(e) => setDataFormClient('dv', e.target.value)}
              className='w-full p-inputtext-sm'
              disabled
            />
            <label htmlFor='dv'>Dv</label>
          </FloatLabel>
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-3'
          >
            <InputText 
              id='names'
              value={dataFormClient.names ?? ''}
              onChange={(e) => setDataFormClient('names', e.target.value)}
              className='w-full p-inputtext-sm'
              onBlur={(e) => {
                const value = e.target.value;
                if (value == '') {
                  setErrorFormClient('names', 'El campo nombre es obligatorio.');
                } else {
                  setDataFormClient('fullname', `${value} ${dataFormClient.surnames}`);
                  setErrorFormClient('names', '');
                }
              }}
              invalid={!!errorsFormClient.names}
            />
            <label htmlFor='names'>Nombre*</label>
          </FloatLabel>
          {errorsFormClient.names && (
            <small className="p-error">{errorsFormClient.names}</small>
          )}
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-3'
          >
            <InputText 
              id='surnames'
              value={dataFormClient.surnames ?? ''}
              onChange={(e) => setDataFormClient('surnames', e.target.value)}
              className='w-full p-inputtext-sm'
              onBlur={(e) => {
                const value = e.target.value;
                if (value == '') {
                  setErrorFormClient('surnames', 'El campo apellidos es obligatorio.');
                } else {
                  setDataFormClient('fullname', `${dataFormClient.names} ${value}`);
                  setErrorFormClient('surnames', '');
                }
              }}
              invalid={!!errorsFormClient.surnames}
            />
            <label htmlFor='surnames'>Apellidos*</label>
          </FloatLabel>
          {errorsFormClient.surnames && (
            <small className="p-error">{errorsFormClient.surnames}</small>
          )}
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12'>
          <FloatLabel
           className='mt-6'
          >
            <InputText 
              id='fullName'
              value={dataFormClient?.fullname ?? ''}
              onChange={(e) => setDataFormClient('fullname', e.target.value)}
              className='w-full p-inputtext-sm'
              disabled
            />
            <label htmlFor='fullName'>Nombre Completo</label>
          </FloatLabel>
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-3'
          >
            <InputText 
              id='address'
              value={dataFormClient.address ?? ''}
              onChange={(e) => setDataFormClient('address', e.target.value)}
              className='w-full p-inputtext-sm'
              keyfilter='email'
              onBlur={(e) => {
                const value = e.target.value;
                if (value == '') {
                  setErrorFormClient('address', 'El campo dirección es obligatorio.');
                } else {
                  setErrorFormClient('address', '');
                }
              }}
              invalid={!!errorsFormClient.address}
            />
            <label htmlFor='address'>Dirección</label>
          </FloatLabel>
          {errorsFormClient.address && (
            <small className="p-error">{errorsFormClient.address}</small>
          )}
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-3'
          >
            <InputText 
              id='email'
              value={dataFormClient.email ?? ''}
              onChange={(e) => setDataFormClient('email', e.target.value)}
              className='w-full p-inputtext-sm'
              keyfilter='email'
            />
            <label htmlFor='email'>Correo Electronico</label>
          </FloatLabel>
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-3'
          >
            <InputText 
              id='phone'
              value={dataFormClient.phone ?? ''}
              onChange={(e) => setDataFormClient('phone', e.target.value)}
              className='w-full p-inputtext-sm'
            />
            <label htmlFor='phone'>Telefono</label>
          </FloatLabel>
        </div>
        <div className='col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-6 2xl:col-span-6'>
          <FloatLabel
           className='mt-3'
          >
            <InputText 
              id='cellphone'
              value={dataFormClient.cellphone ?? ''}
              onChange={(e) => setDataFormClient('cellphone', e.target.value)}
              className='w-full p-inputtext-sm'
            />
            <label htmlFor='cellphone'>Celular</label>
          </FloatLabel>
        </div>
      </div>
    </>
  );
}