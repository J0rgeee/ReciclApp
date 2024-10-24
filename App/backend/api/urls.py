from django.urls import path ,include
from rest_framework import routers # type: ignore
from rest_framework.documentation import include_docs_urls # type: ignore
from api import views
from . import views

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
router6.register(r'adminusuario',views.AdminUsuarios,'adminusuario')

router7 = routers.DefaultRouter()
router7.register(r'publi',views.PublicacionesView,'publi')

router8 = routers.DefaultRouter()
router8.register(r'regret',views.RetiroView,'regret')



urlpatterns = [
    path("PtoVerde/", include(router.urls)),
    path("TipoXPv/", include(router2.urls)),
    path("TipoRec/", include(router3.urls)),
    path("Comuna/", include(router4.urls)), 
    path("Ciudad/", include(router5.urls)),
    path("AdminUsuario/", include(router6.urls)),
    path("Publi/", include(router7.urls)),
    path("Regret/", include(router8.urls)),



    path("Docs/",include_docs_urls(title="docs api")),

    path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('user/update', views.UpdateUsuario.as_view(), name='user-update')
    
]   