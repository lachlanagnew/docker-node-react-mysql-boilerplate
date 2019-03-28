# https://github.com/elastic/logstash-docker
FROM docker.elastic.co/logstash/logstash:5.6.15
USER root
RUN yum update -y
RUN yum install unzip -y
ADD https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.47.zip /opt
RUN unzip /opt/mysql-connector-java-5.1.47.zip -d /opt
ADD .logstash_jdbc_last_run_educations .
ADD .logstash_jdbc_last_run_users .
ADD .logstash_jdbc_last_run_interests .
# Add your logstash plugins setup here
RUN logstash-plugin install logstash-input-jdbc
# Example: RUN logstash-plugin install logstash-filter-json
RUN logstash-plugin install logstash-filter-aggregate
