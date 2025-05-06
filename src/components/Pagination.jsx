import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => onPageChange(currentPage - 1)}
            >
              Anterior
            </button>
          </li>
          
          {[...Array(totalPages).keys()].map(number => (
            <li 
              key={number} 
              className={`page-item ${currentPage === number ? 'active' : ''}`}
            >
              <button 
                className="page-link" 
                onClick={() => onPageChange(number)}
              >
                {number + 1}
              </button>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link" 
              onClick={() => onPageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;