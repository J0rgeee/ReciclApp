from django.forms import ValidationError
from rest_framework import serializers
from .models import Metas,ProgresoUsuarioMeta,PuntuacioUsuario,Producto,Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,TipoUsuario,Direcciones,Publicacion,SugRec,EstadoVisita,RegistroRetiro
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

class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

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
        fields = ['idPv','nombre','direccion','nro','estado','nomComuna']



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
        model  = UserModel
        fields ='__all__'  
    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'])
        user_obj.username = clean_data['username']
        user_obj.tipoUser_id = 2
        user_obj.save()
        return user_obj
    

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
          fields = ['email','username','nombre','apellido','telefono']
          

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

