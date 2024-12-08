from rest_framework.permissions import BasePermission

class IsAprobador(BasePermission):
    """
    Permiso para usuarios con tipoUser 1 y 2
    """
    def has_permission(self, request, view):
        # Verifica que el usuario esté autenticado y tenga el tipo correcto
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id in [1, 2]
        )

    def has_object_permission(self, request, view, obj):
        # También verifica permisos a nivel de objeto
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id in [1, 2]
        )
