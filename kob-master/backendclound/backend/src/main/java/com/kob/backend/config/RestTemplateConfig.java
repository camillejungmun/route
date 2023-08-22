package com.kob.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
//未来用它时，加一个Autowired就能把它注入映射进来
@Configuration //当我们需要用到一个东西时,定义一个@Configuration,然后加一个注解Bean,再return它的实例
public class RestTemplateConfig {
    @Bean
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }
}
