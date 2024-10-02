import React from 'react';
import { Card, Button, CardBody, FormControl, FormGroup, FormLabel } from 'react-bootstrap';


const PerfilConf = ({showAddressForm}) => {
  return (
    <div className="profile-settings-container container">

      <h3>Configuración de Perfil</h3>
      
      {!showAddressForm && (
        <form className="profile-settings-form">
        <div>
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" placeholder="Nombre del Usuario" />
        </div>

        <div>
          <label className="form-label">Correo Electronico</label>
          <input type="email" className="form-control" placeholder="usuario@email.com" />
        </div>

        <div>
          <label className="form-label">Contraseña</label>
          <input className="form-control" type="password" placeholder="Nueva Contraseña" />
        </div>

        <button className="btn btn-success" type="submit">Aplicar Cambios</button>
        {/*Falta route para devolverse a perfil*/}
        <button>Cancelar</button>

       </form>
      )}

        {/*Formulario de cambio de direccion de domicilio*/}
        {showAddressForm && (
          <Card>
            <CardBody>
              <h4>Agregar nueva direccion</h4>
              <form>
                <FormGroup controlId='formAddress'>
                  <FormLabel>Direccion</FormLabel>
                  <FormControl type='text' placeholder='Ingrese nombre de calle y numero de domicilio'></FormControl>
                </FormGroup>
                <FormGroup controlId='formCity'>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl type='text' placeholder='Ingrese su ciudad'></FormControl>
                </FormGroup>
                <Button variant='primary' type='submit'>Guardar direccion</Button>
              </form>
            </CardBody>
          </Card>
        )}
    </div>
  );
};

export default PerfilConf;