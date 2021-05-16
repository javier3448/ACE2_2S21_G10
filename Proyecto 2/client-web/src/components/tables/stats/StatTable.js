import React from "react";
import { useTable, usePagination } from "react-table";
import { Link } from 'react-router-dom';
/**
 *
 * @param {{
 * columns: [{Header: string, accessor: string}]
 * data: [{lap:number, totalCal: number}]
 * }} param0
 * @returns
 */
const StatTable = ({ columns, data }) => {
  const {
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );
  return <>
    <div className="list-group">
      <div className="list-group-item bg-dark text-light">
        <div className="row">
          {headerGroups[0].headers.map((column,i) => {
            return <div className="col textcemter" key={i}>
              {column.render('Header')}
            </div>
          })}
        </div>
      </div>
      {page.map((row, i) => {
        prepareRow(row);
        return (
          <Link 
            to={`/stats/${row.values.lap}`}
            key={i}
            className="list-group-item list-group-item-action text-dark">
            <div 
              className="row">
              {row.cells.map((cell,i) => {
                return <div className="col text-center" key={i}>
                  {cell.render('Cell')}
                </div>
              })}
            </div>
          </Link>
        )
      })}
    </div>
    <div className="d-flex justify-content-center my-2">
      <div className="btn-group" role="group">
        <button className="btn btn-outline-dark" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <i className="fa fa-angle-double-left"></i>
        </button>
        <button className="btn btn-outline-dark" onClick={() => previousPage()} disabled={!canPreviousPage}>
          <i className="fa fa-angle-left"></i>
        </button>
        <button className="btn btn-outline-dark" onClick={() => nextPage()} disabled={!canNextPage}>
          <i className="fa fa-angle-right"></i>
        </button>
        <button className="btn btn-outline-dark" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <i className="fa fa-angle-double-right"></i>
        </button>
      </div>
    </div>
    <div className="d-flex justify-content-center align-items-center">
      Pág&nbsp;
      <strong>
        {pageIndex + 1} de {pageOptions.length}
      </strong>&nbsp;
      | Ir a&nbsp;
      <input
        type="number"
        className="form-control form-control-sm"
        defaultValue={pageIndex + 1}
        onChange={e => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0
          gotoPage(page)
        }}
        style={{ width: '75px' }}
      />
    </div>
  </>;
};

export default StatTable;
