/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import { queryFields } from './fields';

type Props = {
  onChange: (query: any) => void;
};

export default function GraphicalQueryBuilder({ onChange }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <QueryBuilder
        fields={queryFields}
        onQueryChange={onChange}
      />
    </div>
  );
}