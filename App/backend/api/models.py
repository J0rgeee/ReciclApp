from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser,BaseUserManager
from django.contrib.auth.models import PermissionsMixin

class Ciudad (models.Model):
    idCiudad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

class Comuna(models.Model):
    idComuna = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    idCiudad = models.ForeignKey(Ciudad ,on_delete=models.CASCADE)

class TipoReciclaje (models.Model):
    idTR = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

class PuntoVerde(models.Model):
    idPv = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=50)
    nro = models.IntegerField()
    estado = models.BooleanField(default=False)
    nomComuna = models.ForeignKey(Comuna,on_delete=models.CASCADE)

class TipoReciclajePv(models.Model):
    idPv = models.ForeignKey(PuntoVerde,on_delete=models.CASCADE)
    idTr = models.ForeignKey(TipoReciclaje,on_delete=models.CASCADE)
    

class TipoUsuario (models.Model):
    idTR = models.AutoField(primary_key=True)
    desc = models.CharField(max_length=50)

class UsuarioManager(BaseUserManager):
    def create_user(self,email,password=None):
        if not email:
            raise ValueError('Se requiere un email valido.')
        if not password:
            raise ValueError('Se requiere una contraseña.')
        email = self.normalize_email(email)
        user  = self.model(email=email)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self,email,password=None):
        if not email:
            raise ValueError('Se requiere un email valido.')
        if not password:
            raise ValueError('Se requiere una contraseña.')
        user = self.create_user(email,password)
        user.is_superuser = True
        user.save()
        return user
    
class Usuario (AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=70,unique=True,primary_key=True)
    username = models.CharField(max_length=50)
    nombre = models.CharField(max_length=50,null=True)
    apellido = models.CharField(max_length=50,null=True)
    fechaNac = models.DateField(null=True)
    estado = models.BooleanField(default=True)
    tipoUser = models.ForeignKey(TipoUsuario,on_delete=models.CASCADE,null=True)
    telefono = models.CharField(max_length=50,null=True)
    foto = models.CharField(max_length=50,null=True)
    fechaReg = models.DateField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FILEDS = ['username']
    objects = UsuarioManager()
    def __str__(self):
        return self.username
    

class Direcciones (models.Model):
    idDireccion = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=50)
    nro = models.IntegerField()
    nomComuna = models.ForeignKey(Comuna,on_delete=models.CASCADE)
    emailUser = models.ForeignKey(Usuario,on_delete=models.CASCADE)

class Publicacion (models.Model):
    idPublicacion = models.AutoField(primary_key=True)
    desc = models.CharField(max_length=256)
    img = models.CharField(max_length=50)
    emailUsuario = models.ForeignKey(Usuario,on_delete=models.CASCADE)


class SugRec (models.Model):
    idSR = models.AutoField(primary_key=True)
    asunto = models.CharField(max_length=50)
    desc = models.CharField(max_length=256)
    emailUsuario = models.ForeignKey(Usuario,on_delete=models.CASCADE)

class EstadoVisita (models.Model):
    idEV = models.AutoField(primary_key=True)
    nomEstado = models.CharField(max_length=50)

class RegistroRetiro (models.Model):
    idRetiro = models.AutoField(primary_key=True)
    emailUser = models.ForeignKey(Usuario,on_delete=models.CASCADE)
    fechaReg = models.DateField(auto_now_add=True)
    fechaVisita = models.DateField()
    horaVisita = models.DateField()
    estadoVisita = models.ForeignKey(EstadoVisita,on_delete=models.CASCADE) 
    desc = models.CharField(max_length=256)
    idDireccion = models.ForeignKey(Direcciones,on_delete=models.CASCADE)



    





