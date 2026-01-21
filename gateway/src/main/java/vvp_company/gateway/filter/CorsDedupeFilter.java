package vvp_company.gateway.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

/**
 * Костыль для удаления дублирующихся CORS заголовков.
 * Если и Gateway, и микросервис добавляют заголовок, этот фильтр оставляет
 * только одно значение.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorsDedupeFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        chain.doFilter(request, response);

        if (response instanceof HttpServletResponse httpResponse) {
            dedupeHeader(httpResponse, "Access-Control-Allow-Origin");
            dedupeHeader(httpResponse, "Access-Control-Allow-Credentials");
            dedupeHeader(httpResponse, "Access-Control-Allow-Methods");
            dedupeHeader(httpResponse, "Access-Control-Allow-Headers");
            dedupeHeader(httpResponse, "Vary");
        }
    }

    private void dedupeHeader(HttpServletResponse response, String headerName) {
        Collection<String> values = response.getHeaders(headerName);
        if (values != null && values.size() > 1) {
            // Оставляем только первое значение (обычно это то, что добавил Gateway или
            // первый проснувшийся сервис)
            String firstValue = values.iterator().next();
            response.setHeader(headerName, firstValue);
        }
    }
}
