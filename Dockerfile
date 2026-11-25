# ==========================================
# Stage 1: Build
# ==========================================
FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN rm -rf con_manager/build/data && \
    mkdir -p con_manager/build/data/lib_data

RUN ./gradlew build jar --no-daemon

RUN mkdir -p con_manager/build/data/lib_data && \
    cp con_data/build/libs/con_data-1.0.0-plain.jar \
       con_manager/build/data/ && \
    cp -r con_data/build/lib_data/. \
       con_manager/build/data/lib_data/

# ==========================================
# Stage 2: Runtime
# ==========================================
FROM eclipse-temurin:17-jre AS runtime

WORKDIR /app

COPY --from=builder /app/con_manager/build/data/ /app/data/

ENV JAVA_OPTS=""

WORKDIR /app/data

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -cp 'con_data-1.0.0-plain.jar:lib_data/*' \"$@\"", "--"]
