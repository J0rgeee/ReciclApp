import React from 'react'
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';
import { Link } from 'react-router-dom';


export function MenuUsuario() {
    const items = [
        <SidebarItem><Link  to='perfilconf'>Inicio</Link></SidebarItem>,
        <SidebarItem>Perfil</SidebarItem>,
        <SidebarItem>Puntos Verdes</SidebarItem>,
        <SidebarItem>Mis Publicaciones</SidebarItem>,
      ];
      
  return (
    <div>
    <Sidebar content={items}> </Sidebar>
    </div>
  )
}