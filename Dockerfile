FROM appcelerator/node:amp

# helpful for debugging in container (safe to remove)
RUN apt-get update && apt-get install -y vim bash

# node-inspector
EXPOSE 8080

# server app
EXPOSE 3000

# Add ContainerPilot
ENV CONTAINERPILOT=2.1.0
RUN curl -Lo /tmp/cb.tar.gz https://github.com/joyent/containerpilot/releases/download/$CONTAINERPILOT/containerpilot-$CONTAINERPILOT.tar.gz \
&& tar -xz -f /tmp/cb.tar.gz \
&& mv ./containerpilot /bin/
COPY containerpilot.json /etc/containerpilot.json
COPY ./start.sh /etc/start.sh
COPY ./stop.sh /etc/stop.sh

#ENV CONSUL=consul:8500
ENV CP_LOG_LEVEL=ERROR
ENV CP_TTL=20
ENV CP_POLL=5
ENV CONTAINERPILOT=file:///etc/containerpilot.json
ENV DEPENDENCIES="zookeeper kafka amp-log-agent"

CMD ["/etc/start.sh"]
