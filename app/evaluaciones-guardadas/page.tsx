'use client'; // Indicates this component is a client component in Next.js

import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '../../components/ui/table'; // Import custom table components
import ArrowRight from '../../components/images/back-button.png'; // Import the arrow icon for visual indication
import Image from 'next/image'; // Import Next.js image component for optimized images

// export const metadata = {
//   title: 'Historial de evaluaciones | Lecto'
// };

const EvaluacionesPage = () => {
  // State to track the selected row index
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  // State to track the current page number for pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10; // Define the number of rows to display per page
  // State to hold the fetched evaluation data
  const [data, setData] = React.useState<any[]>([]);
  // State to track loading status
  const [loading, setLoading] = React.useState(true);
  // State to hold any error messages during fetch
  const [error, setError] = React.useState<string | null>(null);

  // Effect to fetch evaluation history from the API on component mount
  React.useEffect(() => {
    const fetchEvaluacionHistory = async () => {
      try {
        const response = await fetch('/api/evaluacionHistory', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Check if the response is not ok and throw an error if so
        if (!response.ok) {
          const result = await response.json();

          throw new Error(result?.message);
        }

        // Parse the JSON response and update the state
        const result = await response.json();
        setData(result.data); // Assuming the result has a 'data' property
      } catch (err) {
        // Set the error state if fetching fails
        setError(err.message);
      } finally {
        // Set loading to false once the fetch is complete
        setLoading(false);
      }
    };

    fetchEvaluacionHistory(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  // Function to handle row selection when "Ver" is clicked
  const handleVerClick = (index: number) => {
    setSelectedRow(index); // Update the selected row index
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / rowsPerPage); // Calculate total number of pages based on data length
  const paginatedRows = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  ); // Get rows for the current page

  // Function to navigate to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Function to navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Loading state rendering
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Error state rendering
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Historial de Evaluaciones Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Historial de evaluaciones
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Revisa las evaluaciones que realizaste, y tus preguntas y respuestas
            por cada una
          </p>

          {/* Table with Pagination */}
          <div
            className="flex flex-col"
            style={{ maxHeight: '600px', overflowY: 'hidden' }}
          >
            <div style={{ flex: '1', overflowY: 'auto' }}>
              {' '}
              {/* Table area with scroll */}
              <Table className="border border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Título de Lectura</TableHead>
                    <TableHead>Puntaje</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Ver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Map through the paginated rows to create table rows */}
                  {paginatedRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>{row.titulo_lectura}</TableCell>
                      <TableCell>{row.puntaje}</TableCell>
                      <TableCell>{row.categoria}</TableCell>
                      <TableCell
                        className={`cursor-pointer ml-1 ${selectedRow === index + (currentPage - 1) * rowsPerPage ? 'bg-gray-200 text-white' : 'text-blue-500 hover:text-blue-700'}`}
                        onClick={() =>
                          handleVerClick(
                            index + (currentPage - 1) * rowsPerPage
                          )
                        } // Adjust index for pagination
                      >
                        <Image
                          src={ArrowRight}
                          alt="Arrow icon"
                          width={25}
                          height={25}
                          className="ml-1 rotate-180" // Rotate the arrow icon for direction
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Preguntas y Respuestas Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Preguntas y respuestas</h2>
          <p className="text-sm text-gray-500 mb-4">
            Revisa las respuestas correctas e incorrectas de cada evaluación
          </p>

          {/* Display question and answer section only if a row is selected */}
          {selectedRow !== null && data[selectedRow] && (
            <div
              className="flex flex-col"
              style={{ maxHeight: '600px', overflowY: 'hidden' }}
            >
              <div style={{ flex: '1', overflowY: 'auto' }}>
                {' '}
                {/* Table area with scroll */}
                <Table className="border border-gray-200">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pregunta</TableHead>
                      <TableHead>Respuesta Correcta</TableHead>
                      <TableHead>Respuesta Dada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Map through the selected row's submissions to create answer rows */}
                    {data[selectedRow].submissions.map(
                      (submission: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{submission.pregunta}</TableCell>
                          <TableCell>
                            {submission.res_correc || 'N/A'}
                          </TableCell>
                          <TableCell
                            className={
                              submission.acierto === true
                                ? 'text-green-500 font-semibold'
                                : submission.acierto === null
                                  ? 'font-semibold'
                                  : 'text-red-500 font-semibold'
                            }
                          >
                            {submission.res_selec || submission.respuesta}
                            {submission.acierto !== null &&
                              (submission.acierto ? (
                                <span className="ml-2 text-green-500">✔️</span>
                              ) : (
                                <span className="ml-2 text-red-500">✖️</span>
                              ))}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluacionesPage; // Export the component for use in other parts of the application
