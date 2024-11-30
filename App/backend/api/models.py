from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser,BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.conf import settings

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
    imagen = models.CharField(max_length=100,null=True)
    desc = models.CharField(max_length=1000,null=True)
    comollevar = models.CharField(max_length=1000,null=True)
    reconocer = models.CharField(max_length=1000,null=True)
    nollevar= models.CharField(max_length=1000,null=True)

class PuntoVerde(models.Model):
    idPv = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=50)
    nro = models.IntegerField()
    estado = models.BooleanField(default=False)
    nomComuna = models.ForeignKey(Comuna,on_delete=models.CASCADE)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)

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
    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError('Se requiere un email válido.')
        if not password:
            raise ValueError('Se requiere una contraseña.')
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

    
class Usuario (AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(max_length=70,unique=True,primary_key=True)
    username = models.CharField(max_length=50)
    nombre = models.CharField(max_length=50,null=True)
    apellido = models.CharField(max_length=50,null=True)
    fechaNac = models.DateField(null=True)
    estado = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Necesario para distinguir administradores
    is_superuser = models.BooleanField(default=False) # Permite distinguir superusuarios
    tipoUser = models.ForeignKey(TipoUsuario,on_delete=models.CASCADE,null=True)
    telefono = models.CharField(max_length=50,null=True)
    foto = models.CharField(max_length=50,null=True)
    fechaReg = models.DateField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FILEDS = []
    objects = UsuarioManager()
    def __str__(self):
        return self.username
    
class PuntuacioUsuario(models.Model):
    emailusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    puntosplas = models.IntegerField()
    puntospapel = models.IntegerField()
    putnosvidrio = models.IntegerField()
    puntoscarton = models.IntegerField()
    puntoslatas = models.IntegerField()

class PesoUsuario(models.Model):
    emailusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    pesoplas = models.IntegerField()
    pesopal = models.IntegerField()
    pesovid = models.IntegerField()
    pesocar = models.IntegerField()
    pesolat = models.IntegerField()


class TransPuntos(models.Model):
    emailusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    cantidadpuntos = models.IntegerField()
    cantidadpeso = models.IntegerField()
    fechatrans = models.DateField(auto_now_add=True)
    estado = models.BooleanField(default=True)
    tiporec= models.ForeignKey(TipoReciclaje,on_delete=models.CASCADE,default=True)


class TransPeso(models.Model):
    emailusuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    cantidadpeso = models.IntegerField()
    fechatrans = models.DateField(auto_now_add=True)
    estado = models.BooleanField(default=True)
    tiporec= models.ForeignKey(TipoReciclaje,on_delete=models.CASCADE,default=True)



class Direcciones (models.Model):
    idDireccion = models.AutoField(primary_key=True)
    calle = models.CharField(max_length=50)
    nro = models.IntegerField()
    nomComuna = models.ForeignKey(Comuna,on_delete=models.CASCADE)
    emailUser = models.ForeignKey(Usuario,on_delete=models.CASCADE)

class Publicacion (models.Model):
    idPublicacion = models.AutoField(primary_key=True)
    desc = models.CharField(max_length=256)
    img = models.ImageField(upload_to='images/', null=True, blank=True)
    timeCreate = models.DateTimeField(auto_now_add=True)
    emailUsuario = models.ForeignKey(Usuario,on_delete=models.CASCADE)
    likes_count = models.IntegerField(default=0)
    estado = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.emailUsuario.username} - {self.timeCreate}'

class Like(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='likes')
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='likes')
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'publicacion')  # Evita duplicados

    def __str__(self):
        return f"{self.usuario.email} liked {self.publicacion.desc}"
    
def dar_like(usuario, publicacion):
    # Comprobar si el usuario ya ha dado "like"
    if Like.objects.filter(usuario=usuario, publicacion=publicacion).exists():
        return "Ya has dado like a esta publicación."

    # Si no ha dado "like", se crea el registro y se actualiza el contador
    Like.objects.create(usuario=usuario, publicacion=publicacion)
    publicacion.likes_count += 1
    publicacion.save()
    return "Like añadido."

class Comentario(models.Model):
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comentario de {self.usuario} en {self.publicacion}'
    
class SugRec (models.Model):
    idSR = models.AutoField(primary_key=True)
    asunto = models.CharField(max_length=50)
    desc = models.CharField(max_length=256)
    emailUsuario = models.CharField(max_length=70)

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

class Producto (models.Model):
    idProducto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    desc = models.CharField(max_length=256)
    precio = models.IntegerField()
    stock = models.IntegerField()
    imagen = models.CharField(max_length=50)

class Metas (models.Model):
    idMeta = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    desc = models.CharField(max_length=500)
    finalMeta = models.IntegerField()

class ProgresoUsuarioMeta (models.Model):
    idPUM = models.AutoField(primary_key=True)
    emailUser = models.ForeignKey(Usuario,on_delete=models.CASCADE)
    idMeta = models.ForeignKey(Metas,on_delete=models.CASCADE)
    progreso = models.IntegerField()
    completado25 = models.BooleanField(default=False)
    completado50 = models.BooleanField(default=False)
    completado75 = models.BooleanField(default=False)
    completado100 = models.BooleanField(default=False)
    def __str__(self):
        return f"Progreso de {self.emailUser} en {self.idMeta.nombre}"

    class Meta:
        unique_together = ('emailUser', 'idMeta') 

class Pedido(models.Model):
    idPedido = models.AutoField(primary_key=True)
    direccion = models.ForeignKey(Direcciones, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto)
    puntos_utilizados = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"Pedido #{self.idPedido} con dirección {self.direccion}"






    





