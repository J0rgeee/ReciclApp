from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import viewsets,permissions, status,generics
from .serializer import PesoUsuarioPlasticoSerializer, TransPesoSerializer,TransPuntosSerializer,DireccionesSerializer,MetasSerializer,ProgresoUsuarioMetaSerializer,PuntuacionSerializer,ProductoSerializer,SugRecSerializer,DesactivarUserSerializaer,RegistroRetiroSerializer,PublicacionSerializer,UsuarioUpdateSerializaer,PuntoVerdeSerializer,ComunaSerializer,CiudadSerializer,TipoReciclajePveSerializer,TipoReciclajeSerializer,UsuarioLoginSerializer,UsuarioRegistroSerializaer,UsuarioSerializer,AdminUsuariosSerializer,ComentarioSerializer,PedidoSerializer, NotificacionSerializer # type: ignore
from .models import PesoUsuario, TipoUsuario,TransPuntos,Direcciones,ProgresoUsuarioMeta,Metas,PuntuacioUsuario,Producto,Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,Usuario,Publicacion,RegistroRetiro,SugRec,Like,Comentario,Pedido,Notificacion
# from .validations import custom_validation, validate_email, validate_password
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAuthenticatedOrReadOnly,IsAdminUser
from rest_framework.decorators import api_view, permission_classes, action
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password  # Para encriptar contraseñas

import json
import serial

from .permissions import IsAprobador



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
        try:
            data = request.data
            print("Datos recibidos:", data)  # Debug log
            
            # Validar que todos los campos requeridos estén presentes
            required_fields = ['email', 'username', 'password']
            for field in required_fields:
                if not data.get(field):
                    return Response(
                        {"error": f"El campo {field} es requerido"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Verificar si el email ya existe
            if Usuario.objects.filter(email=data['email']).exists():
                return Response(
                    {"mensaje": "El correo ya está registrado"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            print("Validando serializer con datos:", data)  # Debug log
            serializer = UsuarioRegistroSerializaer(data=data)
            
            if not serializer.is_valid():
                print("Errores del serializer:", serializer.errors)  # Debug log
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Usar validated_data del serializer
                user = serializer.save()
                if not user:
                    return Response(
                        {"error": "Error al crear el usuario"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Crear registros relacionados
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

                return Response(
                    {"mensaje": "Usuario registrado exitosamente"},
                    status=status.HTTP_201_CREATED
                )
            except Exception as create_error:
                print("Error al crear usuario:", str(create_error))  # Debug log
                return Response(
                    {"error": f"Error al crear el usuario: {str(create_error)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print("Error general:", str(e))  # Debug log
            return Response(
                {"error": f"Error en el servidor: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        serializer = UsuarioLoginSerializer(data=data)
        
        # Verificamos si el serializer es válido
        if serializer.is_valid(raise_exception=True):
            # Verificamos el usuario
            user = serializer.check_user(data)

            # Verificamos si el usuario existe
            if not user:
                return Response(
                    {"mensaje": "Usuario no encontrado. Verifica tus credenciales."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Verificar si la cuenta está activa
            if not user.estado:
                return Response(
                    {"mensaje": "Tu cuenta está desactivada. Por favor, contacta al administrador."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Realizar el login si todo es correcto
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

##########################################################################################################
##################################### Administrar Usuarios ###############################################   
    
class AdminUsuarios(viewsets.ViewSet):
    permission_classes = [IsAprobador]
    serializer_class = AdminUsuariosSerializer
    queryset = Usuario.objects.all()

     # Método para listar usuarios
    def list(self, request):
        usuarios = Usuario.objects.all()
        serializer = self.serializer_class(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='delete-by-email')
    def delete_by_email(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Se requiere un email"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = Usuario.objects.get(email=email)
            # Verificar que no sea administrador
            if getattr(usuario, 'tipoUser', None) == 1:
                return Response({"error": "No puedes eliminar a otro administrador"}, status=status.HTTP_403_FORBIDDEN)
            
            usuario.delete()
            return Response({"message": f"Usuario con email {email} eliminado con éxito"}, status=status.HTTP_204_NO_CONTENT)
        
        except Usuario.DoesNotExist:
            return Response({"error": f"No se encontró un usuario con el email {email}"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # Método para agregar un nuevo usuario
    @action(detail=False, methods=['post'], url_path='create-user')
    def create_user(self, request):
        data = request.data
        try:
            # Validar entrada
            if not data.get("email") or not data.get("password") or not data.get("tipoUser"):
                return Response(
                    {"error": "Faltan campos requeridos: email, password o tipoUser"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Buscar la instancia de TipoUsuario usando idTR
            try:
                tipo_usuario = TipoUsuario.objects.get(idTR=data['tipoUser'])
            except TipoUsuario.DoesNotExist:
                return Response(
                    {"error": f"No se encontró un tipo de usuario con idTR {data['tipoUser']}"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Crear el usuario
            nuevo_usuario = Usuario.objects.create(
                email=data['email'],
                password=make_password(data['password']),  # Encripta la contraseña
                tipoUser=tipo_usuario
            )

            return Response(
                {"message": f"Usuario {nuevo_usuario.email} creado exitosamente"},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": f"Error al crear el usuario: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        
    @action(detail=False, methods=['get'], url_path='list-tipo-user')
    def list_tipo_user(self, request):
        tipos = TipoUsuario.objects.all().values('idTR', 'desc')  # Ajusta el nombre del campo si es necesario
        return Response(tipos, status=status.HTTP_200_OK)

    
class UpdateUsuario(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAprobador]
    queryset = Usuario.objects.all()
    serializer_class = UsuarioUpdateSerializaer

    def get_object(self):
        email = self.kwargs.get('email')
        if not email:
            self.permission_denied(self.request, message="Email no proporcionado")
        try:
            return Usuario.objects.get(email=email)
        except Usuario.DoesNotExist:
            self.permission_denied(self.request, message="Usuario no encontrado")
    

class DesUsuario(generics.UpdateAPIView):
    #Desactivar o activar usuario (por el administrador)
    permission_classes = [permissions.IsAuthenticated, IsAprobador]
    queryset = Usuario.objects.all()
    serializer_class = DesactivarUserSerializaer
    lookup_field = 'email'

    def update(self, request, *args, **kwargs):
        usuario = self.get_object()
        usuario.estado = not usuario.estado  # Cambiamos el estado
        usuario.save()
        estado = "activado" if usuario.estado else "desactivado"
        return Response({'mensaje': f'El usuario ha sido {estado}.'}, status=status.HTTP_200_OK)
    
class DesactivarCuenta(APIView):
    permission_classes = [IsAuthenticated]  # Aseguramos que el usuario esté autenticado

    def delete(self, request):
        usuario = request.user
        usuario.estado = False  # Desactivamos la cuenta
        usuario.save()

        # Enviar notificación por correo electrónico
        enviar_notificacion_correo(usuario)

        return Response({'mensaje': 'Tu cuenta ha sido desactivada. Si deseas reactivarla, contacta al administrador.'}, status=status.HTTP_200_OK)

class ReactivarCuenta(APIView):
    permission_classes = [permissions.IsAuthenticated]  # Aseguramos que el usuario esté autenticado

    def post(self, request):
        usuario = request.user
        if not usuario.estado:
            usuario.estado = True  # Reactivamos la cuenta
            usuario.save()
            return Response({'mensaje': 'Tu cuenta ha sido reactivada exitosamente.'}, status=status.HTTP_200_OK)
        else:
            return Response({'mensaje': 'Tu cuenta ya está activa.'}, status=status.HTTP_400_BAD_REQUEST)

def enviar_notificacion_correo(usuario):
    try:
        """Envía un correo electrónico notificando el cambio de estado de la cuenta."""
        asunto = 'Cambio en el estado de tu cuenta'
        mensaje = (
            f'Hola {usuario.username}, tu cuenta ha sido actualizada. '
            f'Estado actual: {"activa" if usuario.estado else "desactivada"}.'
        )
        remitente = 'fe.curin@duocuc.cl'
        destinatario = [usuario.email]
        send_mail(asunto, mensaje, remitente, destinatario)
    except Exception as e:
        print(f"Error al enviar correo: {str(e)}")

class CrearNotificacion(APIView):
    def post(self, request):
        email = request.data.get('email')
        mensaje = request.data.get('mensaje')

        try:
            usuario = Usuario.objects.get(email=email)
            if not usuario.estado:  # Solo permite notificaciones de cuentas desactivadas
                Notificacion.objects.create(usuario=usuario, mensaje=mensaje)
                return Response({'mensaje': 'Notificación enviada correctamente.'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Solo las cuentas desactivadas pueden enviar notificaciones.'}, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

class EliminarNotificacion(APIView):
    def delete(self, request, id): 
        try: 
            notificacion = Notificacion.objects.get(id=id) 
            notificacion.delete() 
            return Response({'mensaje': 'Notificación eliminada correctamente.'}, status=status.HTTP_204_NO_CONTENT) 
        except Notificacion.DoesNotExist: 
            return Response({'error': 'Notificación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

class ActualizarEstadoNotificacion(APIView):
    def patch(self, request, id):
        try:
            notificacion = Notificacion.objects.get(id=id)
            notificacion.leido =  not notificacion.leido
            notificacion.save()
            return Response({'mensaje': 'Notificación marcada como.','leido': notificacion.leido}, status=status.HTTP_200_OK)
        except Notificacion.DoesNotExist:
            return Response({'error': 'Notificación no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

class ListarNotificacionesAdmin(viewsets.ModelViewSet):
    permission_classes = [IsAprobador]
    queryset = Notificacion.objects.all().order_by('-fecha_envio')
    serializer_class = NotificacionSerializer


##################################### Administrar Usuarios ###############################################
##########################################################################################################


##########################################################################################################
##################################### Publicaciones ######################################################

class PublicacionesView(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all().order_by('-timeCreate')
    serializer_class = PublicacionSerializer  # Definir el serializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Solo mostrar publicaciones aprobadas para usuarios no administradores
        if not self.request.user.is_staff:
            return Publicacion.objects.filter(estado=True).order_by('-timeCreate')
        return super().get_queryset()  # Administradores pueden ver todas

    def create(self, request, *args, **kwargs):
        # Agregar datos adicionales antes de la validación
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Guarda el objeto con el usuario autenticado como `emailUsuario`
            serializer.save(emailUsuario=request.user)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        # En caso de errores de validación
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, *args, **kwargs):
        # Permitir que un administrador apruebe una publicación
        instance = self.get_object()
        if not request.user.is_staff:
            return Response({"detail": "No tienes permisos para aprobar publicaciones."},
                            status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_serializer_context(self):
        return {'request': self.request}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def dar_o_eliminar_like(request, publicacion_id):
    usuario = request.user
    print(publicacion_id)
    try:
        publicacion = Publicacion.objects.get(idPublicacion = publicacion_id)
    except Publicacion.DoesNotExist:
        return Response({"error": "Publicación no encontrada"}, status=404)

    # Verificar si el usuario ya ha dado "like" a la publicación
    like = Like.objects.filter(usuario=usuario, publicacion=publicacion).first()
    if like:
        # Si el like existe, se elimina (unlike)
        like.delete()
        publicacion.likes_count -= 1
        publicacion.save()
        return Response({"message": "Like eliminado", "likes_count": publicacion.likes_count, "has_liked": False})
    else:
        # Si no existe, se crea el like
        Like.objects.create(usuario=usuario, publicacion=publicacion)
        publicacion.likes_count += 1
        publicacion.save()
        return Response({"message": "Like añadido", "likes_count": publicacion.likes_count, "has_liked": True})

@api_view(['GET', 'POST','DELETE'])
def comentarios_publicacion(request, idPublicacion, idComentario=None):
    try:
        publicacion = Publicacion.objects.get(idPublicacion=idPublicacion)
    except Publicacion.DoesNotExist:
        return Response({"error": "Publicación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comentarios = Comentario.objects.filter(publicacion=publicacion).order_by('fecha_creacion')
        serializer = ComentarioSerializer(comentarios, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ComentarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(publicacion=publicacion, usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            comentario = Comentario.objects.get(id=idComentario, publicacion=publicacion, usuario=request.user)
        except Comentario.DoesNotExist:
            return Response({"error": "Comentario no encontrado o no autorizado para eliminarlo"}, status=status.HTTP_404_NOT_FOUND)

        comentario.delete()
        return Response({"message": "Comentario eliminado con éxito"}, status=status.HTTP_200_OK)
    # Error si `idComentario` no se proporciona en la solicitud DELETE
    return Response({"error": "ID del comentario es necesario para eliminarlo"}, status=status.HTTP_400_BAD_REQUEST)

class ActualizarEstado(APIView):
    permission_classes = [IsAuthenticated, IsAprobador]
    def patch(self, request, idPublicacion):
        try:
            publicacion = get_object_or_404(Publicacion, idPublicacion=idPublicacion)

            # Extraer y validar el campo estado
            nuevo_estado = request.data.get("estado")
            if nuevo_estado is None:
                return Response(
                    {"error": "El campo 'estado' es requerido."},
                    status=status.HTTP_400_BAD_REQUEST
                )

             # Actualizar estado usando el serializador
            serializer = PublicacionSerializer(
                publicacion, 
                data={"estado": nuevo_estado}, 
                partial=True  # Permite actualizar solo algunos campos
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Estado actualizado correctamente.", "estado": serializer.data['estado']},
                    status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Ocurrió un error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PublicacionesPendientesView(ModelViewSet):
    queryset = Publicacion.objects.filter(estado=False).order_by('-timeCreate')  # Solo publicaciones no aprobadas
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated, IsAprobador]

    @action(detail=True, methods=['patch'], url_path='aprobar')
    def aprobar(self, request, pk=None):
        try:
            publicacion = self.get_object()  # Obtiene la publicación según `pk`
            publicacion.estado = True  # Cambia el estado a aprobado
            publicacion.save()
            return Response({"message": "Publicación aprobada con éxito."})
        except Publicacion.DoesNotExist:
            return Response({"error": "Publicación no encontrada."}, status=404)
        
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAprobador])
    def desaprobar(self, request, pk=None):
        """
        Acción para desaprobar una publicación.
        """
        try:
            publicacion = Publicacion.objects.get(pk=pk, estado=True)
            publicacion.estado = False
            publicacion.save()
            return Response({"message": "Publicación desaprobada con éxito."})
        except Publicacion.DoesNotExist:
            return Response({"error": "Publicación no encontrada o ya desaprobada."}, status=404)

    @action(detail=True, methods=['delete'], permission_classes=[IsAuthenticated, IsAprobador])
    def eliminar(self, request, pk=None):
        """
        Acción para eliminar una publicación.
        """
        try:
            publicacion = Publicacion.objects.get(pk=pk)
            publicacion.delete()
            return Response({"message": "Publicación eliminada con éxito."})
        except Publicacion.DoesNotExist:
            return Response({"error": "Publicación no encontrada."}, status=404)

##################################### Publicaciones ######################################################
##########################################################################################################
class RetiroView(viewsets.ModelViewSet):
    queryset = RegistroRetiro.objects.all()
    def get_serializer_class(self):
        return RegistroRetiroSerializer 

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

@csrf_exempt
@require_GET
def get_google_maps_api_key(request):
    api_key = getattr(settings, "GOOGLE_MAPS_API_KEY", None)
    if not api_key:
        return JsonResponse({"error": "API key not found"}, status=500)
    return JsonResponse({"apiKey": api_key})


class ReadWeightDataView(APIView):
    def get(self, request):
        try:
            with serial.Serial('COM3', 9600, timeout=2) as arduino:
                if arduino.is_open:
                    line = arduino.readline().decode('utf-8').strip()
                    if line:
                        weight_data = float(line)
                        return Response({'weight': weight_data}, status=status.HTTP_200_OK)
                else:
                    print("Arduino no está disponible")
            return Response({'error': 'Arduino not available'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except serial.SerialException as e:
            print(f"Error de conexión serial: {e}")
            return Response({'error': 'Serial connection failed'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            print(f"Error inesperado: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



def read_weight_data(request):
    try:
        with serial.Serial('COM3', 9600, timeout=1) as arduino:
            if arduino.is_open:
                weight_data_list = []  # Lista para almacenar los últimos 10 registros

                while True:
                    line = arduino.readline().decode('utf-8').strip()
                    print(f"Datos recibidos: {line}")  # Para depuración
                    
                    try:
                        # Intenta convertir el valor a float (usado para decimales)
                        weight_data = float(line)
                    except ValueError:
                        try:
                            # Si no es un float, intenta convertir a int
                            weight_data = int(line)
                        except ValueError:
                            # Si no se puede convertir, ignora la línea
                            print(f"Dato inválido ignorado: {line}")
                            continue  # Continua leyendo más líneas

                    # Si la conversión fue exitosa, guarda el valor en la lista
                    weight_data_list.append(weight_data)

                    # Si ya hay 10 registros, obtiene el valor máximo
                    if len(weight_data_list) == 5:
                        max_weight = max(weight_data_list)  # Obtiene el valor máximo
                        print(f"Valor máximo calculado: {max_weight}")  # Para depuración

                        # Devuelve el valor máximo y limpia la lista para los siguientes 10 registros
                        return JsonResponse({'max_weight': max_weight}, status=200)

                    # Si aún no hay 10 registros, continua capturando datos
                    continue

            else:
                print("Arduino no está disponible en el puerto")
                return JsonResponse({'error': 'Arduino not available'}, status=503)

    except serial.SerialException as e:
        print(f"Error de conexión serial: {e}")
        return JsonResponse({'error': 'Serial connection failed'}, status=503)
    except Exception as e:
        print(f"Error inesperado: {e}")
        return JsonResponse({'error': str(e)}, status=500)
    
class TransPesoCreateAPIView(APIView):
    def post(self, request):
        # Serializa los datos entrantes
        serializer = TransPesoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()  # Guarda el registro si es válido
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Si no es válido, regresa un error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PuntosPesaPlasticoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        # Filtramos las direcciones asociadas al usuario con el email proporcionado
        puntosplas = PesoUsuario.objects.filter(emailusuario__email=email)
        if not puntosplas:
            return Response({"message": "No se encontraron pesos para este usuario"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PesoUsuarioPlasticoSerializer(puntosplas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
	
    
class PuntosPesaPlasticoUpdateView(APIView):
    def patch(self, request, emailusuario):
        try:
            email = PesoUsuario.objects.get(emailusuario=emailusuario)
        except PesoUsuario.DoesNotExist:
            return Response({"message": "Dirección no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        # Usamos el serializador para validar y actualizar los datos
        serializer = PesoUsuarioPlasticoSerializer(email, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
# Canje de puntos en tienda
@api_view(['POST'])
def crear_pedido(request):
    if request.method == 'POST':
        usuario = request.user

        direccion_id = request.data.get('direccion_id')
        productos_ids = request.data.get('productos_ids')
        puntos_utilizados = request.data.get('puntos_utilizados')
        tipo_puntos = request.data.get('tipo_puntos')

        try:
            # Verificar si la dirección existe
            direccion = Direcciones.objects.get(idDireccion=direccion_id)
        except Direcciones.DoesNotExist:
            return Response({"error": "Dirección no encontrada"}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener los productos
        productos = Producto.objects.filter(id__in=productos_ids)

        try:
            # carga los puntos del usuario
            puntuacion_usuario = PuntuacioUsuario.objects.get(emailusuario=usuario)

            # verifica puntos del usuarioo
            if tipo_puntos == 'plas' and puntuacion_usuario.puntosplas >= puntos_utilizados:
                puntuacion_usuario.puntosplas -= puntos_utilizados
            elif tipo_puntos == 'papel' and puntuacion_usuario.puntospapel >= puntos_utilizados:
                puntuacion_usuario.puntospapel -= puntos_utilizados
            elif tipo_puntos == 'vidrio' and puntuacion_usuario.putnosvidrio >= puntos_utilizados:
                puntuacion_usuario.putnosvidrio -= puntos_utilizados
            elif tipo_puntos == 'carton' and puntuacion_usuario.puntoscarton >= puntos_utilizados:
                puntuacion_usuario.puntoscarton -= puntos_utilizados
            elif tipo_puntos == 'latas' and puntuacion_usuario.puntoslatas >= puntos_utilizados:
                puntuacion_usuario.puntoslatas -= puntos_utilizados
            else:
                return Response({"error": f"No tienes suficientes puntos de tipo {tipo_puntos}."}, status=status.HTTP_400_BAD_REQUEST)

            # guardar los cambios de puntos
            puntuacion_usuario.save()

            # crear el pedido
            pedido = Pedido.objects.create(
                direccion=direccion,
                puntos_utilizados=puntos_utilizados
            )
            pedido.productos.set(productos)
            serializer = PedidoSerializer(pedido)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except PuntuacioUsuario.DoesNotExist:
            return Response({"error": "No se encontraron puntos"}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def listar_pedidos(request):
    if request.method == 'GET':
        # Filtrar los pedidos por el usuario autenticado
        pedidos = Pedido.objects.filter(usuario=request.user)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    try:
        stats = {
            'totalUsuarios': Usuario.objects.count(),
            'usuariosActivos': Usuario.objects.filter(estado=True).count(),
            'totalPuntosVerdes': PuntoVerde.objects.count(),
            'totalPublicaciones': Publicacion.objects.count()
        }
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=500)