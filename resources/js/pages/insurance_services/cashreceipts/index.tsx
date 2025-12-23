import api from '@/utils/axiosConfig';
import { Head } from '@inertiajs/react';
import Cashreceipts from './cashreceipts';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Dropdown } from 'primereact/dropdown';
import { index } from '@/routes/cashreceipts/index';

import {
  File,
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

export default function CashreceiptsIndex({user}: {user: User}) {
  const [visibleCashReceipts, setVisibleCashReceipts] = useState<boolean>(false);
  const [companie, setCompanie] = useState<Companie | null>(user.companie ?? null);
  const [allCompanies, setAllCompanies] = useState<Companie[] | null>(user.companie ? [user.companie] : null);

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cash Receipts" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 grid-cols-12">
          <div className='col-span-12 sm:col-span-12 md:col-span-12 lg:col-span-12 xl:col-span-12 2xl:col-span-12'>
            <Button
              label='Nuevo'
              className='float-right'
              icon={<File size={16} className='mr-1'/>}
              size='small'
              onClick={() => setVisibleCashReceipts(!visibleCashReceipts)}
              text
              raised
            />
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
            <Cashreceipts companie={companie} />
          )}
        </Dialog>
      </div>
    </AppLayout>
  );
}
