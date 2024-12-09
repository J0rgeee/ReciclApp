from django.urls import path ,include
from rest_framework import routers # type: ignore
from rest_framework.documentation import include_docs_urls # type: ignore
from rest_framework.routers import DefaultRouter
from api import views
from . import views
from .views import  PublicacionesPendientesView, TransPesoCreateAPIView


router = routers.DefaultRouter()
router.register(r'ptoverde',views.PtoVerdeView,'ptoverde')

router2 = routers.DefaultRouter()
router2.register(r'tipoxpv',views.TipoReciclajePvView,'tipoxpv')

router3 = routers.DefaultRouter()
router3.register(r'tiporec',views.TipoReciclajeView,'tiporec')

router4 = routers.DefaultRouter()
router4.register(r'comuna',views.ComunaView,'comuna')

router5 = routers.DefaultRouter()
router5.register(r'ciudad',views.CiudadView,'ciudad')

router6 = routers.DefaultRouter()
router6.register(r'adminusuario',views.AdminUsuarios, basename='adminusuario')

router7 = routers.DefaultRouter()
router7.register(r'publi',views.PublicacionesView,'publi')

router8 = routers.DefaultRouter()
router8.register(r'regret',views.RetiroView,'regret')

router9 = routers.DefaultRouter()
router9.register(r'contacto',views.ContactoView,'contacto')

router10 = routers.DefaultRouter()
router10.register(r'producto',views.ProductoView,'producto')

router11 = routers.DefaultRouter()
router11.register(r'direcciones', views.CrearDireccionesViewSet)

router12 = routers.DefaultRouter()
router12.register(r'notificaciones', views.NotificacionViewSet, basename='notificaciones')

router13 = DefaultRouter()
router13.register(r'', PublicacionesPendientesView, basename='pendientes')

router_pesos = DefaultRouter()
router_pesos.register(r'admin/pesos', views.AdminTransPesoViewSet, basename='admin-pesos')

peso_viewset = views.TransPesoViewSet.as_view({'get': 'retrieve_puntuacion_usuario'})
puntuacion_viewset = views.PuntuacionViewSet.as_view({'get': 'retrieve_puntuacion_usuario'})
metas_viewset = views.MetasViewSet.as_view({'get': 'list_metas_usuario'})



urlpatterns = [
    path("PtoVerde/", include(router.urls)),
    path('PtoVerde/crear/', views.crear_punto_verde, name='crear_punto_verde'),
    path("TipoXPv/", include(router2.urls)),
    path("TipoRec/", include(router3.urls)),
    path("Comuna/", include(router4.urls)), 
    path("Ciudad/", include(router5.urls)),
    path("", include(router6.urls)), #admin usuarios
    path("Publi/", include(router7.urls)),
    path("Regret/", include(router8.urls)),
    path("Contacto/", include(router9.urls)),
    path("Producto/", include(router10.urls)),
    path('Dire/', include(router11.urls)),
    path('', include(router12.urls)), #notificaciones
    path('pendientes/', include(router13.urls)),
    path('api/pedido/', views.crear_pedido, name='crear_pedido'),
    path('api/pedidos/', views.listar_pedidos, name='listar_pedidos'),
    path('', include(router_pesos.urls)),

    # path('read-serial/', views.ReadWeightDataView.as_view(), name='read_serial_data'),

     path('read-weight/', views.read_weight_data, name='read-weight'),

    path('puntuacion/<str:email>/', puntuacion_viewset, name='puntuacion-usuario'), 
    path('metas/<str:email>/', metas_viewset, name='metas-usuario'),

    path('direcciones/<str:email>/', views.DireccionesListView.as_view(), name='direcciones-list'),
    path('direcciones/update/<int:idDireccion>/', views.DireccionesUpdateView.as_view(), name='direcciones-update'),
    path('comunas/', views.ComunaListView.as_view(), name='comunas-list'),

    path("Docs/",include_docs_urls(title="docs api")),

    path('pesousuario-plas/<str:email>/', views.PuntosPesaPlasticoView.as_view(), name='punto-plastico-list'),
    path('pesousuario-plas/update/<str:emailusuario>/', views.PuntosPesaPlasticoUpdateView.as_view(), name='puntos-plastico-update'),
    path('transpeso/', TransPesoCreateAPIView.as_view(), name='create-transpeso'),
    path('totalpesos/<str:email>/', peso_viewset, name='peso-usuario'),
    path('admin/stats/', views.admin_stats, name='admin-stats'),

    # path('save-weight/', views.save_weight, name='save_weight'),

    path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
    
	path('user', views.UserView.as_view(), name='user'),
	path('user/update/<str:email>/', views.UpdateUsuario.as_view(), name='user-update'),
    path('user/desactivar-cuenta/<str:email>', views.DesUsuario.as_view(), name='desactivar-cuenta'),
    path('user/delete/', views.DesactivarCuenta.as_view(), name='user-delete'),

    #Publicacion
    path('publicaciones/<int:idPublicacion>/', views.ActualizarEstado.as_view(), name='actualizar_estado'),
    path('publicaciones/<publicacion_id>/like/', views.dar_o_eliminar_like, name='dar_o_eliminar_like'),
    path('publicaciones/<int:idPublicacion>/comments/', views.comentarios_publicacion, name='comentarios_publicacion'),
    path('publicaciones/<int:idPublicacion>/comments/<int:idComentario>/', views.comentarios_publicacion, name='eliminar_comentario'),

    path('get-google-maps-api-key/', views.get_google_maps_api_key, name='get_google_maps_api_key'),
]   