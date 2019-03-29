# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash:5.6.15
USER root

RUN yum update -y
RUN yum install unzip -y

ADD https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.47.zip /opt
RUN unzip /opt/mysql-connector-java-5.1.47.zip -d /opt

RUN logstash-plugin install logstash-input-jdbc
RUN logstash-plugin install logstash-filter-aggregate
