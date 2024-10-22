from django.forms import ValidationError
from rest_framework import serializers
from .models import Ciudad,Comuna,PuntoVerde,TipoReciclaje,TipoReciclajePv,TipoUsuario,Direcciones,Publicacion,SugRec,EstadoVisita,RegistroRetiro
from django.contrib.auth import get_user_model,authenticate

UserModel= get_user_model()

class TipoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUsuario
        fields = '__all__'

class DireccionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direcciones
        fields = '__all__'

class PublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publicacion
        fields = '__all__'

class SugRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = SugRec
        fields = '__all__'

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
        fields = '__all__'

class CiudadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciudad
        fields   = '__all__'
    

class ComunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comuna
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
          

class UsuarioActivoSerializar(serializers.ModelSerializer):
     class Meta:
          model = UserModel
          fields = '__all__'


class UsuarioUpdateSerializaer(serializers.ModelSerializer):
    class Meta:
          model = UserModel
          fields = ['email','username','nombre','apellido','telefono']

