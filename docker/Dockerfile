FROM ubuntu:22.04

# install  java
RUN apt update -y 
RUN apt install iputils-ping -y

# install java
RUN mkdir /java 
COPY ./java_sdk/java /java 

# environment variables
ENV JAVA_HOME=/java
ENV PATH="${JAVA_HOME}/bin:$PATH"
ENV MED_MAX_REATTEMPT=0xffffff
ENV MED_RECONNECT_WAIT=5000
ENV MED_WELL_ID="" 
ENV MED_LOG_NAME=""
ENV MED_QUEUE_NAME=""
ENV MED_QUEUE_ADDRESS=""

# dirs
RUN mkdir /app
WORKDIR /app
VOLUME [ "/app" ]

# executor
COPY ["./task_run.sh", "/"]
RUN chmod +x /task_run.sh

CMD ["/task_run.sh"]