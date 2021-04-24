import React, { useCallback } from 'react';

const ItemList = ({ onPruebaChange, prueba, date }) => {
  const handleChange = useCallback(e => {
    onPruebaChange(prueba);
  }, [onPruebaChange]);

  return (
    <button
      onClick={handleChange}
      className="list-group-item list-group-item-action text-dark">
        <div className="row">
          <div className="col-3 text-begin">
            {prueba > 0 ? prueba : "Actual"}
          </div>
          <div className="col-9 text-end">
            {date ? date.toLocaleString() : ""}
          </div>
        </div>
    </button>
  );
}

export default ItemList;