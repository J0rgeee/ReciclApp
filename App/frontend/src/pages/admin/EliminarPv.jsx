import React from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;
const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

const EliminarCampo = ({ campoId }) => {
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        client.delete(`/api/PtoVerde/ptoverde/${campoId}/`)
          .then(response => {
            Swal.fire('¡Eliminado!', 'El campo ha sido eliminado.', 'success');
          })
          .catch(error => {
            Swal.fire('Error', 'Hubo un problema al eliminar el campo.', 'error');
          });
      }
    });
  };

  return (
    <button onClick={handleDelete} className="btn btn-danger">
      Eliminar Campo
    </button>
  );
};

export default EliminarCampo;