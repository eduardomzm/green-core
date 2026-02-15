from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "ADMIN"


class IsOperador(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "OPERADOR"


class IsAlumno(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "ALUMNO"


class IsTutor(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "TUTOR"


class CanCreateDeposito(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['ADMIN', 'OPERADOR']
