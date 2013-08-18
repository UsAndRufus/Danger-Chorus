from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'testapp.views.home'),
    # url(r'^hello/', include('hello.foo.urls')),
    url(r'^animal/(?P<pk>\d+)$', 'testapp.views.animal'),
    url(r'^api/(?P<pk>\d+)$', 'testapp.views.api'),
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
