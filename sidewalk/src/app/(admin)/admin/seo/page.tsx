import React from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import SEOChecker from '@/components/admin/SEOChecker';

export default async function SEOPage() {
  const payload = await getPayload({ config });
  
  const clientsData = await payload.find({
    collection: 'clients',
    limit: 1000,
    sort: 'companyName',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SEO Checker</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Audit client websites for technical and on-page SEO issues during development.
        </p>
      </div>

      <SEOChecker clients={clientsData.docs} />
    </div>
  );
}
