FROM httpd:2.4

# Create vhost folder in docker
RUN mkdir -p /usr/local/apache2/gates.vhost/gates/resources

# Overwrite httpd.conf inside docker
COPY http-config/httpd.conf /usr/local/apache2/conf/httpd.conf

# Overwrite vhosts conf inside docker
COPY http-config/http-vhosts.conf /usr/local/apache2/conf/extra/httpd-vhosts.conf

# Copy gates resources to docker
COPY public-html/gates/ /usr/local/apache2/gates.vhost/gates/resources

#docker cp public-html/gates/js/jquery.blockUI.js gates7:/usr/local/apache2/gates.vhost/gates/resources/js/jquery.blockUI.js
