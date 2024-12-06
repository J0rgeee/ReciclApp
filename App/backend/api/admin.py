from django.contrib import admin
from .models import Publicacion, Usuario
# Register your models here.

@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = ['idPublicacion', 'desc', 'emailUsuario', 'timeCreate', 'estado']
    list_filter = ['estado']
    actions = ['aprobar_publicaciones', 'desaprobar_publicaciones']

    def aprobar_publicaciones(self, request, queryset):
        queryset.update(estado=True)
        self.message_user(request, "Las publicaciones seleccionadas han sido aprobadas.")
    aprobar_publicaciones.short_description = "Aprobar publicaciones seleccionadas"

    def desaprobar_publicaciones(self, request, queryset):
        queryset.update(estado=False)
        self.message_user(request, "Las publicaciones seleccionadas han sido deshabilitadas.")
    desaprobar_publicaciones.short_description = "Deshabilitar publicaciones seleccionadas"

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'nombre', 'apellido', 'estado', 'is_staff', 'tipoUser', 'fechaReg']
    list_filter = ['estado', 'is_staff', 'tipoUser']
    search_fields = ['email', 'username', 'nombre', 'apellido']
    actions = ['activar_cuentas', 'desactivar_cuentas']

    def activar_cuentas(self, request, queryset):
        queryset.update(estado=True)
        self.message_user(request, "Las cuentas seleccionadas han sido activadas.")
    activar_cuentas.short_description = "Activar cuentas seleccionadas"

    def desactivar_cuentas(self, request, queryset):
        queryset.update(estado=False)
        self.message_user(request, "Las cuentas seleccionadas han sido desactivadas.")
    desactivar_cuentas.short_description = "Desactivar cuentas seleccionadas"
