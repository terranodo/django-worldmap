# GeoNode Client

This is the worldmap javascript client for GeoNode.
This project is not intended to run standalone.
Instead, it is meant to be used by GeoNode.
To use it you have to enable the 'geonode.contrib.worldmap' app
in the geonode INSTALLED_APPS settings.
In addition you have to add "from geonode.contrib.worldmap.settings import *" 
at the end of the settings file.
This will add worldmap specific settings they can be found in the geonode/conrtib/worldmap/settings.py file.

## Debug Mode

Loads all scripts uncompressed.

    cd worldmap/static/worldmap
    ant init
    ant debug

This will give you an application available at http://localhost:9090/ by
default.  You only need to run `ant init` once (or any time dependencies
change).

To make GeoNode use it
instead of the static, minified JavaScript resources, make the GeoNode's worldmap contrib app 
settings.py point to it by uncommenting:

    GEONODE_CLIENT_LOCATION = "http://localhost:9090/"


## Prepare App for Deployment

To create a minified application run the following:

    ant dist

The archive will be assembled in the build directory.
In the GeoNode's worldmap contrib app settings.py file uncomment:

    GEONODE_CLIENT_LOCATION = "/static/worldmap/build/app/static/"
