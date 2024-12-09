from rest_framework.permissions import BasePermission

class IsAdministrador(BasePermission):
    """
    Permiso exclusivo para usuarios con tipoUser = 1 (Administrador)
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id == 1
        )

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id == 1
        )

class IsTrabajador(BasePermission):
    """
    Permiso exclusivo para usuarios con tipoUser = 3 (Trabajador)
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id == 3
        )

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id == 3
        )

class IsAdminOrTrabajador(BasePermission):
    """
    Permiso para usuarios que son Administrador o Trabajador (tipoUser 1 o 3)
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id in [1, 3]
        )

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated and 
            hasattr(request.user, 'tipoUser_id') and 
            request.user.tipoUser_id in [1, 3]
        )

