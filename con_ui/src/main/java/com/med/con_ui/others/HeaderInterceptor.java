package com.med.con_ui.others;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class HeaderInterceptor implements HandlerInterceptor {
	@Value("${med.ui.api}")
	private String serverAddress;

	@Override
	public boolean preHandle(HttpServletRequest _request, HttpServletResponse response, Object _handler) throws Exception {
		response.addCookie(new Cookie("Med-Api-Address", serverAddress));
		return true;
	}
}
