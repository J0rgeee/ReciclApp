from django.shortcuts import render
from rest_framework import viewsets,permissions, status,generics
from .serializer import DireccionesSerializer,MetasSerializer,ProgresoUsuarioMetaSerializer,PuntuacionSerializer,ProductoSerializer,SugRecSerializer,DesactivarUserSerializaer,RegistroRetiroSerializer,PublicacionSerializer,UsuarioUpdateSerializaer,PuntoVerdeSerializer,ComunaSerializer,CiudadSerializer,TipoReciclajePveSerializer,TipoReciclajeSerializer,UsuarioLoginSerializer,UsuarioRegistroSerializaer,UsuarioSerializer,AdminUsuariosSerializer # type: ignore
from .models import Direcciones,ProgresoUsuarioMeta,Metas,PuntuacioUsuario,Producto,Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,Usuario,Publicacion,RegistroRetiro,SugRec
# from .validations import custom_validation, validate_email, validate_password
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404



# Create your views here.
class PtoVerdeView (viewsets.ModelViewSet):
	permission_classes = (permissions.AllowAny,)
	serializer_class = PuntoVerdeSerializer
	queryset = PuntoVerde.objects.all()

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def crear_punto_verde(request):
    serializer = PuntoVerdeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
				metas = Metas.objects.all()
				for meta in metas:
					ProgresoUsuarioMeta.objects.create(
						emailUser=user, 
                		idMeta=meta,
                		progreso=0, 
                		completado25=False,
                		completado50=False,
                		completado75=False,
                		completado100=False,
					)
				PuntuacioUsuario.objects.create(
					emailusuario=user,
					puntosplas=0,
					puntospapel=0,
					putnosvidrio=0,
					puntoscarton=0,
					puntoslatas=0,
				)

				
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
	permission_classes = (permissions.AllowAny,)
	serializer_class = AdminUsuariosSerializer
	queryset = Usuario.objects.all()
	


class UpdateUsuario(generics.UpdateAPIView):
	permission_classes = [permissions.IsAuthenticated] 
	queryset = Usuario.objects.all()

	def get_serializer_class(self):
		return UsuarioUpdateSerializaer
	
	def get_object(self):
		email = self.kwargs.get('email')
		if not email:
			self.permission_denied(self.request, message="Email no proporcionado")

		try:
			return Usuario.objects.get(email=email)
		except Usuario.DoesNotExist:
			self.permission_denied(self.request, message="Usuario no encontrado")
	

class DesUsuario(generics.UpdateAPIView):
	permission_classes = [permissions.IsAuthenticated] 
	queryset = Usuario.objects.all()
	def get_serializer_class(self):
		return DesactivarUserSerializaer
	def get_object(self):
		return self.request.user


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

class ContactoView (viewsets.ModelViewSet):
	permission_classes = [AllowAny]
	serializer_class = SugRecSerializer
	queryset = SugRec.objects.all()

class ProductoView (viewsets.ModelViewSet):
	permission_classes = [AllowAny]
	serializer_class = ProductoSerializer
	queryset = Producto.objects.all()

class PuntuacionViewSet(viewsets.ViewSet):
    def retrieve_puntuacion_usuario(self, request, email=None):
        puntuacion = get_object_or_404(PuntuacioUsuario, emailusuario_id=email)
        serializer = PuntuacionSerializer(puntuacion)
        return Response(serializer.data, status=status.HTTP_200_OK)
	

class MetasViewSet(viewsets.ViewSet):
    def list_metas_usuario(self, request, email=None):
        metas = Metas.objects.all()
        metas_con_progreso = []

        for meta in metas:
            progreso = ProgresoUsuarioMeta.objects.filter(emailUser__email=email, idMeta=meta)
            if progreso.exists():
                metas_con_progreso.append({
                    **MetasSerializer(meta).data,
                    'progreso': ProgresoUsuarioMetaSerializer(progreso.first()).data
                })
        
        return Response(metas_con_progreso, status=status.HTTP_200_OK)
	

class DireccionesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        # Filtramos las direcciones asociadas al usuario con el email proporcionado
        direcciones = Direcciones.objects.filter(emailUser__email=email)
        if not direcciones:
            return Response({"message": "No se encontraron direcciones para este usuario"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DireccionesSerializer(direcciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
	

class DireccionesUpdateView(APIView):
    def patch(self, request, idDireccion):
        try:
            direccion = Direcciones.objects.get(idDireccion=idDireccion)
        except Direcciones.DoesNotExist:
            return Response({"message": "Dirección no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        # Usamos el serializador para validar y actualizar los datos
        serializer = DireccionesSerializer(direccion, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	

class ComunaListView(APIView):
    def get(self, request):
        comunas = Comuna.objects.all()
        serializer = ComunaSerializer(comunas, many=True)
        return Response(serializer.data)
	

class CrearDireccionesViewSet(viewsets.ModelViewSet):
    queryset = Direcciones.objects.all()
    serializer_class = DireccionesSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)