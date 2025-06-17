package com.bkap.config;


import com.bkap.security.jwt.AuthEntryPointJwt;
import com.bkap.security.jwt.JwtRequestFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
public class WebConfigSecurity {

	@Autowired
	private JwtRequestFilter jwtRequestFilter;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(AbstractHttpConfigurer::disable)
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
			.authorizeHttpRequests(auth -> {
				auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
				auth.requestMatchers("/api/login", "/api/register", "/api/products/**", "/api/categories/**", "/api/forgot-password", "/api/reset-password", "/api/user/update-profile", "/uploads/**", "/logout").permitAll();
				auth.anyRequest().authenticated();
			})
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.logout(logout -> logout.disable());

		http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public UrlBasedCorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.addAllowedOrigin("http://localhost:3000"); // Allow your frontend origin
		configuration.addAllowedMethod("*"); // Allow all HTTP methods
		configuration.addAllowedHeader("*"); // Allow all headers
		configuration.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}