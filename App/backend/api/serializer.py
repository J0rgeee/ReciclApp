from django.forms import ValidationError
from rest_framework import serializers
from .models import PesoUsuario, TransPeso,TransPuntos,Metas,ProgresoUsuarioMeta,PuntuacioUsuario,Producto,Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,TipoUsuario,Direcciones,Publicacion,SugRec,EstadoVisita,RegistroRetiro,Like,Comentario,Pedido,Notificacion, Usuario
from django.contrib.auth import get_user_model,authenticate

UserModel= get_user_model()

class TipoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUsuario
        fields = '__all__'

class ComunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comuna
        fields   =  ['idComuna', 'nombre']

class DireccionesSerializer(serializers.ModelSerializer):
    nomComuna = serializers.PrimaryKeyRelatedField(queryset=Comuna.objects.all())

    class Meta:
        model = Direcciones
        fields = ['idDireccion', 'calle', 'nro', 'nomComuna','emailUser']  # Ajusta los campos según tu modelo

    def update(self, instance, validated_data):
        # Actualizar el campo nomComuna con el ID proporcionado
        nom_comuna_data = validated_data.pop('nomComuna', None)
        if nom_comuna_data:
            instance.nomComuna_id = nom_comuna_data.idComuna
        # Actualizar otros campos
        instance.calle = validated_data.get('calle', instance.calle)
        instance.nro = validated_data.get('nro', instance.nro)
        
        # Guardar la instancia actualizada
        instance.save()
        return instance
    
class NotificacionSerializer(serializers.ModelSerializer):
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    class Meta:
        model = Notificacion
        fields = ['id', 'usuario', 'mensaje', 'fecha_envio', 'leido', 'usuario_email']

class PublicacionSerializer(serializers.ModelSerializer):
    has_liked = serializers.SerializerMethodField()
    username = serializers.CharField(source='emailUsuario.username', read_only=True)
    class Meta:
        model = Publicacion
        fields = ['idPublicacion', 'desc', 'img','timeCreate','emailUsuario', 'likes_count', 'has_liked','username','estado']
        read_only_fields = ['timeCreate', 'likes_count']
        
    def get_has_liked(self, obj):
        user = self.context['request'].user if 'request' in self.context else None
        return Like.objects.filter(usuario=user, publicacion=obj).exists() if user else False

class ComentarioSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()  # Para mostrar el nombre del usuario en lugar del ID
    usuario_email = serializers.EmailField(source='usuario.email', read_only=True)
    class Meta:
        model = Comentario
        fields = ['id', 'usuario', 'usuario_email','contenido', 'fecha_creacion']
        
    def get_usuario_email(self, obj):
        return obj.usuario.email  # Acceder al email desde la relación de usuario

class SugRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = SugRec
        fields = ['emailUsuario','asunto','desc']

class EstadoVisitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoVisita
        fields = '__all__'

class RegistroRetiroSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroRetiro
        fields = '__all__'

class PuntoVerdeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuntoVerde
        fields = ['idPv','nombre','direccion','nro','estado','nomComuna', 'lat', 'lng']



class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields   = '__all__'
    


class TipoReciclajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReciclaje
        fields   = '__all__'   

class TipoReciclajePveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoReciclajePv
        fields   = '__all__'        


class UsuarioRegistroSerializaer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            # Extraemos el username del validated_data
            username = validated_data.pop('username', None)
            # Creamos el usuario con email y password
            user = Usuario.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password']
            )
            # Asignamos el username después de crear el usuario
            if username:
                user.username = username
                user.tipoUser_id = 2
                user.save()
            return user
        except Exception as e:
            print(f"Error en create del serializer: {str(e)}")
            raise

class UsuarioLoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField()
	def check_user(self, clean_data):
		user = authenticate(username=clean_data['email'], password=clean_data['password'])
		if not user :
			raise ValidationError('user not found')
		return user
     

class UsuarioSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields =  '__all__'
          

class AdminUsuariosSerializer(serializers.ModelSerializer):
     class Meta:
          model = UserModel
          fields = '__all__'


class UsuarioUpdateSerializaer(serializers.ModelSerializer):
    class Meta:
          model = UserModel
          fields = ['email','username','nombre','apellido','telefono','foto']
          

class DesactivarUserSerializaer(serializers.ModelSerializer):
    class Meta:
          model = UserModel
          fields = ['email','username','estado']

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields   = '__all__'        

class PuntuacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuntuacioUsuario
        fields = ['puntosplas', 'puntospapel', 'putnosvidrio', 'puntoscarton', 'puntoslatas']


class ProgresoUsuarioMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoUsuarioMeta
        fields = ['progreso', 'completado25', 'completado50', 'completado75', 'completado100']

class MetasSerializer(serializers.ModelSerializer):
    progreso = ProgresoUsuarioMetaSerializer(many=False, read_only=True)  # Progreso por usuario
    class Meta:
        model = Metas
        fields = ['idMeta', 'nombre', 'desc', 'finalMeta', 'progreso']

class TransPuntosSerializer(serializers.ModelSerializer):
     class Meta:
          model = TransPuntos
          fields = ['id','puntosplas', 'puntospapel', 'putnosvidrio', 'puntoscarton', 'puntoslatas','emailusuario_id']

class TransPesoSerializer(serializers.ModelSerializer):
    tiporec_nombre = serializers.CharField(source='tiporec.nombre', read_only=True)
    
    class Meta:
        model = TransPeso
        fields = ['id', 'emailusuario', 'cantidadpeso', 'fechatrans', 'estado', 'tiporec', 'tiporec_nombre']

    def create(self, validated_data):
        # Redondear el peso a 2 decimales antes de crear el registro
        peso_kg = round(float(validated_data['cantidadpeso']), 2)
        validated_data['cantidadpeso'] = peso_kg
        validated_data['estado'] = False  # Aseguramos que se cree en estado False
        
        # Crear el registro de TransPeso sin sumar puntos
        transpeso = TransPeso.objects.create(**validated_data)
        return transpeso

    def validate_cantidadpeso(self, value):
        try:
            peso = round(float(value), 2)
            if peso <= 0:
                raise serializers.ValidationError("El peso debe ser mayor que 0")
            return peso
        except ValueError:
            raise serializers.ValidationError("El peso debe ser un número válido")

    def update(self, instance, validated_data):
        # Si el estado cambia a True, actualizamos los puntos
        if validated_data.get('estado', False) and not instance.estado:
            try:
                puntuacion, created = PuntuacioUsuario.objects.get_or_create(
                    emailusuario=instance.emailusuario
                )
                
                # Multiplicadores según la tabla de EcoPuntos
                multiplicadores = {
                    2: 100,   # Cartón: 100 puntos/kg
                    12: 150,  # Vidrio: 150 puntos/kg
                    16: 120,  # Papel: 120 puntos/kg
                    3: 200,   # Plástico: 200 puntos/kg
                    9: 250    # Latas: 250 puntos/kg
                }
                
                # Calcular puntos según el tipo de material
                peso_kg = instance.cantidadpeso
                tipo_reciclaje_id = instance.tiporec.idTR
                puntos = int(peso_kg * multiplicadores.get(tipo_reciclaje_id, 0))
                
                # Actualizar los puntos según el tipo de reciclaje
                if tipo_reciclaje_id == 3:  # Plástico
                    puntuacion.puntosplas += puntos
                elif tipo_reciclaje_id == 2:  # Cartón
                    puntuacion.puntoscarton += puntos
                elif tipo_reciclaje_id == 12:  # Vidrio
                    puntuacion.putnosvidrio += puntos
                elif tipo_reciclaje_id == 16:  # Papel
                    puntuacion.puntospapel += puntos
                elif tipo_reciclaje_id == 9:  # Latas
                    puntuacion.puntoslatas += puntos
                
                puntuacion.save()
                
            except Exception as e:
                print(f"Error al actualizar puntos: {str(e)}")
        
        # Actualizar los campos del modelo
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class PesoUsuarioPlasticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PesoUsuario
        fields = ['id','pesoplas','pesopal','pesovid','pesocar','pesolat','emailusuario']

    def update(self, instance, validated_data):
        instance.emailusuario = validated_data.get('emailusuario',instance.emailusuario)
        instance.pesoplas = validated_data.get('pesoplas',instance.pesoplas)
        instance.save()
        return instance

class PedidoSerializer(serializers.ModelSerializer):
    productos = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all(), many=True)
    direccion = serializers.PrimaryKeyRelatedField(queryset=Direcciones.objects.all())

    class Meta:
        model = Pedido
        fields = ['idPedido', 'direccion', 'productos', 'puntos_utilizados', 'fecha']
