
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

dependencies {
    // Gson
    implementation ("com.google.code.gson:gson:2.8.6")

    // ignite
    implementation("org.apache.ignite:ignite-core:2.16.0")
    implementation("org.apache.ignite:ignite-spring:2.16.0")

    // AMQ
    implementation("org.apache.activemq:activemq-client:6.1.3")

    // Mongodb
    implementation("org.mongodb:mongodb-driver-sync:5.1.3")
    implementation("org.mongodb:bson:5.1.3")

    // Redis
    implementation("redis.clients:jedis:5.1.4")

    // XMl serializer
    implementation("javax.xml.bind:jaxb-api:2.3.1")
    implementation("org.glassfish.jaxb:jaxb-runtime:2.3.1")
}

