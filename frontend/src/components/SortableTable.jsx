import React from 'react';
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';

const SortableTable = ({ columns, data, sortBy, order, onSort, emptyMessage = 'No records found.' }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sortBy === col.field;
              return (
                <th
                  key={col.field || col.header}
                  className={col.sortable !== false ? 'sortable' : ''}
                  onClick={() => col.sortable !== false && onSort(col.field)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      isSorted
                        ? order === 'asc'
                          ? <ArrowUp size={13} style={{ color: 'var(--primary)' }} />
                          : <ArrowDown size={13} style={{ color: 'var(--primary)' }} />
                        : <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: '3.5rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} style={{ animation: `fadeIn 0.3s var(--ease-out) ${rowIndex * 30}ms both` }}>
                {columns.map((col) => (
                  <td key={col.field || col.header}>
                    {col.render ? col.render(row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
