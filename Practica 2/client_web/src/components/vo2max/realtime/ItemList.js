import React, { useCallback } from 'react';

const ItemList = ({ onPruebaChange, prueba, date }) => {
  const handleChange = useCallback(e => {
    onPruebaChange(e.target.value)
  }, [onPruebaChange]);

  return (
    <button
      key={prueba + '##' + date.getMilliseconds()}
      value={`${prueba}`}
      onClick={handleChange}
      className="list-group-item list-group-item-action">
      {`${prueba}.  ${date}`}
    </button>
  );
}

export default ItemList;