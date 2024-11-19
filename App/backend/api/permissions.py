from rest_framework.permissions import BasePermission

class IsAprobador(BasePermission):
    """
    Permiso para usuarios con tipoUser = 1
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tipoUser_id == 1
