import React, { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListadoImagenes from "./components/ListadoImagenes";

function App() {
  //state de la app
  const [busqueda, guardarBusqueda] = useState("");
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaActual, guardarPaginaActual] = useState(1);
  const [totalPaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    const consultarAPI = async () => {
      if (busqueda === "") return;
      const imagenesPorPagina = 30;
      const key = "16620229-1bc5ad5bfba2a2c2c0f76b45a";
      const URL = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;
      const respuesta = await fetch(URL);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      //calcular el total de paginas
      const TotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalPaginas(TotalPaginas);

      //mover la pantalla hacia arriba
      const jumbotron = document.querySelector(".jumbotron");
      jumbotron.scrollIntoView({ behavior: "smooth" });
    };
    consultarAPI();
  }, [busqueda, paginaActual]);

  //definir la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaActual - 1;
    if (nuevaPaginaActual === 0) return;
    guardarPaginaActual(nuevaPaginaActual);
  };
  //definir la pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaActual + 1;
    if (nuevaPaginaActual > totalPaginas) return;
    guardarPaginaActual(nuevaPaginaActual);
  };
  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de imágenes</p>
        <Formulario guardarBusqueda={guardarBusqueda} />
      </div>
      <div className="row justify-content-center">
        <ListadoImagenes imagenes={imagenes} />
        {paginaActual === 1 ? null : (
          <button
            type="button"
            className="btn btn-info mr-1"
            onClick={paginaAnterior}
          >
            Anterior &laquo;
          </button>
        )}
        {paginaActual === totalPaginas ? null : (
          <button
            type="button"
            className="btn btn-info"
            onClick={paginaSiguiente}
          >
            Siguiente &raquo;
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
