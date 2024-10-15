import React from 'react'
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';


export function MenuUsuario() {
    const items = [
        <SidebarItem>Inicio</SidebarItem>,
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