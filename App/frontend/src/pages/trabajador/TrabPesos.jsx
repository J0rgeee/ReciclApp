import React, { useState, useEffect } from "react";
import { Table, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { Alerta } from '../admin/AdminHome';
import pesoService from '../../hooks/pesoService';

const TrabPesos = () => {
  const [registrosPeso, setRegistrosPeso] = useState({ aprobados: [], pendientes: [] });
  const [loading, setLoading] = useState(true);
  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });
  const [key, setKey] = useState('pesos-p');

  // Mapeo de tipos de reciclaje
  const tipoReciclajeMap = {
    3: 'Plástico',
    2: 'Cartón',
    12: 'Vidrio',
    16: 'Papel',
    9: 'Latas'
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  const cargarRegistrosPeso = async () => {
    try {
      setLoading(true);
      const data = await pesoService.listar();
      setRegistrosPeso({
        pendientes: data.filter(peso => !peso.estado),
        aprobados: data.filter(peso => peso.estado)
      });
    } catch (error) {
      setAlerta({ tipo: 'danger', mensaje: 'Error al cargar los registros de peso' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRegistrosPeso();
  }, []);

  const aprobarPeso = async (id) => {
    try {     
      await pesoService.aprobar(id);
      setRegistrosPeso(prev => {
        const pesoAprobado = prev.pendientes.find(peso => peso.id === id);
        return {
          pendientes: prev.pendientes.filter(peso => peso.id !== id),
          aprobados: [...prev.aprobados, { ...pesoAprobado, estado: true }]
        };
      });
      setAlerta({ tipo: 'success', mensaje: 'Registro aprobado exitosamente' });
    } catch (error) {
      setAlerta({ tipo: 'danger', mensaje: 'Error al aprobar el registro' });
    }
  };

  const desaprobarPeso = async (id) => {
    try {
      console.log('Intentando desaprobar peso con ID:', id); // Para debug
      await pesoService.desaprobar(id);
      setRegistrosPeso(prev => {
        const pesoDesaprobado = prev.aprobados.find(peso => peso.id === id);
        return {
          aprobados: prev.aprobados.filter(peso => peso.id !== id),
          pendientes: [...prev.pendientes, { ...pesoDesaprobado, estado: false }]
        };
      });
      setAlerta({ tipo: 'success', mensaje: 'Registro desaprobado exitosamente' });
    } catch (error) {
      console.error('Error completo:', error); // Para ver el error completo
      setAlerta({ tipo: 'danger', mensaje: 'Error al desaprobar el registro' });
    }
  };

  const eliminarPeso = async (id) => {
    try {
      await pesoService.eliminar(id);
      setRegistrosPeso(prev => ({
        ...prev,
        pendientes: prev.pendientes.filter(peso => peso.id !== id)
      }));
      setAlerta({ tipo: 'success', mensaje: 'Registro eliminado exitosamente' });
    } catch (error) {
      setAlerta({ tipo: 'danger', mensaje: 'Error al eliminar el registro' });
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="m-2">
      <Alerta alerta={alerta} setAlerta={setAlerta} />
      <Tabs
        id="tab"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-2"
        justify
      >
        <Tab eventKey="pesos-a" title="Pesos Aprobados">
          <div className="scroll">
            <Table bordered hover className="table-light shadow">
              <thead className="table-primary">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Tipo Reciclaje</th>
                  <th>Peso (kg)</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {registrosPeso.aprobados.map((registro) => (
                  <tr key={registro.id}>
                    <td>{registro.id}</td>
                    <td>{registro.emailusuario}</td>
                    <td>{tipoReciclajeMap[registro.tiporec]}</td>
                    <td>{registro.cantidadpeso.toFixed(2)} kg</td>
                    <td>{formatDate(registro.fechatrans)}</td>
                    <td className="text-center">
                      <Form.Check
                        type="switch"
                        id={`switch-${registro.id}`}
                        checked
                        onChange={() => desaprobarPeso(registro.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>

        <Tab eventKey="pesos-p" title="Pesos Pendientes">
          <div className="scroll">
            <Table bordered hover className="table-light shadow">
              <thead className="table-warning">
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Tipo Reciclaje</th>
                  <th>Peso (kg)</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registrosPeso.pendientes.map((registro) => (
                  <tr key={registro.id}>
                    <td>{registro.id}</td>
                    <td>{registro.emailusuario}</td>
                    <td>{tipoReciclajeMap[registro.tiporec]}</td>
                    <td>{registro.cantidadpeso.toFixed(2)} kg</td>
                    <td>{formatDate(registro.fechatrans)}</td>
                    <td className="text-center">
                      <Form.Check
                        type="switch"
                        id={`switch-${registro.id}`}
                        onChange={() => aprobarPeso(registro.id)}
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        variant="danger"
                        className="btn-sm rounded-pill"
                        onClick={() => eliminarPeso(registro.id)}
                      >
                        ❌ Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default TrabPesos;