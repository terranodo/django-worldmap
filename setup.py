import os
from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))

setup(
    name='django-worldmap',
    version='0.1',
    author='Simone Dalmasso',
    author_email='simone.dalmasso@gmail.com',
    url='https://github.com/GeoNode/django-worldmap',
    description="Use the worldmap client in your GeoNode",
    long_description=open(os.path.join(here, 'README.md')).read() + '\n\n' +
                     open(os.path.join(here, 'CHANGES')).read(),
    license='LGPL, see LICENSE file.',
    install_requires=[],
    packages=find_packages(),
    include_package_data = True,
    zip_safe = False,
    classifiers  = ['Topic :: Utilities',
                    'Natural Language :: English',
                    'Operating System :: OS Independent',
                    'Intended Audience :: Developers',
                    'Environment :: Web Environment',
                    'Framework :: Django',
                    'Development Status :: 5 - Production/Stable',
                    'Programming Language :: Python :: 2.7'],
)