FROM httpd:2.4

# Create vhost folder in docker
RUN mkdir -p /usr/local/apache2/htdocs/gates.vhost

# Overwrite httpd.conf inside docker
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf

# Overwrite vhosts conf inside docker
COPY ./http-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf

# Copy gates resources to docker
COPY public-html/gates/ /usr/local/apache2/htdocs/gates.vhost/
