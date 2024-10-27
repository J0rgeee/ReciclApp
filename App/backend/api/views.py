from django.shortcuts import render
from rest_framework import viewsets,permissions, status,generics
from .serializer import RegistroRetiroSerializer,PublicacionSerializer,UsuarioUpdateSerializaer,PuntoVerdeSerializer,ComunaSerializer,CiudadSerializer,TipoReciclajePveSerializer,TipoReciclajeSerializer,UsuarioLoginSerializer,UsuarioRegistroSerializaer,UsuarioSerializer,AdminUsuariosSerializer # type: ignore
from .models import Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,Usuario,Publicacion,RegistroRetiro
# from .validations import custom_validation, validate_email, validate_password
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail


# Create your views here.
class PtoVerdeView (viewsets.ModelViewSet):
	permission_classes = (permissions.AllowAny,)
	serializer_class = PuntoVerdeSerializer
	queryset = PuntoVerde.objects.all()

class CiudadView (viewsets.ModelViewSet):
    serializer_class = CiudadSerializer
    queryset = Ciudad.objects.all()
    
class ComunaView (viewsets.ModelViewSet):
    serializer_class = ComunaSerializer
    queryset = Comuna.objects.all()

class TipoReciclajeView (viewsets.ModelViewSet):
	permission_classes = (permissions.AllowAny,)
	serializer_class = TipoReciclajeSerializer	
	queryset = TipoReciclaje.objects.all()

class TipoReciclajePvView (viewsets.ModelViewSet):
    serializer_class = TipoReciclajePveSerializer
    queryset = TipoReciclajePv.objects.all()
    
class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		# clean_data = custom_validation(request.data)
		clean_data = request.data
		serializer = UsuarioRegistroSerializaer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		# assert validate_email(data)
		# assert validate_password(data)
		serializer = UsuarioLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UsuarioSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)   
	
class AdminUsuarios (viewsets.ModelViewSet):
    serializer_class = AdminUsuariosSerializer
    queryset = Usuario.objects.all()


class UpdateUsuario(generics.UpdateAPIView):
	serializar_class = UsuarioUpdateSerializaer
	queryset = Usuario.objects.all()
	permission_classes = [permissions.IsAuthenticated] 

	# def get_queryset(self):
    	# return self.queryset.filter(email=self.request.Usuario.email)


class PublicacionesView(viewsets.ModelViewSet):
	queryset = Publicacion.objects.all()
	def get_serializer_class(self):
		return PublicacionSerializer 

class RetiroView(viewsets.ModelViewSet):
	queryset = RegistroRetiro.objects.all()
	def get_serializer_class(self):
		return RegistroRetiroSerializer 


class DesactivarCuenta(APIView):
    permission_classes = [IsAuthenticated]  # Aseguramos que el usuario esté autenticado

    def delete(self, request):
        usuario = request.user
        usuario.estado = False  # Desactivamos la cuenta
        usuario.save()

        # Enviar notificación por correo electrónico
        enviar_notificacion_correo(usuario)

        return Response({'mensaje': 'Tu cuenta ha sido desactivada. Si deseas reactivarla, contacta al administrador.'}, status=status.HTTP_200_OK)


def enviar_notificacion_correo(usuario):
    """Envía un correo electrónico notificando que la cuenta ha sido desactivada"""
    asunto = 'Tu cuenta ha sido desactivada'
    mensaje = f'Hola {usuario.username}, tu cuenta ha sido desactivada. Si no fuiste tú quien solicitó esto, por favor contáctanos.'
    remitente = 'soporte@tusitio.com'
    destinatario = [usuario.email]

    send_mail(asunto, mensaje, remitente, destinatario)

class ReactivarCuenta(APIView):
    permission_classes = [IsAuthenticated]  # Aseguramos que el usuario esté autenticado

    def post(self, request):
        usuario = request.user
        if not usuario.is_active:
            usuario.is_active = True  # Reactivamos la cuenta
            usuario.save()
            return Response({'mensaje': 'Tu cuenta ha sido reactivada exitosamente.'}, status=status.HTTP_200_OK)
        else:
            return Response({'mensaje': 'Tu cuenta ya está activa.'}, status=status.HTTP_400_BAD_REQUEST)
