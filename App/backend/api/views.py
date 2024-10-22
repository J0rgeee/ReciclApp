from django.shortcuts import render
from rest_framework import viewsets,permissions, status,generics
from .serializer import UsuarioUpdateSerializaer,PuntoVerdeSerializer,ComunaSerializer,CiudadSerializer,TipoReciclajePveSerializer,TipoReciclajeSerializer,UsuarioLoginSerializer,UsuarioRegistroSerializaer,UsuarioSerializer,UsuarioActivoSerializar # type: ignore
from .models import Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,Usuario
# from .validations import custom_validation, validate_email, validate_password
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.
class PtoVerdeView (viewsets.ModelViewSet):
    serializer_class = PuntoVerdeSerializer
    queryset = PuntoVerde.objects.all()

class CiudadView (viewsets.ModelViewSet):
    serializer_class = CiudadSerializer
    queryset = Ciudad.objects.all()
    
class ComunaView (viewsets.ModelViewSet):
    serializer_class = ComunaSerializer
    queryset = Comuna.objects.all()

class TipoReciclajeView (viewsets.ModelViewSet):
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
	
class UsuarioActivo (viewsets.ModelViewSet):
    serializer_class = UsuarioActivoSerializar
    queryset = Usuario.objects.all()


class UpdateUsuario(generics.UpdateAPIView):
	serializar_class = UsuarioUpdateSerializaer
	queryset = Usuario.objects.all()
	permission_classes = [permissions.IsAuthenticated] 

	# def get_queryset(self):
    	# return self.queryset.filter(email=self.request.Usuario.email)
