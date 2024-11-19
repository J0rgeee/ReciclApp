from django.contrib import admin
from .models import Publicacion
# Register your models here.

@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = ['idPublicacion', 'desc', 'emailUsuario', 'timeCreate', 'estado']
    list_filter = ['estado']
    actions = ['aprobar_publicaciones']

    def aprobar_publicaciones(self, request, queryset):
        queryset.update(estado=True)
        self.message_user(request, "Las publicaciones seleccionadas han sido aprobadas.")
    aprobar_publicaciones.short_description = "Aprobar publicaciones seleccionadas"